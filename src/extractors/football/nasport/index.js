const fetch = require('node-fetch');
const moment = require('moment-timezone');
const jsdom = require('jsdom');

const formatDate = require('../../../utils/formatDate');
const chunkArray = require('../../../utils/chunkArray');
const config = require('../../../../config');

const { runCmdHandler } = require('../../../downloader');
const { sendTelegramMessage } = require('../../../telegramBot');

const getEventList = async (id, day) => {
    const res = await fetch(`https://services.api.no/api/hjallis/v2/front?sport=${id}`);
    const { entities: { events } } = await res.json();
    if (!events || !Object.values(events).length) return;

    const eventList = Object.values(events)
        .filter((event) => moment(event.timespan.start).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD'))
        .filter((event) => event && event.game && event.game.league)
        .map((event) => ({
            name: event.title.trim().replace(/\s/g, ''),
            start: moment(event.timespan.start).format('YYYY-MM-DD'),
            id: event._id,
            sport: event.sport.name,
            league: config.nasport.sports[0].leagues[event.game.league._id]
                && config.nasport.sports[0].leagues[event.game.league._id].replace(/\s/g, '').replace(/\-/g, '')
        }))
        .filter(({ league }) => league);

    return eventList;
};

const getVideoId = async (eventId) => {
    const res = await fetch(`https://services.api.no/api/hjallis/v2/event/${eventId}`);
    const props = await res.json();
    const { video } = props;

    if (!video) return;
    const { videoId } = video;
    return { videoId };
};

const getVideoIds = (eventList) => new Promise((resolve) => {
    Promise.all(eventList.map(async (event) => {
        const video = await getVideoId(event.id);
        if (!video) return {};
        return ({ videoId: video.videoId, ...event });
    }))
        .then((events) => resolve(events));
});

const getLinkId = async (videoId) => {
    const { JSDOM } = jsdom;
    const res = await fetch(`https://ljsp.lwcdn.com/api/video/embed.jsp?id=${videoId}`);
    const response = await res.text();

    const dom = new JSDOM(response);
    const container = dom.window.document.querySelector('#flowplayer-ovp-container');
    if (container) {
        return container.getAttribute('data-id');
    }
};

const getLinkIds = (videoIds) => new Promise((resolve) => {
    Promise.all(videoIds.map(async (event) => ({
        ...event,
        linkId: await getLinkId(event.videoId)
    }))).then((res) => resolve(res));
});

const getUrls = async (id, day) => {
    const eventList = await getEventList(id, day);
    const videoIds = await getVideoIds(eventList);
    console.log(eventList);

    const events = await getLinkIds(videoIds.filter((videoId) => Object.keys(videoId).length));
    return chunkArray(events.map(({
        linkId, start, name, league
    }) => ({
        url: `https://lw-amedia-cf.lwcdn.com/hls/${linkId}/playlist.m3u8`,
        name,
        date: start,
        ID: linkId,
        league
    })), 10);
};

const downloader = async (urls, parserName) => {
    for (const chunkUrls of urls) {
        await Promise.all(chunkUrls.map((url) => runCmdHandler(
            './src/youtube-dl',
            `youtube-dl --hls-prefer-native ${url.url} --output ${parserName}/${formatDate(url.date)}_${url.name.replace(/ /g, '')}.mp4`
        )));
        await sendTelegramMessage({
            league: parserName,
            matches: chunkUrls
        });
    }
};

const controller = async ({ id }, day) => await getUrls(id, day);

const parser = async (browser, name, limit, day) => {
    const { sports } = config[name];

    for (const sport of sports) {
        return await controller(sport, day);
    }
};

module.exports = {
    downloader, parser
};
