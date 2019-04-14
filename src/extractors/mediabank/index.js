const config = require('../../../config');
const { auth, getPage, getCookies } = require('../../utils');
const { cookiesParser, getMatchList } = require('./helpers');
const { runCmdHandler } = require('../../downloader');
const { sendTelegramMessage } = require('../../telegramBot');
const chunkArray = require('../../utils/chunkArray');

const downloader = async (matchList, parserName) => {
    const chunkMatches = chunkArray(matchList, 5);
    for (let i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i].map(({ ID, name, date, url, league }) =>
            runCmdHandler(
                './src/youtube-dl',
                `youtube-dl --hls-prefer-native ${url} --output ${parserName}/${league}/${date}_${name}.mp4`)
        ));
        sendTelegramMessage({
            league: chunkMatches[i][0].league,
            matches: chunkMatches[i].map(({ name, date }) => `${date}_${name}`)
        });
    }
};

const parser = async (browser, name, limit, day) => {
    const url = config[name].url;

    const page = await getPage(browser, url);

    await auth(page, name);

    await page.waitForNavigation({ waitUntil: 'load' });

    const cookies = await getCookies(page);

    const parsedCookies = cookiesParser(cookies);

    await page.close();

    const matchList = await getMatchList(parsedCookies, name, day);

    return matchList;
};

module.exports = {
    downloader, parser
};
