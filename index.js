const puppeteer = require('puppeteer');
const { printHeader } = require('./src/utils/printHeader');
const chunkArray = require('./src/utils/chunkArray');
const downloader = require('./src/utils/downloadController');
const { getQuestions, selectMode, questionsForDownloadSimpleMatch } = require('./src/questions');
const { customsData } = require('./src/customsData');
const { getSportNameByParserName } = require('./src/utils/getSportName');
const { printInNewTab } = require('./src/utils/runCmdHandler');

let error = null;

const startScraping = async (browser, parserName, day) => {
    const [scraperName, league] = parserName.split('-');
    const sportName = getSportNameByParserName(parserName);

    const { parser } = require(`./src/extractors/${sportName}/${scraperName}`);

    const matches = await parser(browser, scraperName, 100, day, league);

    return await downloader(matches);
};

const parsers = async () => {
    printHeader();
    if (error) console.log(error);

    try {
        const { choice } = await selectMode();

        switch (choice) {
            case 'Использовать парсеры': {
                const { day, parsersList } = await getQuestions();
                const browser = await puppeteer.launch({
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--start-maximized',
                    ],
                    headless: true,
                });

                await Promise.all(parsersList.map((parserName) =>
                    startScraping(browser, parserName, day))
                );
                error = null;
                await browser.close();
                return parsers();
            }
            case 'Скачать матч ydl': {
                console.log('Скачать матч ydl');
                const { url, name, options } = await questionsForDownloadSimpleMatch();
                await downloader({
                    url,
                    name,
                    options,
                    scrapedDate: new Date(),
                    parserName: 'RANDOM',
                });
                return parsers();
            }
            case 'Скачать матчи из файла': {
                console.log('Скачать матчи из файла');
                const chunkMatches = chunkArray(customsData(), 5);

                for (const chunkUrls of chunkMatches) {
                    await Promise.all(chunkUrls.map(({ id, url }) =>
                        downloader({
                            url,
                            name: `${id}`,
                            scrapedDate: new Date(),
                            parserName: 'RANDOM',
                        })),
                    );
                }
                return parsers();
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
        printInNewTab(e.toString());
        parsers().catch(e => console.log(e));
    }
};

parsers().catch(e => console.log(e));
