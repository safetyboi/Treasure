const User = require('../models/User')
const mongoose = require('mongoose');
// const User = mongoose.model('User')
const bcrypt = require('bcryptjs');

const newUser1 = new User({
    username: `andrew.beamer`,
    email: `andrew.beamer@gmail.com`,
    password: 'password',
    image: 'https://treasure-photos.s3.us-west-1.amazonaws.com/andrew_beamer.webp',
});
bcrypt.genSalt(10, (salt) => {
    console.log('here')
    bcrypt.hash('password', salt, async (hashedPassword) => {
        newUser1.hashedPassword = hashedPassword;
        console.log('here2')
        newUser1.save();
        console.log('here3')
    })
  });

// const newUser2 = new User({
//     username: `jessica.reeves`,
//     email: `jessica.reeves@gmail.com`,
//     password: 'password',
//     image: 'https://treasure-photos.s3.us-west-1.amazonaws.com/jessica_reeves.jpeg',
// });
// bcrypt.genSalt(10, (salt) => {
//     bcrypt.hash('password', salt, async (hashedPassword) => {
//         newUser2.hashedPassword = hashedPassword;
//         newUser2.save();
//     })
//   });

// const newUser3 = new User({
//     username: `marco.johnson`,
//     email: `marco.johnson@gmail.com`,
//     password: 'password',
//     image: 'https://treasure-photos.s3.us-west-1.amazonaws.com/marco_johnson.jpeg',
// });
// bcrypt.genSalt(10, (salt) => {
//     bcrypt.hash('password', salt, async (hashedPassword) => {
//         newUser3.hashedPassword = hashedPassword;
//         newUser3.save();
//     })
//   });

// const newUser4 = new User({
//     username: `mark.jackson`,
//     email: `mark.jackson@gmail.com`,
//     password: 'password',
//     image: 'https://treasure-photos.s3.us-west-1.amazonaws.com/mark_jackson.jpeg',
// });
// bcrypt.genSalt(10, (salt) => {
//     bcrypt.hash('password', salt, async (hashedPassword) => {
//         newUser4.hashedPassword = hashedPassword;
//         newUser4.save();
//     })
//   });

// const newUser5 = new User({
//     username: `sarah.norton`,
//     email: `sarah.norton@gmail.com`,
//     password: 'password',
//     image: 'https://treasure-photos.s3.us-west-1.amazonaws.com/sarah_norton.jpeg',
// });
// bcrypt.genSalt(10, (salt) => {
//     bcrypt.hash('password', salt, async (hashedPassword) => {
//         newUser5.hashedPassword = hashedPassword;
//         newUser5.save();
//     })
//   });


// const newUser6 = new User({
//     username: `tanya.penelli`,
//     email: `tanya.penelli@gmail.com`,
//     password: 'password',
//     image: 'https://treasure-photos.s3.us-west-1.amazonaws.com/tanya_penelli.jpeg',
// });
// bcrypt.genSalt(10, (salt) => {
//     bcrypt.hash('password', salt, async (hashedPassword) => {
//         newUser6.hashedPassword = hashedPassword;
//         newUser6.save();
//     })
//   });