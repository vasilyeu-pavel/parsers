const fetch = require('node-fetch');
const formatDate = require('../../utils/formatDate');
const config = require('../../../config');
const { getCookies } = require('../../utils');

const parsedCoockies = coockies => {
    const result = {};
    coockies.forEach(({ name, value }) => {
        switch (name) {
            case 'unikey': return result['Auth-Token'] = value;
            case 'u_ID': return result['Auth-ID'] = value;
            case 'organization': return result['Auth-Organization'] = value;
        }
    });

    return result;
};

const getAuthOptions = async page => {
    const cookies = await getCookies(page);

    return parsedCoockies(cookies);
};

const filterByDay = (day, { date, duration }) =>
    (formatDate(date) === formatDate(day))
    && +duration.split(':')[0] >= 1;

const getMatchList = async (authOptions, parserName, limit, day) => {
    const { matchesUrl } = config[parserName];

    const res = await fetch(`${matchesUrl}${limit}`, {
        method: 'GET',
        headers: authOptions
    });
    const matches = await res.json();

    return matches.filter(filterByDay.bind(null, day));
};

module.exports = {
    getMatchList, getAuthOptions
};
