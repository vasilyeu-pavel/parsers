const puppeteer = require('puppeteer');

const { getAuthOptions, getMatchList } = require('./requestHelpers');
const { auth } = require('../../utils');
const chunkArray = require('../../utils/chunkArray');
const config = require('../../../config');
const { runCmdHandler } = require('../../downloader');

const downloader = async matchList => {
    const chunkMatches = chunkArray(matchList, 3);
    for (var i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i].map(({ ID }) =>
            runCmdHandler(
                './src/youtube-dl',
                `youtube-dl stor-2.staylive.se/seodiv/${ID}/720/720.m3u8 --output ${ID}.mp4`)
        ));
    }
};

const parser = async (name, limit, day) => {
    const url = config[name].url;
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    await auth(page, name);

    await page.waitForNavigation({ waitUntil: 'load' });

    const authOptions = await getAuthOptions(page);

    const matchList = await getMatchList(authOptions, name, limit, day);

    await browser.close();

    return matchList;
};

module.exports = {
    downloader, parser
};
