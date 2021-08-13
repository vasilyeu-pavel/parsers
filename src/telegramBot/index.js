const TelegramBot = require('node-telegram-bot-api');

const config = {
    token: '',
    chatId: 405898308
};

const bot = new TelegramBot(config.token, { polling: true });

const createMessage = ({ matches }) => {
    if (!matches) return 'matches - 0';

    return `[#Скачались матчи]:
        ${matches.map(({ name = '', date = '' }, i) => `\n${i + 1}) *${date}_${name.replace(/ /g, '')}*`)}
    `;
};

const sendTelegramMessage = async (message) => {
    const messages = createMessage(message).replace(/,/g, '');

    return await bot.sendMessage(config.chatId, messages, { parse_mode: "markdown" });
};

const sendCustomTelegrammMessage = async (message) => {
    return await bot.sendMessage(
        config.chatId,
        message.replace(/,/g, ''),
        { parse_mode: "markdown" }
        );
};

module.exports = { sendTelegramMessage, sendCustomTelegrammMessage };
