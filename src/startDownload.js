const { parseArgv, delay } = require("./utils");
const { sendTelegramMessage } = require('./telegramBot');
const formatDate = require('./utils/formatDate');
const { runCmdHandler } = require('./utils/runCmdHandler');


const startDownload = async () => {
    const match = parseArgv(process.argv);
    const {
        name,
        url,
        date,
        league,
        options = "--hls-prefer-native"
    } = match;
    console.log(`This process is pid ${process.pid}`);

    const savedName = `${league}/${formatDate(date)}_${name.replace(/ /g, '')}.mp4`;

    const ydlCmd = `youtube-dl ${options} ${url} --output ${savedName}`;

    await runCmdHandler('/parsers/src/youtube-dl', ydlCmd);

    await sendTelegramMessage({ matches: [match] });

    await delay(5000);
    console.log('Exiting.');
    process.kill(process.pid);
};

startDownload().catch(e => console.log(e));
