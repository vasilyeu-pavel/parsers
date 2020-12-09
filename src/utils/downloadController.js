const ipc = require('node-ipc');

const chunkArray = require('./chunkArray');
const formatDate = require('./formatDate');
const { runCmdHandler } = require('./runCmdHandler');
const { MAIN_PROCESS, PROCESS } = require('../constants');
const { isDownloading } = require('./readFile');

ipc.config.id = MAIN_PROCESS;
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => ipc.server.on(PROCESS[0], message => {
    console.log(message);
}));
ipc.serve(() => ipc.server.on(PROCESS[1], message => {
    console.log(message);
}));
ipc.serve(() => ipc.server.on(PROCESS[2], message => {
    console.log(message);
}));
ipc.serve(() => ipc.server.on(PROCESS[3], message => {
    console.log(message);
}));

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
