const inquirer = require('inquirer');
const { getDirs } = require('../utils/getDirs');

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const getCheckBoxQuestions = dirs => dirs.map((dir, i) => {
        if (i === 0) {
            return {
                name: dir,
                checked: true,
            }
        }
        return {
            name: dir,
        }
    });

const getQuestions = async () => {
    const dirs = await getDirs('./src/extractors');

    const questions = [
        {
            type: 'datetime',
            name: 'day',
            message: 'Какой день будем парсить?',
            format: ['yyyy', '-', 'mm', '-', 'dd'],
            initial: Date.parse(new Date()),
            date: {
                min: "1/1/2017",
                max: "3/1/2017"
            },
        },
        {
            type: 'checkbox',
            message: 'Что будем парсить?',
            name: 'parsersList',
            choices: [
                new inquirer.Separator(' = Футбольные парсеры: = '),
                ...getCheckBoxQuestions(dirs),
            ],
            validate: function(answer) {
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
    getQuestions
};
