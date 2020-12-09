const ipc = require('node-ipc');

const chunkArray = require('./chunkArray');
const formatDate = require('./formatDate');
const { runCmdHandler } = require('./runCmdHandler');
const { MAIN_PROCESS } = require('../constants');
const { isDownloading } = require('./readFile');

ipc.config.id = MAIN_PROCESS;
ipc.config.retry = 1500;
ipc.config.silent = true;

[1,2,3,4].forEach((i) => {
    ipc.serve(() => ipc.server.on(i, message => {
        console.log(message);
    }));
});

ipc.server.start();

const downloaderController = async (matchList) => {
    if (!matchList || !matchList.length) return;

    const chunkMatches = chunkArray(matchList, 4);

    for (let i = 0; i < chunkMatches.length; i++) {
        await Promise.all(chunkMatches[i]
            .map((match) => download({ ...match, index: i }))
        );
    }
};

const download = async (match) => {
    const {
        name,
        league,
        date,
        index,
    } = match;

    const matchName = name.replace(/ /g, '');

    const savedName = `${league}/${formatDate(date)}_${matchName}.mp4`;
    const options = Object.keys(match).map((key) => `${key}=${match[key]}`).join(" ");

    if (!isDownloading(savedName)) {
        await runCmdHandler(
            '/parsers/src/',
            `start cmd.exe /K node startDownload.js ${options}`
        );
    }
};

const downloadController = (matchesData) => Array.isArray(matchesData)
    ? downloaderController(matchesData)
    : download(matchesData);

module.exports = downloadController;
