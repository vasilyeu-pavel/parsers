const config = require('../../../../config');
const { auth, getPage, getCookies } = require('../../../utils');
const { cookiesParser, getMatchList } = require('./helpers');

const parser = async (browser, name, limit, day) => {
    const { url } = config[name];

    const page = await getPage(browser, url);

    await auth(page, name);

    await page.waitForNavigation({ waitUntil: 'load' });

    const cookies = await getCookies(page);

    const parsedCookies = cookiesParser(cookies);

    await page.close();

    const matches = await getMatchList(parsedCookies, name, day);

    return matches.map((match) => ({
        ...match,
    }));
};

module.exports = {
    parser
};
