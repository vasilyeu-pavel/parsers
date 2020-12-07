const { parseArgv, delay } = require("./utils");
const { sendTelegramMessage } = require('./telegramBot');
const formatDate = require('./utils/formatDate');
const { runCmdHandler } = require('./utils/runCmdHandler');


const startDownload = async () => {
    const {
        name,
        url,
        date,
        league,
        options = "--hls-prefer-native"
    } = parseArgv(process.argv);
    console.log(`This process is pid ${process.pid}`);

    const savedName = `${league}/${formatDate(date)}_${name.replace(/ /g, '')}.mp4`;

    const ydlCmd = `youtube-dl ${options} ${url} --output ${savedName}`;

    await runCmdHandler('./src/youtube-dl', ydlCmd);

    await sendTelegramMessage({ matches: [process.argv] });

    await delay(5000);
    console.log('Exiting.');
    process.kill(process.pid);
};

startDownload().catch(e => console.log(e));
