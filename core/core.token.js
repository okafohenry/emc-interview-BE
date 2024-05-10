/**
 * Get token from model, create cookie and send response
 * @param { Object} user The Mongoose Object
 * @param { Number } statusCode The Status Key `[201, 200, 203]`
 * @param { Function } res The Response Function
 */
const sendTokenResponse = async (user, statusCode, res) => {
  // Create token
  const token = Array.isArray(user)
    ? user[0].getSignedJwtToken()
    : user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.MODE === 'production') {
    options.secure = true;
  }
  const out = Array.isArray(user) ? user[0].toObject() : user.toObject();
  delete out.password;
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: out
  });
};

module.exports = sendTokenResponse;
