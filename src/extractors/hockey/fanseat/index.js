const moment = require('moment-timezone');
const fetch = require('node-fetch');
const config = require('../../../../config');
const { auth, getPage, getCookies, cookiesParser } = require('../../../utils');

const TOKEN = 'x-staylive-token';

const getMatchList = async ({ selectedDate, parserName, token }) => {
    try {
        const res = await fetch('https://api.staylive.tv/videos/feed?limit=100&page=1', {
            headers: {
                'x-staylive-channels': '1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1918,1919,1970'
            }
        });
        const { message } = await res.json();

        if (!message || !message.length) return [];

        const filteredMatches = message
            .filter(({ created_at }) => moment(created_at).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'));

        if (!filteredMatches.length) return [];

        const matches = await Promise.all(filteredMatches.map(async (match) => {
            const response = await fetch(`https://api.staylive.tv/videos/${match.id}`, {
                headers: {
                    [TOKEN]: token,
                }
            });
            const { message: res } = await response.json();

            return {
                ...match,
                url: res.playback_url
            }
        }));


        return matches.map(({ id, created_at, name, channelName, url }) => ({
            id,
            date: moment(created_at).format('YYYY-MM-DD'),
            name: `${name}-${channelName}`,
            scrapedDate: selectedDate,
            parserName,
            url,
        }));
    }
    catch (e) {
        console.log(e);
        throw new Error('ошибка в запросе за списком матчей fanseat');
    }
};

const parser = async (browser, name, limit, selectedDate) => {
    const { url } = config[name];

    const page = await getPage(browser, url);

    await auth(page, name);

    await page.waitFor(5000);

    // get cookies
    const cookies = await getCookies(page);

    const token = cookiesParser(cookies, TOKEN);

    if (!token) return [];

    return await getMatchList({
        selectedDate,
        parserName: name,
        token: token.split(TOKEN)[1].slice(1),
    });
};

module.exports = {
    parser,
};
