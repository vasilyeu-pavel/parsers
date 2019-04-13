const fetch = require('node-fetch');
const moment = require('moment-timezone');
const jsdom = require('jsdom');

const chunkArray = require('../../utils/chunkArray');
const config = require('../../../config');

const dataSports = [
    /* {
         id: '24649df6-3225-49ff-b9cb-ba3100d43db6',
         name: 'basket'
     },
     {
         id: '52aa1912-2e88-4fdb-bf82-76719f91c53c',
         name: 'handball',
     },
     {
             id: '01371b25-75da-4587-a347-ad3bf0e63971',
             name: 'hockey'
         }, */
     {
         id: 'a1da5593-7bc1-4c70-92da-19e5953a1f9b',
         name: 'football'
     }
];

const getEventList = async (id, day) => {
    const res = await fetch(`https://services.api.no/api/hjallis/v2/front?sport=${id}`);
    const { entities: { events } } = await res.json();

    if (!events || !Object.values(events).length) return;

    return Object.values(events)
        .filter((event) => moment(event.timespan.start).format("YYYY-MM-DD") === moment(day).format("YYYY-MM-DD"))
        .map(event => console.log(event) || ({
            name: event.title.trim().replace(/\s/g, ""),
            start: moment(event.timespan.start).format('YYYY-MM-DD'),
            id: event._id,
            sport: event.sport.name,
        }));
};

const getVideoId = async (eventId) => {
    const res = await fetch(`https://services.api.no/api/hjallis/v2/event/${eventId}`);
    const props = await res.json();
    const { video }  = props;

    if (!video ) return;
    const { videoId } = video;
    return { videoId };
};

const getVideoIds = (eventList) => new Promise(resolve => {
    Promise.all(eventList.map(async event => {
        const video = await getVideoId(event.id);
        if (!video) return {};
        return ({ videoId: video.videoId, ...event })
    }))
        .then(events => resolve(events));
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

const getLinkIds = (videoIds) => new Promise(resolve => {
    Promise.all(videoIds.map(async event => ({
        ...event,
        linkId: await getLinkId(event.videoId)
    }))).then(res => resolve(res))
});

// ID, name, date, url, league
const getUrls = async (id, day) => {
    const eventList = await getEventList(id, day);
    const videoIds = await getVideoIds(eventList);

    const events = await getLinkIds(videoIds.filter(videoId => Object.keys(videoId).length));
    return chunkArray(events.map(({ linkId, start, name }) => ({
        url: `https://lw-amedia-cf.lwcdn.com/hls/${linkId}/playlist.m3u8`,
        name: name,
        date: start,
        ID: linkId
    })), 5);
};

const downloader = async (urls, sport) =>
    await Promise.all(urls.map(url =>
        runCmdHandler('./youtube-dl', `youtube-dl ${url.url} --output ${sport}/${url.name}.mp4`)
    ));

const controller = async ({ id, name }, day) => {
    const urls = await getUrls(id, day);
    // console.log(urls)
    // for(const chunkUrls of urls) {
    //     await downloader(chunkUrls, name);
    // }
};

const parser = async (browser, name, limit, day) => {
    const sports = config[name].sports;

    for(const sport of sports) {
        await controller(sport, day);
    }
};

module.exports = {
    downloader, parser
};
