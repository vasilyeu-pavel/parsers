const download = require('./downloadController');
const chunkArray = require('./chunkArray');
const { MAX_PARALLEL_RUN_PROCESS } = require('../constants');

class Queue {
    constructor() {
        this.queues = {};
    }

    push = (jobs) => {
        if (Array.isArray(jobs)) {
            jobs.forEach(job => {
                if (!job.name) throw new Error('name is not defined in job');
                this.queues[job.name] = { ...job, status: 'PENDING' };
            });
        } else {
            if (!jobs.name) throw new Error('name is not defined in job');
            this.queues[jobs.name] = { ...jobs, status: 'PENDING' }
        }

        this.start()
    };

    getQueueLength = () => {
        return Object.keys(this.queues).length
    };

    getFullQueue = () => {
        return Object.keys(this.queues)
    };

    runJob = (pendingJobName) => {
        const job = this.queues[pendingJobName];

        if (job) {
            this.queues[pendingJobName].status = 'PROGRESS';

            download(this.queues[pendingJobName]);
        }
    };

    start = () => {
        let threadsCount = MAX_PARALLEL_RUN_PROCESS;

        const jobsName = Object.keys(this.queues);

        const progress = jobsName.filter((name) => this.queues[name].status === 'PROGRESS');

        if (progress.length >= MAX_PARALLEL_RUN_PROCESS) return;

        if (progress.length < MAX_PARALLEL_RUN_PROCESS) {
            threadsCount =  MAX_PARALLEL_RUN_PROCESS - progress.length
        }

        const pendingJobsNames = jobsName.filter((name) => this.queues[name].status === 'PENDING');
        if (!pendingJobsNames || !pendingJobsNames.length) return;

        const [chunk] = chunkArray(pendingJobsNames, threadsCount);

        if (!chunk || !Array.isArray(chunk)) return;
        chunk.forEach(this.runJob);
    };

    onComplete = async (name) => {
        const job = this.queues[name];
        if (!job) return;
        this.queues[name].status = 'DONE';
        this.start();
    }
}

module.exports = { queue: new Queue };
