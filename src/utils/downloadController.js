const chunkArray = require('./chunkArray');
const formatDate = require('./formatDate');
const { runCmdHandler } = require('./runCmdHandler');
const { sendTelegramMessage } = require('../telegramBot');

const { isDownloading } = require('./readFile');

const downloaderController = async (matchList) => {
    if (!matchList || !matchList.length) return;

    const chunkMatches = chunkArray(matchList, 9);
    for (let i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i].map(download));

        await sendTelegramMessage({
            league: "test",
            matches: chunkMatches[i]
        });
    }
};

const download = async ({
    id,
    name,
    url,
    scrapedDate,
    parserName,
}) =>
    !isDownloading(`${parserName}/${formatDate(scrapedDate)}_${name.replace(/ /g, '')}.mp4`)
    && runCmdHandler(
    './src/youtube-dl',
    `youtube-dl --hls-prefer-native ${url} --output ${parserName}/${formatDate(scrapedDate)}_${name.replace(/ /g, '')}.mp4`
    );

const downloadController = (matchesData) => Array.isArray(matchesData)
    ? downloaderController(matchesData)
    : download(matchesData);

module.exports = downloadController;
