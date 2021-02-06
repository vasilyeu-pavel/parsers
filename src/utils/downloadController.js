const formatDate = require('./formatDate');
const { runCmdHandler } = require('./runCmdHandler');
const { isDownloading } = require('./readFile');
const { getSavedName } = require('./index');

const download = async (match) => {
    const savedName = getSavedName(match);

    const options = Object.keys(match).map((key) => `${key}=${match[key]}`).join(' ');

    if (!isDownloading(savedName)) {
        runCmdHandler(
            '/parsers/src/',
            `start cmd.exe /K node startDownload.js ${options}`
        );
    }
};

module.exports = download;
