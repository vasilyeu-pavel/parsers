const { auth, getPage } = require('../../../utils');
const chunkArray = require('../../../utils/chunkArray');
const formatDate = require('../../../utils/formatDate');
const config = require('../../../../config');
const { runCmdHandler } = require('../../../downloader');
const { sendTelegramMessage } = require('../../../telegramBot');

const downloader = async (matchList, parserName) => {
    const chunkMatches = chunkArray(matchList, 7);
    for (let i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i].map(({ ID, name, date }) => runCmdHandler(
            './src/youtube-dl',
            `youtube-dl --hls-prefer-native stor-2.staylive.se/seodiv/${ID}/720/720.m3u8 --output ${parserName}/${formatDate(date)}_${name.replace(/ /g, '')}.mp4`
        )));
        await sendTelegramMessage({
            league: parserName,
            matches: chunkMatches[i]
        });
    }
};

const signIn = async ({ page, signInSelector }) => {
    // go to signIn Page
    await page.evaluate((selector) => {
        [...document.querySelectorAll(selector)][1].click()
    }, signInSelector);
    // todo Pavel: disable coockie modal
    // todo Pavel: enter signIn form
    // todo Pavel: get token from cookies
};

const parser = async (browser, name, limit, day) => {
    const {
        url,
        login,
        password,
        signInSelector,

    } = config[name];
    const page = await getPage(browser, url, false);
    await signIn({ page, signInSelector });

    return [];
};

module.exports = {
    parser
};
