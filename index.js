const puppeteer = require('puppeteer');
const chalk = require("chalk");
const { printHeader } = require('./src/utils/printHeader');
const { getQuestions, selectMode, questionsForDownloadSimpleMatch } = require('./src/questions');

let error = null;

const startScraping = async (browser, parserName, day) => {
    const { downloader, parser } = require(`./src/extractors/${parserName}`);

    const matches = await parser(browser, parserName, 100, day);

    if (!matches.length) return;
    await downloader(matches, parserName);
};

const parsers = async () => {
    printHeader();
    if (error) console.log(chalk.red(error.message));

    try {
        const { choice } = await selectMode();
        switch (choice) {
            case 'Использовать парсеры': {
                const { day, parsersList } = await getQuestions();
                const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });

                await Promise.all(parsersList.map(parserName => startScraping(browser, parserName, day)));
                error = null;
                await browser.close();
                break;
            }
            case 'Скачать матч ydl': {
                const { downloader } = require('./src/downloadSimpleMatch');
                console.log('Скачать матч ydl');
                const { url, name, options } = await questionsForDownloadSimpleMatch();
                await downloader({ url, name, options });
                break;
            }
            case 'Выход!': {
                console.log('Выход!');
                break;
            }
        }
    } catch (e) {
        error = e;
        console.log(chalk.red(error.message));
    }
};

parsers();
