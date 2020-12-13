const { download } = require("./downloadController");

class Queue {
    constructor() {
        this.queues = {};
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

    start = () => {
        const jobsName = Object.keys(this.queues);

        const progress = jobsName.filter((name) =>
            this.queues[name].status === "PROGRESS"
        );

        if (progress.length < 4) {
            const [pendingJobName] = jobsName.filter((name) =>
                this.queues[name].status === "PENDING"
            );

            this.queues[pendingJobName].status = "PROGRESS";
            download(this.queues[pendingJobName]);
        }
    };

    onComplete = async (name) => {
        this.queues[name].status = "DONE";
        this.start();
    }
}

module.exports = Queue;
