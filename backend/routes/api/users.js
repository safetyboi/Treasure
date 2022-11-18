const bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const { loginUser, restoreUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const imageUpload = require('../../services/ImageUpload')
const { requireUser } = require('../../config/passport');


router.get('/', function(req, res, next) {
  res.json({
    message: "GET /api/users"
  });
});

router.post('/register',validateRegisterInput, async (req, res, next) => {

  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  });

  if (user) {
    // Throw a 400 error if the email address and/or username already exists
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    if (user.username === req.body.username) {
      errors.username = "A user has already registered with this username";
    }
    err.errors = errors;
    return next(err);
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    image: ''
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json(await loginUser(user));
        // return res.json({ user });
      }
      catch(err) {
        next(err);
      }
    })
  });

});

router.post('/login',validateLoginInput, async (req, res, next) => {
  passport.authenticate('local', async function(err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json(await loginUser(user));
  })(req, res, next);
});

router.get('/current', restoreUser, (req, res) => {
  if (!isProduction) {
    // In development, allow React server to gain access to the CSRF token
    // whenever the current user information is first loaded into the
    // React application
    const csrfToken = req.csrfToken();
    res.cookie("CSRF-TOKEN", csrfToken);
  }
  if (!req.user) return res.json(null);
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    image: req.user.image
  });
});

//-----------ROUTER PATCH----------------//

router.patch('/:userId', async (req, res, next) => {
  const userId = req.params.userId

  let photoUrl
  //upload to AWS
  await imageUpload.single("images")(req, res, async function (err) {
    photoUrl =  await req.file.location
    if (err) {
      // return res.json({})
    }
  })

  setTimeout(function(){
    User.findByIdAndUpdate((userId),
    {image: photoUrl}
    )
    .exec()
    .then((event) => {
        if(!event) {
            res.status(400).send(`Id ${req.params.id} was not found`);
        } else {
            res.status(200).send(`Id ${req.params.id} was updated`)
        }
    }) }, 1000);
  
});



module.exports = router;
