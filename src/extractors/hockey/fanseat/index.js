const moment = require('moment-timezone');
const fetch = require('node-fetch');

const parseUrlString = thumbnail => {
    if (!thumbnail) return;

    const url = thumbnail.split('/');
    url.pop();
    return url.join('/');
};

const getMatchList = async ({ selectedDate, parserName }) => {
    try {
        const res = await fetch('https://api.staylive.tv/videos/feed?limit=100&page=1', {
            headers: {
                'x-staylive-channels': '1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1918,1919,1970'
            }
        });
        const { message } = await res.json();

        if (!message || !message.length) return [];

        return message
            .filter(({ created_at }) => moment(created_at).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'))
            .map(({
                id, created_at, name, channelName, url_string, thumbnail
            }) => ({
                id,
                date: moment(created_at).format('YYYY-MM-DD'),
                name: `${name}-${channelName}`,
                // url: `https://stor-2.staylive.se/seodiv/${parseUrlString(url_string) || id}/720/720.m3u8`
                // https://video-cache-sto-01.staylive.se/dggxwju/720/720.m3u8
                url: `${parseUrlString(thumbnail)}/720/720.m3u8`,
                scrapedDate: selectedDate,
                parserName,
            }));
    }
    catch (e) {
        throw new Error('ошибка в запросе за списком матчей fanseat');
    }
};

const parser = async (browser, name, limit, selectedDate) =>
    await getMatchList({
        selectedDate,
        parserName: name,
    });

module.exports = {
    parser,
};
