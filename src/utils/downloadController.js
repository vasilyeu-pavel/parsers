const formatDate = require('./formatDate');
const { runCmdHandler } = require('./runCmdHandler');
const { isDownloading, JSONMatches } = require('./readFile');

const getSavedName = ({ league, date, name }) => {
    const matchName = name.replace(/ /g, '');
    return `${league}/${formatDate(date)}_${matchName}.mp4`;
};

const download = async (match) => {
    const savedName = getSavedName(match);
    const readedMatches = JSONMatches.read('./');
    JSONMatches.write({
        ...readedMatches,
        [match.id]: match
    });

    const options = Object.keys(match).map((key) => `${key}=${match[key]}`).join(' ');

    if (!isDownloading(savedName)) {
        runCmdHandler(
            '/parsers/src/',
            `start cmd.exe /K node startDownload.js ${options}`
        );
    }
};

module.exports = download;
