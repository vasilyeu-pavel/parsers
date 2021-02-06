const ipc = require('node-ipc');
const { MAIN_PROCESS, PROCESS_CHANEL } = require('./constants');
const { sendTelegramMessage } = require('./telegramBot');
const { runCmdHandler, parseArgv, getSavedName } = require('./utils');
const { JSONMatches } = require('./utils/readFile');

ipc.config.id = `${process.pid}`;
ipc.config.retry = 1500;
ipc.config.silent = true;

const startDownload = async () => {
    const { id } = parseArgv(process.argv);
    console.log(`This process is pid ${process.pid}`);

    const matches = JSONMatches.read('../');
    const match = matches[id];
    const {
        options,
        name,
        url
    } = match;

    const matchName = name.replace(/ /g, '');

    const savedName = getSavedName(match);

    const ydlCmd = `youtube-dl ${options.split('_').join(' ')} ${url} --output ${savedName}`;

    await runCmdHandler('/parsers/src/youtube-dl', ydlCmd);

    await sendTelegramMessage({ matches: [match] });

    return { matchName };
};

ipc.connectTo(MAIN_PROCESS, () => {
    ipc.of[MAIN_PROCESS].on('connect', async () => {
        const { matchName } = await startDownload();
        console.log(matchName);

        ipc.of[MAIN_PROCESS].emit(PROCESS_CHANEL, matchName);

        console.log('Exiting.');
        process.kill(process.pid);
    });
});
