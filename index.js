const path = require('path');
const ipc = require('node-ipc');
const { Worker, isMainThread } = require('worker_threads');
const { printHeader } = require('./src/utils/printHeader');
const { queue } = require('./src/utils/queue');
const chunkArray = require('./src/utils/chunkArray');
const { getQuestions, selectMode, questionsForDownloadSimpleMatch } = require('./src/questions');
const { customsData } = require('./src/customsData');
const { MAIN_PROCESS, PROCESS_CHANEL } = require('./src/constants');

ipc.config.id = MAIN_PROCESS;
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => ipc.server.on(PROCESS_CHANEL, jobName => {
    console.log(jobName);
    queue.onComplete(jobName)
}));

ipc.server.start();

const filename = path.join(__dirname, 'src', 'startScraping.js');

let error = null;

const parsers = async () => {
    printHeader();
    if (error) console.log(error);

    try {
        const { choice } = await selectMode();

        switch (choice) {
            case 'Использовать парсеры': {
                const { day, parsersList } = await getQuestions();
                const globalMatches = [];

                if (isMainThread) {
                    await Promise.all(parsersList.map((parserName) => {
                        return new Promise((resolve, reject) => {
                            const worker = new Worker(
                                filename,
                                { workerData: { day, parserName } }
                            );
                            worker.on('error', (err) => reject(err));
                            worker.on('message', ({ matches }) => {
                                if (!matches) return;
                                console.log(matches);
                                globalMatches.push(...matches);
                                resolve();
                            });
                        });
                    }));
                }
                error = null;

                queue.push(globalMatches);
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
                    parserName: 'RANDOM',
                });
                return parsers();
            }
            case 'Скачать матчи из файла': {
                console.log('Скачать матчи из файла');
                const chunkMatches = chunkArray(customsData(), 5);

                for (const chunkUrls of chunkMatches) {
                    await Promise.all(chunkUrls.map(({ id, url }) => {
                        queue.push({
                            url,
                            name: `${id}`,
                            scrapedDate: new Date(),
                            parserName: 'RANDOM',
                        });
                        return Promise.resolve();
                    }),
                    );
                }
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
        parsers().catch(e => console.log(e));
    }
};

parsers().catch(e => console.log(e));
