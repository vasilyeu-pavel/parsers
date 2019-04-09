const fetch = require('node-fetch');
const config = require('../../config');
const formatDate = require('./formatDate');

const auth = async (page, parserName) => {
    const { login, password, loginSelector, passwordSelector, submitButton } = config[parserName];

    await page.waitForSelector(loginSelector);
    const loginInput = await page.$(loginSelector);
    await loginInput.type(login);

    await page.waitForSelector(passwordSelector);
    const passwordInput = await page.$(passwordSelector);
    await passwordInput.type(password);

    await page.waitForSelector(submitButton);
    const btn = await page.$(submitButton);
    btn.click();
};

const getCoockies = async page => await page.cookies();

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
    const coockies = await getCoockies(page);

    return parsedCoockies(coockies);
};

const getPrevDay = () => {
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 3);
    return prevDate;
};

const filterByDay = ({ date, duration }) =>
    (formatDate(date) === formatDate()
        || formatDate(date) === formatDate(getPrevDay()))
    && +duration.split(':')[0] >= 1;

const getMatchList = async (authOptions, parserName, limit) => {
    const { matchesUrl } = config[parserName];

    const res = await fetch(`${matchesUrl}${limit}`, {
        method: 'GET',
        headers: authOptions
    });
    const matches = await res.json();

    return matches.filter(filterByDay);
};

module.exports = { auth, getAuthOptions, getMatchList };
