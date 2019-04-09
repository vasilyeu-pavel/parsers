const formatDate = (dateString = new Date()) => {
    const date = new Date(dateString);

    let dd = date.getDate();
    if (dd < 10) dd = `0${dd}`;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = `0${mm}`;

    let yy = date.getFullYear();
    if (yy < 10) yy = `0${yy}`;

    return `${yy}-${mm}-${dd}`;
};

module.exports = formatDate;
