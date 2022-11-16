const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// validateTweetInput is a combination Express middleware that uses the `check`
// middleware to validate the keys in the body of a request to create/edit
// a tweet
const validateSubscriptionInput = [
  check('currentPin')
    .exists({ checkFalsy: true }),
  check('location')
    .exists({ checkFalsy: true }),
  handleValidationErrors
];


module.exports = validateSubscriptionInput;