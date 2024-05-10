let { ModelUser } = require('../models');
const jwt = require('jsonwebtoken');
const { ErrorResponse, asyncHandler } = require('../core');

exports.bodyParser = (req, res, next) => {
  if (!Object.keys(req.body).length > 0)
    return next(new ErrorResponse('The document Body is Empty', 202));
  else next();
};

const BodyGuard = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await ModelUser.findById(decoded.user_id).select('+savedJob');
    if (req.user) {
      next();
    } else {
      return next(
        new ErrorResponse('Not authorized to access this route', 400)
      );
    }
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

module.exports = BodyGuard;
