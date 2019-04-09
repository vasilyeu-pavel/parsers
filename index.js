const { start, parser } = require('./src/extractors/ettan');

const parsers = async () => {
    await parser('ettan', 100);
};

parsers();
