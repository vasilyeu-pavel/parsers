const inquirer = require('inquirer');
const { getDirs } = require('../utils');

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const getCheckBoxQuestions = (dirs) => dirs.map((dir, i) => {
    if (i === 0) {
        return {
            name: dir,
            checked: true
        };
    }
    return {
        name: dir
    };
});

const validateName = (name) => name !== '';

const validateUrl = (name) => name !== '' && name.includes('.');

const questionsForDownloadSimpleMatch = async () => {
    const questions = [
        {
            message: 'Что будем скачивать(ссылка)?',
            type: 'input',
            name: 'url',
            validate: validateUrl
        },
        {
            message: 'Под каким названием сохранить файл?',
            type: 'input',
            name: 'name',
            validate: validateName
        },
        {
            message: 'Дополнительные опции для ydl (--hls-prefer-native) - перечисление через пробел',
            type: 'input',
            name: 'options'
        }
    ];

    return inquirer.prompt(questions);
};

const selectMode = async () => {
    const questions = [
        {
            type: 'list',
            message: 'Что вы хотите сделать :) ?',
            name: 'choice',
            choices: [
                {
                    name: 'Использовать парсеры'
                },
                {
                    name: 'Скачать матч ydl'
                },
                {
                    name: 'Скачать матчи из файла'
                },
                {
                    name: 'Кол-во матчей в очереди'
                },
                {
                    name: 'Показать всю очередь'
                },
                {
                    name: 'Выход!'
                }
            ]
        }
    ];

    return inquirer.prompt(questions);
};

const getQuestions = async () => {
    const footballDirs = await getDirs('./src/extractors/football');
    const hockeyDirs = await getDirs('./src/extractors/hockey');

    const hockeyParsers = hockeyDirs.map((dirName) => {
        if (dirName !== 'ruutu') return [{ name: dirName }];
        return [
            {
                name: `${dirName}-mestis`
            },
            {
                name: `${dirName}-nuorten`
            },
            {
                name: `${dirName}-sarja`
            }
        ];
    });

    const questions = [
        {
            type: 'datetime',
            name: 'day',
            message: 'Какой день будем парсить?',
            format: ['yyyy', '-', 'mm', '-', 'dd'],
            initial: Date.parse(new Date()),
            date: {
                min: '1/1/2017',
                max: '3/1/2017'
            }
        },
        {
            type: 'checkbox',
            message: 'Что будем парсить?',
            name: 'parsersList',
            pageSize: 10,
            choices: [
                new inquirer.Separator(' = Футбольные парсеры: = '),
                ...getCheckBoxQuestions(footballDirs),
                new inquirer.Separator(' = Хоккейные парсеры: = '),
                ...hockeyParsers.reduce((a, b) => a.concat(b))

            ],
            validate(answer) {
                if (answer.length < 1) {
                    return 'Вы ничего не выбрали - выберите парсер!';
                }

                return true;
            }
        }
    ];

    return inquirer.prompt(questions);
};

module.exports = {
    getQuestions, selectMode, questionsForDownloadSimpleMatch
};
