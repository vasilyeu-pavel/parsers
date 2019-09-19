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

    // await page.waitForSelector(loginSelector);
    await page.waitFor(500);
    const loginInput = await page.$(loginSelector);
    await loginInput.type(login);

    // await page.waitForSelector(passwordSelector);
    await page.waitFor(500);
    const passwordInput = await page.$(passwordSelector);
    await passwordInput.type(password);

    // await page.waitForSelector(submitButton);
    await page.waitFor(500);
    const btn = await page.$(submitButton);
    btn.click();
};

const getFrame = async (page, { frameName, parserName }) => {
    if (!page) return;

    try {
        await page.waitFor(3000);
    }
    catch (e) {
        throw new Error(`Not found iFrame -> ${frameName} in ${parserName}, ${e}`);
    }

    const frames = {};

    function deepSearchFrame(frame, indent, targetName) {
        if (frame.name() === targetName) {
            frames[targetName] = frame;
        }
        for (const child of frame.childFrames()) {
            deepSearchFrame(child, `${indent}  `, targetName);
        }
    }

    deepSearchFrame(page.mainFrame(), '', frameName);

    return frames[frameName];
};


const getCookies = async (page) => await page.cookies();

const getPage = async (browser, url, isLoadScript = true) => {
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36'
    );

    try {
        if (isLoadScript) {
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
        }

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

const cookiesParser = (cookies, taretName = 'gatling_token') => {
    const arrFiltered = cookies.filter((el) => el.name === taretName);

    let str = '';
    for (let i = 0; i < arrFiltered.length; i++) {
        const elCookies = `${arrFiltered[i].name}=${arrFiltered[i].value}`;
        str += elCookies;
    }

    return str;
};

module.exports = {
    auth,
    getCookies,
    getPage,
    getFrame,
    cookiesParser,
};
