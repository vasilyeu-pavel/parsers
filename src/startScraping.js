const puppeteer = require('puppeteer');
const { parentPort, workerData } = require('worker_threads');
const { getSportNameByParserName } = require('./utils');

const { parserName, day } = workerData;

const startScraping = async () => {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--start-maximized'
        ],
        headless: true
    });
    const [scraperName, league] = parserName.split('-');
    const sportName = getSportNameByParserName(parserName);

    const { parser } = require(`./extractors/${sportName}/${scraperName}`);

    const matches = await parser(browser, scraperName, 100, day, league);

    await browser.close();

    parentPort.postMessage({ matches });
};

startScraping().catch((e) => console.log(e));
