const { download } = require("./downloadController");
const chunkArray = require("./chunkArray");

class Queue {
    constructor() {
        this.queues = {};
        this._max = 4;
    }

    push = (jobs) => {
        if (Array.isArray(jobs)) {
            jobs.forEach(job => {
                if (!job.name) throw new Error("name is not defined in job");
                this.queues[job.name] = { ...job, status: "PENDING" };
            });
        } else {
            if (!jobs.name) throw new Error("name is not defined in job");
            this.queues[jobs.name] = { ...jobs, status: "PENDING" }
        }

        this.start()
    };

    runJob = (pendingJobName) => {
        const job = this.queues[pendingJobName];

        if (job) {
            this.queues[pendingJobName].status = "PROGRESS";

            download(this.queues[pendingJobName]);
        }
    };

    start = () => {
        let threadsCount = 4;

        const jobsName = Object.keys(this.queues);

        const progress = jobsName.filter((name) => this.queues[name].status === "PROGRESS");

        if (progress.length >= this._max) return;

        if (progress.length < this._max) {
            threadsCount =  this._max - progress.length
        }

        const pendingJobsNames = jobsName.filter((name) => this.queues[name].status === "PENDING");
        if (!pendingJobsNames || !pendingJobsNames.length) return;

        const [chunk] = chunkArray(pendingJobsNames, threadsCount);

        if (!chunk || !Array.isArray(chunk)) return;
        chunk.forEach(this.runJob);
    };

    onComplete = async (name) => {
        this.queues[name].status = "DONE";
        this.start();
    }
}

module.exports = { queue: new Queue };
