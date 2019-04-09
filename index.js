const { downloader, parser } = require('./src/extractors/ettan');

const parsers = async () => {
    const matches = await parser('ettan', 100);
    await downloader(matches);
};

parsers();
