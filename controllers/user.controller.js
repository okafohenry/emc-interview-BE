const { isValidObjectId } = require('mongoose');
const { asyncHandler, ErrorResponse } = require('../core');
const { ModelUser, ModelMessages } = require('../models');
/**
 * @description Getting User Detail
 * @route `/v1/user/profile`
 * @access Private
 * @type GET
 */
exports.index = asyncHandler(async (req, res, next) => {
  const data = await ModelUser.findOne({
    _id: req.user._id
  });

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Getting User Overview
 * @route `/v1/user/OverView`
 * @access Private
 * @type GET
 */
exports.overview = asyncHandler(async (req, res, next) => {
  const total = await ModelMessages.count({
    _user: req.user._id
  });
  const unread = await ModelMessages.count({
    _user: req.user._id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    status: 'success',
    data: {
      total,
      unread
    }
  });
});

/**
 * @description Getting User Notification
 * @route `/v1/user/notification`
 * @access Private
 * @type GET
 */
exports.notifications = asyncHandler(async (req, res, next) => {
  const { page, size, isread } = req.query;
  const pageNumber = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(size, 10) || 10;

  const skip = (pageNumber - 1) * itemsPerPage;
  const query = { _user: req.user._id };

  if (isread) {
    query.isRead = true;
  }

  const total = await ModelMessages.count(query);
  const data = await ModelMessages.find(query).skip(skip).limit(itemsPerPage);

  res.status(200).json({
    success: true,
    status: 'success',
    data,
    query: {
      isread
    },
    total,
    page: pageNumber,
    size: itemsPerPage
  });
});

/**
 * @description Getting User a single Notification
 * @route `/v1/user/notification`
 * @access Private
 * @type GET
 */
exports.notification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const query = { _id: id, _user: req.user._id };

  if (!isValidObjectId(id)) {
    return next(new ErrorResponse('Invalid Request ID', 400));
  }

  const data = await ModelMessages.findOne(query);

  if (!data) {
    return next(new ErrorResponse(`No Notification Found`, 404));
  }

  data.isRead = true;
  await data.save();

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});


/**
 * @description Getting User a single user
 * @route `/v1/user/:id`
 * @access Private
 * @type GET
 */
exports.user = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const query = { _id: id };

  if (!isValidObjectId(id)) {
    return next(new ErrorResponse('Invalid Request ID', 400));
  }

  const data = await ModelUser.findOne(query);

  if (!data) {
    return next(new ErrorResponse(`No User Found`, 404));
  }

  await data.save();

  res.status(200).json({
    success: true,
    status: 'success',
    data
  });
});

/**
 * @description Create A new Message Using Username
 * @route `/v1/user/notification`
 * @access Private
 * @type Post
 */
exports.createNew = asyncHandler(async (req, res, next) => {
  const { username, subject, context } = req.body;
  if (!subject && !context && !username) {
    return next(
      new ErrorResponse(`username, subject and context is required`, 400)
    );
  }
  username.toLowerCase();
  const data = await ModelUser.findOne({ username });

  if (!data) {
    return next(new ErrorResponse(`No User Found`, 404));
  }
  await ModelMessages.create({
    _user: data._id,
    subject,
    context
  });

  res.status(201).json({
    success: true,
    status: 'success',
    message: 'Notifcation Created'
  });
});

/**
 * @description Getting User All User
 * @route `/v1/user/`
 * @access Private
 * @type GET
 */
exports.Users = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const pageNumber = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(size, 10) || 10;

  const skip = (pageNumber - 1) * itemsPerPage;

  const total = await ModelUser.count({});
  const data = await ModelUser.find({}).skip(skip).limit(itemsPerPage);

  res.status(200).json({
    success: true,
    status: 'success',
    data,
    total,
    page: pageNumber,
    size: itemsPerPage
  });
});
