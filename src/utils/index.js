const config = require('../../config');

const blockedResourceTypes = [
    'image',
    'media',
    'font',
    'texttrack',
    'object',
    'beacon',
    'csp_report',
    'imageset',
    'stylesheet'
];

const skippedResources = [
    'quantserve',
    'adzerk',
    'doubleclick',
    'adition',
    'exelator',
    'sharethrough',
    'cdn.api.twitter',
    'google-analytics',
    'googletagmanager',
    'google',
    'fontawesome',
    'facebook',
    'analytics',
    'optimizely',
    'clicktale',
    'mixpanel',
    'zedo',
    'clicksor',
    'tiqcdn',
    '.png',
    'jquery'
];

const auth = async (page, parserName) => {
    const {
        login, password, loginSelector, passwordSelector, submitButton
    } = config[parserName];

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

const getCookies = (page) => page.cookies();

const getPage = async (browser, url) => {
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36'
    );

    try {
        await page.setRequestInterception(true);

        page.on('request', (request) => {
            if (
                blockedResourceTypes.indexOf(request.resourceType()) !== -1
                || skippedResources.some((resource) => request.url().includes(resource))
            ) {
                request.abort();
            }
            else {
                request.continue();
            }
        });

        page.on('dialog', async (dialog) => {
            await dialog.dismiss();
        });

        await page.goto(url, {
            waitLoad: true,
            waitNetworkIdle: true,
            timeout: 29000,
            waitUntil: 'networkidle0'
        });

        return page;
    }
    catch (e) {
        throw new Error(`Ошибка открытия страницы, ${e.message}`);
    }
};

module.exports = { auth, getCookies, getPage };
