const chunkArray = (arr, chunk) => {
  let i, j, result = [];
  for (i = 0, j = arr.length; i < j; i += chunk) {
    result.push(arr.slice(i, i + chunk));
  }
  return result;
};

module.exports = chunkArray;