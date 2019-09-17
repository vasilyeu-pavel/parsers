const { spawn } = require('child_process');

const spawnProcess = (dir, cmd) => ((process.platform.toLowerCase().indexOf('win') >= 0)
    ? spawnWindowsProcess(dir, cmd)
    : spawnLinuxProcess(dir, cmd));

const spawnWindowsProcess = (dir, cmd) => spawn('cmd.exe', ['/c', cmd], { cwd: dir });

const spawnLinuxProcess = (dir, cmd) => {
    const cmdParts = cmd.split(/\s+/);
    return spawn(cmdParts[0], cmdParts.slice(1), { cwd: dir });
};

const runCmdHandler = (dir, cmd) => {
    let process = null;
    try {
        process = spawnProcess(dir, cmd);
        return new Promise((resolve) => {
            console.log('start --->', cmd);
            process.stdout.on('data', (data) => {
                console.log('progress', data.toString('utf-8'));
            });
            process.stderr.on('data', (data) => {
                console.log('error', data.toString('utf-8'));
            });
            process.on('exit', (code, signal) => {
                console.log('finish ---> resolve', code, signal);
                resolve('true');
            });
        });
    }
    catch (e) {
        console.error(`Error trying to execute command '${cmd}' in directory '${dir}'`);
        console.error(e);
        console.log('error', e.message);
        console.log('finished');
    }
};

module.exports = {
    runCmdHandler
};
