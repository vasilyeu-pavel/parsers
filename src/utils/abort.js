const util = require('util');

function abort(...args) {
    const logs = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg));
    console.log(...logs);
    process.exit(1);
}

module.exports = abort;
