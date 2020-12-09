const ipc = require('node-ipc');

const { MAIN_PROCESS } = require('./constants');
const { parseArgv, delay } = require("./utils");
const { sendTelegramMessage } = require('./telegramBot');
const formatDate = require('./utils/formatDate');
const { runCmdHandler } = require('./utils/runCmdHandler');


const startDownload = () => {
    const match = parseArgv(process.argv);
    const {
        name,
        url,
        date,
        league,
        options = "--hls-prefer-native",
        index,
    } = match;
    console.log(`This process is pid ${process.pid}`);

    const matchName = name.replace(/ /g, '');

    const savedName = `${league}/${formatDate(date)}_${matchName}.mp4`;

    const ydlCmd = `youtube-dl ${options} ${url} --output ${savedName}`;

    ipc.config.id = `${process.pid}`;
    ipc.config.retry = 1500;
    ipc.config.silent = true;
    ipc.connectTo(MAIN_PROCESS, () => {
        ipc.of['jest-observer'].on('connect', async () => {

            await runCmdHandler('/parsers/src/youtube-dl', ydlCmd);

            await sendTelegramMessage({ matches: [match] });

            await delay(5000);
            console.log('Exiting.');

            ipc.of['jest-observer'].emit(index || 1, matchName);

            process.kill(process.pid);
        });
    });
};

startDownload();
