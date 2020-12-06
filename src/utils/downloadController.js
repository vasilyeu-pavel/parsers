const chunkArray = require('./chunkArray');
const formatDate = require('./formatDate');
const { runCmdHandler, printInNewTab } = require('./runCmdHandler');
const { sendTelegramMessage } = require('../telegramBot');

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
        url,
        scrapedDate,
        parserName,
        options = "--hls-prefer-native"
    } = match;

    const savedName = `${parserName}/${formatDate(scrapedDate)}_${name.replace(/ /g, '')}.mp4`;

    const ydlCmd = `youtube-dl ${options} ${url} --output ${savedName}`;

    if (!isDownloading(savedName)) {
        // await runCmdHandler('./src/youtube-dl', ydlCmd);
        await printInNewTab(ydlCmd)
    }

    await sendTelegramMessage({
        league: "test",
        matches: [match]
    });
};

const downloadController = (matchesData) => Array.isArray(matchesData)
    ? downloaderController(matchesData)
    : download(matchesData);

module.exports = downloadController;
