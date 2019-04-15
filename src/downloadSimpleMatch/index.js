const { runCmdHandler } = require('../downloader');
const { sendTelegramMessage } = require('../telegramBot');

const downloader = async ({ url, name, options }) => {
        if (options.length) {
            await runCmdHandler(
                './src/youtube-dl',
                `youtube-dl ${options} ${url} --output RANDOM/${name.replace(/ /g,'')}.mp4`);
        }else {
            await runCmdHandler(
                './src/youtube-dl',
                `youtube-dl ${url} --output RANDOM/${name.replace(/ /g,'')}.mp4`);
        }
        sendTelegramMessage({
            league: 'RANDOM',
            matches: [`${name}`],
        });
        return;
    };

module.exports = {
    downloader
};
