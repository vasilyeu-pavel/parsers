const { auth, getPage, getCookies } = require('../../../utils');
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

const cookiesParser = (cookies) => {
    const arrFiltered = cookies.filter((el) => el.name === 'gatling_token');

    let str = '';
    for (let i = 0; i < arrFiltered.length; i++) {
        const elCookies = `${arrFiltered[i].name}=${arrFiltered[i].value}`;
        str += elCookies;
    }

    return str;
};

const getAuthToken = async (
    {
        page,
        signInSelector,
        cookiesModalSelector,
        parserName,
    }
) => {
    // go to signIn Page
    await page.evaluate((selector) => {
        [...document.querySelectorAll(selector)][1].click()
    }, signInSelector);

    await page.waitFor(3000);
    // hide cookies modal
    await page.evaluate(s => document.querySelector(s).click(), cookiesModalSelector);

    // get all loaded iframes
    const framesSrc = await page.evaluate(s => [...document.querySelectorAll('iframe')].map(f => f.src));
    // filter iframes by target needed
    const filteredSrc = framesSrc.filter(src => src.includes('nelonenmedia'));

    if (!filteredSrc.length) throw new Error('Ruutu auth frame is not loaded');

    // go to redirect_url
    await page.goto(filteredSrc[0]);

    await page.waitFor(1000);

    // enter sign in form
    await auth(page, parserName);

    await page.waitFor(5000);

    // get cookies
    const cookies = await getCookies(page);

    const parsedCookies = cookiesParser(cookies);

    return parsedCookies;
};

const parser = async (browser, name, limit, day) => {
    const { url } = config[name];
    const page = await getPage(browser, url, false);

    const authToken = await getAuthToken({ page, ...config[name], parserName: name });

    return [];
};

module.exports = {
    parser
};
