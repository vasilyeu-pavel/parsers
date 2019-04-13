const fetch = require('node-fetch');
const FormData = require('form-data');
const formatDate = require('../../utils/formatDate');

const cookiesParser = coockies => {
    const arrFiltered = coockies.filter((el) => el.name === '_ga' || el.name === '__zlcmid' || el.name === 'Mediabank_' || el.name === 'server-id' );

    let str = '';
    for (let i = 0; i < arrFiltered.length; i++) {
        const elCockies = `${arrFiltered[i].name}=${arrFiltered[i].value}; `;
        str += elCockies
    }

    return str;
};

const getFormData = form => {
    form.append('offset', '0');
    form.append('limit', '300');
    form.append('page', '1');
    form.append('sortorder', '');
    form.append('orderBy', '');
    form.append('search', '');
    form.append('smartsearchmatchtype', 'all');
    form.append('smartsearchperiod', '');
    form.append('smartsearchperiodtype', 'hours');
    form.append('smartsearchassetcreatedfiltertype', 'before');
    form.append('application', 'library');
    form.append('smartsearchperiodenabled', 'false');
    form.append('smartsearchassetcreatedfilterenabled', 'false');

    return form;
};

const getMatchList = async (cookies, name, day) => {
    const form = new FormData();
    try {

        const res = await fetch('https://www.mediabank.me/ajax/advanced_search.php', {
            method: 'POST',
            headers: {
                Cookie: cookies,
            },
            body: getFormData(form),
        });

        const { data: { assets } } = await res.json();
        const filteredMatches = assets
            .filter(({ assetmeta }) => assetmeta.SubTitle !== null)
            .filter(({ assettitle, assetmeta }) =>
                // filter for Tippeligaen && OBOS
                (assettitle.includes('Half') || assettitle.includes('Full match'))
                && assetmeta.Season === '2019'
                && assetmeta.EventDate === formatDate(day)
                && assetmeta.FileStatus.toLowerCase() === 'ready'
            ).map(({ assetmeta }) => ({
                id: assetmeta.Id,
                name: assetmeta.Title.replace(/ /g,'').replace(/\//g,''),
                date: assetmeta.EventDate,
                league: assetmeta.League.replace(/ /g,''),
            }));

        return await Promise.all(filteredMatches.map(async match => {
                const { id  } = match;

                const res = await fetch(`https://www.mediabank.me/download/?method=proxy_play&assetid=${id}&lang=`, {
                    method: 'GET',
                    headers: { Cookie: cookies },
                });

                return {
                    ...match,
                    url: res.url,
                };
        }));
    } catch (e) {
        throw new Error(`Ошибка в запросе к медиабанку ${e.message}`);
    }
};

module.exports = {
    cookiesParser, getMatchList
};
