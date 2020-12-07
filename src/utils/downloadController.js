const chunkArray = require('./chunkArray');
const formatDate = require('./formatDate');
const { runCmdHandler } = require('./runCmdHandler');

const { isDownloading } = require('./readFile');

const downloaderController = async (matchList) => {
    if (!matchList || !matchList.length) return;

    const chunkMatches = chunkArray(matchList, 9);
    for (let i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i].map(download));
    }
};

const download = async (match) => {
    const {
        name,
        league,
        date,
    } = match;

    const savedName = `${league}/${formatDate(date)}_${name.replace(/ /g, '')}.mp4`;
    const options = Object.keys(match).map((key) => `${key}=${match[key]}`).join(" ");

    if (!isDownloading(savedName)) {
        await runCmdHandler('/', `start cmd.exe /K node startDownload.js ${options}`);
    }
};

const downloadController = (matchesData) => Array.isArray(matchesData)
    ? downloaderController(matchesData)
    : download(matchesData);

module.exports = downloadController;
