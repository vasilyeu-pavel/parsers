const { getPage } = require('../../../utils');
const chunkArray = require('../../../utils/chunkArray');
const formatDate = require('../../../utils/formatDate');
const config = require('../../../../config');
const { runCmdHandler } = require('../../../downloader');
const { sendTelegramMessage } = require('../../../telegramBot');
const { getAuthToken, getMatches, convertDate } = require('./helpers');

const { isDownloading } = require('../../../utils/fileAPI');

const downloader = async (matchList, parserName, day) => {
    const chunkMatches = chunkArray(matchList, 9);
    for (let i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i].map(({
            id, name, date, url
        }) =>
            !isDownloading(`${parserName}/${formatDate(day)}_${name.replace(/ /g, '')}.mp4`)
            && runCmdHandler(
            './src/youtube-dl',
            `youtube-dl --hls-prefer-native ${url} --output ${parserName}/${formatDate(day)}_${name.replace(/ /g, '')}.mp4`
        )));
        await sendTelegramMessage({
            league: parserName,
            matches: chunkMatches[i]
        });
    }
};

const parser = async (browser, name, limit, day, league) => {
    const { url } = config[name];

    const date = convertDate(day);

    const page = await getPage(browser, url, false);

    const token = await getAuthToken({ page, ...config[name], parserName: name });

    return await getMatches(token, date, name, league);
};

module.exports = {
    parser,
    downloader
};
