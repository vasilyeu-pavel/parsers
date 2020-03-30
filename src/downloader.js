const { spawn } = require('child_process');
const { isDownloading } = require('./utils/fileAPI');

const { sendTelegramMessage } = require('./telegramBot');

const spawnProcess = (dir, cmd) => ((process.platform.toLowerCase().indexOf('win') >= 0)
    ? spawnWindowsProcess(dir, cmd)
    : spawnLinuxProcess(dir, cmd));

const spawnWindowsProcess = (dir, cmd) => spawn('cmd.exe', ['/c', cmd], { cwd: dir });

const spawnLinuxProcess = (dir, cmd) => {
    const cmdParts = cmd.split(/\s+/);
    return spawn(cmdParts[0], cmdParts.slice(1), { cwd: dir });
};

const runCmdHandler = async (dir, cmd) => {
    let process = null;
    let isRetry = false;

    try {
        process = spawnProcess(dir, cmd);
        await new Promise((resolve, reject) => {
            console.log('start --->', cmd);
            process.stdout.on('data', (data) => {
                console.log('progress', data.toString('utf-8'));
            });
            process.stderr.on('data', (data) => {
                console.log('error', data.toString('utf-8'));
                if (data.toString('utf-8').includes('Did not get any data blocks')) {
                    reject(data.toString('utf-8'));
                }
            });
            process.on('exit', (code, signal) => {
                console.log('finish ---> resolve', code, signal);
                isRetry = false;
                resolve('true');
            });
        });
    }
    catch (e) {
        if (e.includes('Did not get any data blocks')) {
            isRetry = true;
        }
        console.error(`Error trying to execute command '${cmd}' in directory '${dir}'`);
        console.error(e);
        console.log('error', e.message);
        console.log('finished');
    }

    if (isRetry) {
        isRetry = false;
        console.log('Retry ---> download');
        runCmdHandler(dir, cmd);
    } else {
        return true;
    }
};

const download = async ({ url: input, output }) => {
    return !isDownloading(output) && runCmdHandler(
        './src/youtube-dl',
        `youtube-dl --hls-prefer-native ${input} --output ${output}`
    );
};

const downloadController = async (urls, parserName = 'emptyParser') => {
    for (const chunkUrls of urls) {
        await Promise.all(chunkUrls.map(download));

        await sendTelegramMessage({
            league: parserName,
            matches: chunkUrls
        });
    }
};

module.exports = {
    runCmdHandler,
    download,
    downloadController,
};
