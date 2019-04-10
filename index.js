const puppeteer = require('puppeteer');
const chalk = require("chalk");
const { printHeader } = require('./src/utils/printHeader');
const { getQuestions } = require('./src/questions');

let error = null;

const startScraping = async (browser, parserName, day) => {
    const { downloader, parser } = require(`./src/extractors/${parserName}`);

    const matches = await parser(browser, parserName, 100, day);
    if (!matches.length) return;
    // await downloader(matches, parserName);
};

const parsers = async () => {
    printHeader();
    if (error) console.log(chalk.red(error.message));

    try {
        const {day, parsersList} = await getQuestions();
        const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false });
        await Promise.all(parsersList.map(parserName => startScraping(browser, parserName, day)));
        error = null;
        await browser.close();
    } catch (e) {
        error = e;
    } finally {
      parsers()
    }
};

parsers();
