const config = require('../../../config');
const { auth, getPage, getCookies } = require('../../utils');
const { cookiesParser, getMatchList } = require('./helpers');

const downloader = () => {

};

const parser = async (browser, name, limit, day) => {
    const url = config[name].url;

    const page = await getPage(browser, url);

    await auth(page, name);

    await page.waitForNavigation({ waitUntil: 'load' });

    const cookies = await getCookies(page);

    const parsedCookies = cookiesParser(cookies);

    await getMatchList(parsedCookies, name);

    await page.close();
};

module.exports = {
    downloader, parser
};
