const config = require('../../config');

const auth = async (page, parserName) => {
    const { login, password, loginSelector, passwordSelector, submitButton } = config[parserName];

    await page.waitForSelector(loginSelector);
    const loginInput = await page.$(loginSelector);
    await loginInput.type(login);

    await page.waitForSelector(passwordSelector);
    const passwordInput = await page.$(passwordSelector);
    await passwordInput.type(password);

    await page.waitForSelector(submitButton);
    const btn = await page.$(submitButton);
    btn.click();
};

const getCoockies = async page => await page.cookies();

module.exports = { auth, getCoockies };
