const { spawn, exec } = require('child_process');
const os = require('os');

const printInNewTab = (cmd) => {
    return (os.platform() === 'win32'
        ? printInNewTabWindows(cmd)
        : printInNewTabLinux(cmd));
};

const printInNewTabWindows = (message) => {
    return new Promise((res, rej) => {
        exec(`start cmd.exe /K ${message}`, (error) => {
            if (error) return rej();
            res();
        })
    });
};

const printInNewTabLinux = (message = "hello word") => {
    const options = [
        '-e',
        `tell application "Terminal" to do script "${message}" in selected tab of the front window`
    ];
    if (os.platform() === 'darwin') {
        return new Promise((res) => {
            spawn('osascript', options)
                .on('exit', () => res());
        })
    }
};

const spawnProcess = (dir, cmd) => {
    return (os.platform() === 'win32'
        ? spawnWindowsProcess(dir, cmd)
        : spawnLinuxProcess(dir, cmd));
};

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

module.exports = {
    runCmdHandler,
    printInNewTab,
};
