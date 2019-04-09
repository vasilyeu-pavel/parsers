const { printHeader } = require('./src/utils/printHeader');
const { getQuestions } = require('./src/questions');

let error = null;

const startScraping = async (parserName, day) => {
    const { downloader, parser } = require(`./src/extractors/${parserName}`);
    const matches = await parser(parserName, 100, day);
    if (!matches.length) return;
    await downloader(matches);
};

const parsers = async () => {
    printHeader();
    if (error) console.log(error.message);

    try {
        const {day, parsersList} = await getQuestions();
        await Promise.all(parsersList.map(parserName => startScraping(parserName, day)));
        error = null;
    } catch (e) {
        error = e;
    } finally {
      parsers()
    }
};

parsers();
