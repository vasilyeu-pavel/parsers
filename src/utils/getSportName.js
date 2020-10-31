const getSportNameByParserName = (parserName) => {
    if (['mediabank', 'nasport'].includes(parserName)) {
        return 'football';
    }

    return 'hockey';
};

module.exports = {
    getSportNameByParserName
};
