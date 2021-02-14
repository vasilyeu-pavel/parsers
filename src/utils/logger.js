const readline = require('readline');
const abort = require('./abort')
const params = require('./params')

const symbols = ['|', '/', '-', '\\']

class Logger {
    constructor (message) {
        this.message = message
        this.symbolIndex = 0
        if (!params.silent) {
            this.interval = setInterval(this._update, 150)
        }
        this._log()
    }

    _update = () => {
        readline.clearLine(process.stdout)
        this.symbolIndex += 1
        if (this.symbolIndex >= symbols.length) this.symbolIndex = 0
        this._log()
    }

    success = () => {
        this.interval && clearInterval(this.interval)
        !params.silent && readline.clearLine(process.stdout)
        params.silent && process.stdout.write('\n')
        this._log(true)
        process.stdout.write('\n')
    }

    error = (message) => {
        this.interval && clearInterval(this.interval)
        !params.silent && readline.clearLine(process.stdout)
        process.stdout.write('\n')
        abort(`❌   ${this.message} FAILED\n`, message)
    }

    _log = succeeded => {
        !params.silent && readline.cursorTo(process.stdout, 0)
        const symbol = params.silent ? '*x§' : symbols[this.symbolIndex]
        const successSymbol = params.silent ? '[DONE]' : '✔'
        process.stdout.write(`${succeeded ? successSymbol : symbol}   ${this.message || 'Loading...'}`)
    }
}

module.exports = Logger
