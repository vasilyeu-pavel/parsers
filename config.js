const creds = require('./creds');

module.exports = {
    fanseat: {
        url: 'https://www.fanseat.com/login',
        loginSelector: '#email',
        passwordSelector: '#password',
        submitButton: '.ui.form button',
        ...creds.fanseat,
    },
    ruutu: {
        url: 'https://www.ruutu.fi/video/3473823',
        signInSelector: '#root > div > nav > ul:nth-child(1) > li > a',
        cookiesModalSelector: '#sccm-opt-out-c1',
        loginSelector: '#username',
        passwordSelector: '#password',
        submitButton: '.login-submit-js',
        leaguesOptions: {
            mestis: {
                offset: 0,
                limit: 60,
                current_series_id: 3456456,
                app: 'ruutu',
                client: 'web'
            },
            nuorten: {
                offset: 0,
                limit: 60,
                current_series_id: 3285973,
                app: 'ruutu',
                client: 'web'
            },
            sarja: {
                offset: 0,
                limit: 60,
                current_series_id: 3285972,
                app: 'ruutu',
                client: 'web'
            }
        },
        ...creds.ruutu,
    },
    mediabank: {
        url: 'https://www.mediabank.me/login.php',
        loginSelector: '#username',
        passwordSelector: '#password',
        submitButton: '#main > form > button',
        ...creds.mediabank,
    },
    nasport: {
        sports: [
            {
                id: 'a1da5593-7bc1-4c70-92da-19e5953a1f9b',
                name: 'football',
                leagues: {
                    y1Pdmwf4lPmtSnPaz3gydz: 'Norsk Tipping-ligaen avd 1',
                    RvmHrK7OP37V4RvsqbATmk: 'Norsk Tipping-ligaen avd 2',
                    gdSF56f4V4RqrRcnWVamWO: 'Norsk Tipping-ligaen avd 3',
                    gdSF56f4V4RqrRcnWVaoUP: 'Norsk Tipping-ligaen avd 4',
                    RvmHrK7OP37V4RvsqbAPhq: 'Norsk Tipping-ligaen avd 5',
                    '5f9f79c1-f8ac-4f34-a4e1-72b3f942fb51': 'Norsk Tipping-ligaen avd 6',

                    '4ec6146b-e2f9-4277-837c-2fe0d78a06fd': 'NM kvinner',
                    'a7dc949b-b491-49bb-9b02-c3732a843573': 'NM menn',

                    '713a9375-e41a-4ff8-abe8-78392c604858': 'PostNord-ligaen avd 1',
                    HXxyrXcCJqTr9Q2ghyCaf7: 'PostNord-ligaen avd 2',

                    'f59f5758-d9f6-40a0-9c81-219b25b68732': 'friendly match'
                }
            }
        ]
    },
    telegram: {
        token: creds.telegram.token,
        chatId: creds.telegram.chatId,
    },
};
