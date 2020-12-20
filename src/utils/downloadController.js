const formatDate = require('./formatDate');
const { runCmdHandler } = require('./runCmdHandler');
const { isDownloading } = require('./readFile');

const download = async (match) => {
    const { name, league, date } = match;

    const matchName = name.replace(/ /g, '');
    const savedName = `${league}/${formatDate(date)}_${matchName}.mp4`;
    const options = Object.keys(match).map((key) => `${key}=${match[key]}`).join(' ');

    if (!isDownloading(savedName)) {
        runCmdHandler(
            '/parsers/src/',
            `start cmd.exe /K node startDownload.js ${options}`
        );
    }
};

module.exports = download;
