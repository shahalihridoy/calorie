const catchAsync = (fun) => {
  return (req, res, next) => fun(req, res, next).catch(next);
};

module.exports = catchAsync;
