module.exports = (error = []) => {
  return error.reduce((acc, cur) => {
    acc = {
      ...acc,
      [cur.param]: {
        message: cur.msg,
        value: cur.value,
      },
    };
    return acc;
  }, {});
};
