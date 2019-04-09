const puppeteer = require('puppeteer');
const { auth, getAuthOptions, getMatchList } = require('../../helpers/utils');
const config = require('../../../config');
const { runCmdHandler } = require('../../downloader');

const downloader = (arrLinks, count) => {
    let result = [];
    for (var i = 0; i < arrLinks.length; i++) {
        let link = `youtube-dl stor-2.staylive.se/seodiv/${arrLinks[i].ID}/720/720.m3u8 --output ${arrLinks[i].ID}.mp4`;
        result.push(runCmdHandler('./youtube-dl', link))
    }
    return Promise.all(result)
};

const filterForDate = (arr, dayAgo) => {
    let newDate = new Date(new Date - (86400 * 1000) * dayAgo);

    return arr.filter((el) => new Date(el.date) >= newDate.getDate());
};

const start = async matchList => {
    let filteredByDate = filterForDate(matchList, 9);
    let chunkMatches = chunkArray(filteredByDate, 3);
    for (var i = 0; i < chunkMatches.length; i++) {
        await downloader(chunkMatches[i], i)
    }
};

const parser = async (name, limit) => {
    const url = config[name].url;
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    await auth(page, name);

    await page.waitForNavigation({ waitUntil: 'load' });

    const authOptions = await getAuthOptions(page);

    const matchList = await getMatchList(authOptions, name, limit);

    console.log(matchList);

    await browser.close();
};

module.exports = {
    start, parser
};
