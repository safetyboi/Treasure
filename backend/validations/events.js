const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// validateTweetInput is a combination Express middleware that uses the `check`
// middleware to validate the keys in the body of a request to create/edit
// a tweet
const validateEventInput = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5, max: 140 })
    .withMessage('Event name must be between 5 and 100 characters'),
    check('description')
    .exists({ checkFalsy: true })
    .isLength({ min: 0, max: 500 })
    .withMessage('Event description must be less than 500 characters'),
    check('duration')
    .exists({ checkFalsy: true })
    .withMessage('Event description must be less than 500 characters'),
  handleValidationErrors
];

module.exports = validateEventInput;