module.exports = (error = []) => {
  return error.map((e) => ({
    [e.param]: {
      message: e.msg,
      value: e.value,
    },
  }));
};
