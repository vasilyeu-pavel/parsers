const os = require('os');

const cpuCount = os.cpus().length - 2;

const MAIN_PROCESS = 'main-process';

const PROCESS_CHANEL = 'process-chanel';

const MAX_PARALLEL_RUN_PROCESS = cpuCount;

const RETRY = 1500;

module.exports = {
    MAIN_PROCESS,
    PROCESS_CHANEL,
    MAX_PARALLEL_RUN_PROCESS,
    RETRY,
};
