const { getPage } = require('../../../utils');
const config = require('../../../../config');
const { getAuthToken, getMatches, convertDate } = require('./helpers');

const parser = async (browser, name, limit, day, league) => {
    const { url } = config[name];

    const date = convertDate(day);

    const page = await getPage(browser, url, false);

    const token = await getAuthToken({ page, ...config[name], parserName: name });

    const matches = await getMatches(token, date, name, league);

    return matches.map((match) => ({
        ...match,
        scrapedDate: day,
        parserName: name,
    }))
};

module.exports = {
    parser,
};
