const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { auth, getCookies } = require('../../../utils');
const config = require('../../../../config');

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
        parserName
    }
) => {
    // go to signIn Page
    await page.evaluate((selector) => {
        [...document.querySelectorAll(selector)][1].click();
    }, signInSelector);

    await page.waitFor(3000);
    // hide cookies modal
    await page.evaluate((s) => document.querySelector(s).click(), cookiesModalSelector);

    // get all loaded iframes
    const framesSrc = await page.evaluate((s) => [...document.querySelectorAll('iframe')].map((f) => f.src));
    // filter iframes by target needed
    const filteredSrc = framesSrc.filter((src) => src.includes('nelonenmedia'));

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

const getUrl = (link, config) => {
    const url = new URL(link);
    url.search = new URLSearchParams(config);

    return url;
};

const getMatchId = (parseredResponse) => {
    const filteredRsponse = [];
    parseredResponse.items.forEach((el) => {
        filteredRsponse.push({
            id: el.id,
            title: el.title.split(', Fanikamera ')[0],
            date: el.title.split(', Fanikamera ')[1]
        });
    });

    return filteredRsponse;
};

const requestFromManifest = async (gatling_token, match) => {
    const { JSDOM } = jsdom;
    const url = getUrl('https://gatling.nelonenmedia.fi/media-xml-cache', {
        id: match.id,
        v: 2
    });

    const response = await fetch(url);
    const parseredResponse = await response.text();
    const dom = new JSDOM(parseredResponse);
    const manifest = `${dom.window.document.querySelector('SamsungMediaFile').innerHTML.split('/play')[0]}/playlist.m3u8`;
    const timestamp = `timestamp=${new Date().getTime()}`;

    return {
        url: `https://gatling.nelonenmedia.fi/auth/access/v2?stream=${manifest.split('/').join('%2f')}&${timestamp}&${gatling_token}`,
        ...match
    };
};

const getLeagueMatches = async ({ parserName, league }) => {
    const leagueOptions = config[parserName].leaguesOptions[league];

    const response = await fetch(getUrl(
        'https://prod-component-api.nm-services.nelonenmedia.fi/api/component/26611',
        leagueOptions)
    );

    const parsedResponse = await response.json();

    return getMatchId(parsedResponse);
};

const getMatches = async (gatling_token = 'gatling_token', d = convertDate(new Date()), parserName, league) => {
    const matches = await getLeagueMatches({ parserName, league });

    const result = await Promise.all(matches.map(requestFromManifest.bind(null, gatling_token)));

    const filteredReslut = [];

    result.forEach((item) => {
        [d].forEach((date) => {
            if (item.date === date) filteredReslut.push(item);
        });
    });

    const matchesToDownload = [];

    for (const { url, ...matchOptions } of filteredReslut) {
        const manifestWithToken = await fetch(url);
        const urlWithToken = await manifestWithToken.text();
        await new Promise((res) => setTimeout(() => res(true), 2000));

        matchesToDownload.push({
            ...matchOptions,
            url: urlWithToken
        });
    }

    return matchesToDownload;
};

const convertDate = (targetDate) => {
    const date = new Date(targetDate);
    const d = date.getDate();
    const m = date.getMonth() + 1;

    return `${d}.${m}.`;
};


module.exports = {
    getAuthToken,
    getMatches,
    convertDate
};
