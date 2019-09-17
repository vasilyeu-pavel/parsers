const puppeteer = require('puppeteer');
const { printHeader } = require('./src/utils/printHeader');
const chunkArray = require('./src/utils/chunkArray');
const { getQuestions, selectMode, questionsForDownloadSimpleMatch } = require('./src/questions');
const { customsData } = require('./src/customsData');
const { getSportNameByParserName } = require('./src/utils/getSportName');

let error = null;

const startScraping = async (browser, parserName, day) => {
    const sportName = getSportNameByParserName(parserName);

    const { downloader, parser } = require(`./src/extractors/${sportName}/${parserName}`);

    const matches = await parser(browser, parserName, 100, day);

    if (!matches.length) return;
    await downloader(matches, parserName);
};

const parsers = async () => {
    printHeader();
    if (error) console.log(error);

    try {
        const { choice } = await selectMode();
        switch (choice) {
            case 'Использовать парсеры': {
                const { day, parsersList } = await getQuestions();
                const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });

                const result = await Promise.all(parsersList.map((parserName) => startScraping(browser, parserName, day)));
                error = null;
                await browser.close();
                return result;
            }
            case 'Скачать матч ydl': {
                const { downloader } = require('./src/downloadSimpleMatch');
                console.log('Скачать матч ydl');
                const { url, name, options } = await questionsForDownloadSimpleMatch();
                return await downloader({ url, name, options });
            }
            case 'Скачать матчи из файла': {
                const { downloader } = require('./src/downloadSimpleMatch');
                console.log('Скачать матчи из файла');
                const chunkMatches = chunkArray(customsData(), 5);

                for (const chunkUrls of chunkMatches) {
                    await Promise.all(chunkUrls.map(({ id, url }) => downloader({ url, name: `${id}`, options: '--hls-prefer-native' })));
                }
                return;
            }
            case 'Выход!': {
                console.log('Выход!');
                break;
            }
        }
    }
    catch (e) {
        error = e;
        console.log(error);
    }
};

parsers();
