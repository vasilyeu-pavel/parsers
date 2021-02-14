const { spawn } = require('child_process');
const os = require('os');

const spawnWindowsProcess = (dir, cmd) => spawn(
    'cmd.exe',
    ['/c', ...cmd.split(' ')],
    { cwd: dir, windowsVerbatimArguments: true }
);

const spawnProcess = (dir, cmd) => {
    if (os.platform() !== 'win32') {
        console.log('dir', dir);
        console.log('cmd', cmd);
        throw new Error('Is supported only windows os!');
    }
    return spawnWindowsProcess(dir, cmd);
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
                    reject(new Error(data.toString('utf-8')));
                }
            });
            process.on('exit', (code, signal) => {
                isRetry = false;
                resolve('true');
            });
        });
    }
    catch (e) {
        if (e.message.includes('Did not get any data blocks')) {
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
    }
    else {
        return true;
    }
};

module.exports = { runCmdHandler };
