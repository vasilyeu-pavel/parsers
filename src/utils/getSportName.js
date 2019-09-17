const getSportNameByParserName = (parserName) => {
    if (['ettan', 'mediabank', 'nasport'].includes(parserName)) {
        return 'football';
    }

    return 'hockey';
};

module.exports = {
    getSportNameByParserName
};
