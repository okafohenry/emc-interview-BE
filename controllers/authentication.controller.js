const { ErrorResponse, asyncHandler, sendTokenResponse } = require('../core');
const { ModelUser } = require('../models');

/**
 * @description Registeration using Form Input For user
 * @route `/v1/authentication/register`
 * @access Public
 * @type POST
 */
exports.register = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.password) {
      return next(new ErrorResponse('Password Is Required', 403));
    }
    if (!req.body.username) {
      return next(new ErrorResponse('User Full Name Is Required', 403));
    }

    const username = req.body.username.toLowerCase()
      ? req.body.username.toLowerCase()
      : '';
    const checkAccount = await ModelUser.findOne({
      username
    });

    if (checkAccount) {
      return next(new ErrorResponse(`UserName already exist`, 409));
    }

    const incoming = {
      password: req.body.password,
      username: req.body.username
    };

    const newUser = await ModelUser.create([incoming]);

    sendTokenResponse(newUser, 201, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @description Login using Form Input
 * @route `/v1/authentication/login`
 * @access Public
 * @type POST
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate username & password
  if (!username || !password) {
    return next(
      new ErrorResponse('Please provide an username and password', 400)
    );
  }

  // Check for user
  const user = await ModelUser.findOne({ username: username.toLowerCase() })
    .select('+password')
    .select('+username');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);
});

/**
 * @description Logout
 * @route `/v1/authentication/logout`
 * @access Public
 * @type GET
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});
