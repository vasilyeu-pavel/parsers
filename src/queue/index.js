const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');

const {
    readFileAsync,
    writeFileAsync
} = require('../utils/fileAPI');

const defaultCb = (m = 'defaultCb') => console.log(m);

const folder = path.join(path.resolve(), 'src', 'queue');

const queue = path.join(folder, 'queue.json');
const processing = path.join(folder, 'processing.json');
const processed = path.join(folder, 'processed.json');

class Queue {
    constructor() {
      this.state = [];

      // create file if is not exists
      !fs.existsSync(queue) && fs.writeFileSync(queue, JSON.stringify([]));
      !fs.existsSync(processing) && fs.writeFileSync(processing, JSON.stringify([]));
      !fs.existsSync(processed) && fs.writeFileSync(processed, JSON.stringify([]));
    };

    watch(cb = defaultCb) {
        const watcher = chokidar.watch(folder, {
            ignoreInitial: true
        });

        watcher.on('all', debounce(() => cb(), 3000));
    };

    async writeJSON(matches = [], fileName) {
        const filePath = path.join(folder, fileName);

        await writeFileAsync(JSON.stringify(matches), filePath);
    }

    async readJSON(fileName) {
        const filePath = path.join(folder, fileName);
        const data = await readFileAsync(filePath);

        console.log(JSON.parse(data));
    }


    add(el) {
        if (!Array.isArray(el)) {
            typeof el === 'object' && this.state.push(el);
        } else {
            this.state = this.state.concat(el);
        }

        return this.state;
    }

    getAll() {
        return this.state;
    }

    getByIndex(i) {
      return this.state[i] || null;
    };

    getById(foundId) {
        return this.state.find(({ id }) => id === foundId) || null;
    }

    removeFirstGroup(length) {
        // remove first elements
        for (let i = 0; i < length; i++) {
            this.state.shift();
        }
    }

    getFirstGroup(length = 0) {
        if (!length) return;

        // get groups from start
        const group = this.state.slice(0, length);
        this.removeFirstGroup(length);

        return group;
    }
}

module.exports = {
    Queue
};
