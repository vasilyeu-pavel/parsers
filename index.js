const path = require('path');
const ipc = require('node-ipc');
// eslint-disable-next-line import/no-unresolved
const { Worker, isMainThread } = require('worker_threads');
const { printHeader, queue, Logger } = require('./src/utils');
const { getQuestions, selectMode, questionsForDownloadSimpleMatch } = require('./src/questions');
const { customsData } = require('./src/customsData');
const { MAIN_PROCESS, PROCESS_CHANEL, RETRY } = require('./src/constants');
const { sendCustomTelegrammMessage } = require('./src/telegramBot');

ipc.config.id = MAIN_PROCESS;
ipc.config.retry = RETRY;
ipc.config.silent = true;

ipc.serve(() => ipc.server.on(PROCESS_CHANEL, (jobName) => {
    queue.onComplete(jobName);
}));

ipc.server.start();

const filename = path.join(__dirname, 'src', 'startScraping.js');

let error = null;

// eslint-disable-next-line consistent-return
const parsers = async () => {
    printHeader();
    if (error) console.log(error);

    try {
        const { choice } = await selectMode();

        switch (choice) {
            case 'Использовать парсеры': {
                const { day, parsersList } = await getQuestions();
                const logger = new Logger();
                const globalMatches = [];

                if (isMainThread) {
                    await Promise.all(parsersList.map((parserName) => new Promise((resolve, reject) => {
                        const worker = new Worker(
                            filename,
                            { workerData: { day, parserName } }
                        );
                        worker.on('error', (err) => reject(err));
                        worker.on('message', ({ matches }) => {
                            if (!matches) return;
                            globalMatches.push(...matches);
                            resolve();
                        });
                    })));
                }
                error = null;

                queue.push(globalMatches);
                logger.success();
                return parsers();
            }
            case 'Скачать матч ydl': {
                console.log('Скачать матч ydl');
                const { url, name, options } = await questionsForDownloadSimpleMatch();
                queue.push({
                    url,
                    name,
                    options,
                    scrapedDate: new Date(),
                    parserName: 'RANDOM'
                });
                return parsers();
            }
            case 'Скачать матчи из файла': {
                console.log('Скачать матчи из файла');

                queue.push(customsData().map(({ id, url }) => ({
                    url,
                    name: `${id}`,
                    scrapedDate: new Date(),
                    parserName: 'RANDOM'
                })));

                return parsers();
            }
            case 'Кол-во матчей в очереди': {
                await sendCustomTelegrammMessage(`Матчей в очереди - ${queue.getQueueLength()}`);
                return parsers();
            }
            case 'Показать всю очередь': {
                await sendCustomTelegrammMessage(`Матчи в очереди: ${"\n" + queue.getFullQueue().join("\n")}`);
                return parsers();
            }
            case 'Выход!': {
                console.log('Выход!');
                process.kill(process.pid);
                break;
            }
        }
    }
    catch (e) {
        error = e;
        console.log(error);
        // eslint-disable-next-line no-shadow
        parsers().catch((e) => console.log(e));
    }
};

parsers().catch((e) => console.log(e));
