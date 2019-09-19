const moment = require('moment-timezone');
const { getPage, auth } = require('../../../utils');
const chunkArray = require('../../../utils/chunkArray');
const formatDate = require('../../../utils/formatDate');
const config = require('../../../../config');
const { runCmdHandler } = require('../../../downloader');
const { sendTelegramMessage } = require('../../../telegramBot');
const fetch = require('node-fetch');
// const { getAuthToken, getMatches, convertDate } = require('./helpers');

const downloader = async (matchList, parserName, day) => {
    const chunkMatches = chunkArray(matchList, 7);
    for (let i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i].map(({ id, title, date, url }) => runCmdHandler(
            './src/youtube-dl',
            `youtube-dl --hls-prefer-native ${url} --output ${parserName}/${formatDate(day)}_${title.replace(/ /g, '')}.mp4`
        )));
        await sendTelegramMessage({
            league: parserName,
            matches: chunkMatches[i]
        });
    }
};

const getMatchList = async ({ selectedDate }) => {
    try {
        const res = await fetch('https://api.staylive.tv/videos/feed?limit=100&page=1', {
            headers: {
                'x-staylive-channels': '1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1918,1919,1970',
            }
        });
        const { message } = await res.json();

        if (!message || !message.length) return [];

        return message.filter(({ created_at }) => moment(created_at).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'))
    } catch (e) {
        throw new Error('ошибка в запросе за списком матчей fanseat');
    }
};

const parser = async (browser, name, limit, selectedDate) => {
    const { url } = config[name];
    // const page = await getPage(browser, url, false);
    // await auth(page, name);

    const matchList = await getMatchList({ selectedDate });

    console.log(matchList);

    return [];
};

module.exports = {
    parser,
    downloader
};
