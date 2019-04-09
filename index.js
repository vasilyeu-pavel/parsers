const { start, parser } = require('./src/extractors/ettan');

const parsers = async () => {
    const matches = await parser('ettan', 100);
    await start(matches);
};

parsers();
