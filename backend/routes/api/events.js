const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const { requireUser } = require('../../config/passport');
const validateEventInput = require('../../validations/events');
const imageUpload = require('../../services/ImageUpload')

router.get('/', async (req, res) => {
    if(req.query["userId"]) {
        let user;
        console.log(req.query["userId"])
        try {
            user = await User.findById(req.query["userId"]);
        } catch(err) {
            const error = new Error('User not found');
            error.statusCode = 404;
            error.errors = { message: "No user found with that id" };
            return next(error);
        }
        try {
            const events = await Event.find({ creator: user._id })
                                        .sort({ createdAt: -1 })
                                        .populate("creator", "_id, username");
            return res.json(events);
            }
        catch(err) {
            return res.json([]);
        }
    } else {
        try {
            const events = await Event.find().populate("creator", "_id, username");
            return res.json(events);
        }
        catch(err) {
            return res.json([]);
        }
    }
});

router.post('/', requireUser, validateEventInput, async (req, res, next) => {
    try {
        const newEvent = new Event({
            creator: req.user._id,
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            distance: req.body.distance,
            initCoords: req.body.initCoords,
            price: req.body.price,
            supplies: req.body.supplies,
            gameStatus: req.body.status,
            elevation: req.body.elevation,
            date: req.body.date,
            status: req.body.status,
            location: req.body.location
        })

        let event = await newEvent.save()
        // event = await Event.populate("name", "description _id")
        return res.json(event)
    }
    catch(err) {
        next(err)
    }
})

router.patch('/addImage/:eventId', validateEventInput, async (req, res, next) => {
    console.log("addimage")  
    console.log(req.params.eventId) 
    const eventId = req.params.eventId

    let photoUrl
    //upload to AWS
    imageUpload.single("images")(req, res, async function (err) {
        setTimeout(function(){
            console.log("first set timeout")
            photoUrl = req.file.location
            console.log(photoUrl, "photourl-1")
       }, 1000);
        if (err) {
        // return res.json({})
        console.log(err);
        }
    })

    setTimeout(function(){
        console.log('here')
        console.log(photoUrl, "photourl-2")
        Event.findByIdAndUpdate((eventId), {image: photoUrl})
        .exec()
        .then((event) => {
            if(!event) {
                res.status(400).send(`Id ${req.params.id} was not found`);
            } else {
                res.status(200).send(`Id ${req.params.id} was updated`)
            }
        }) 
    }, 2000);
});

router.get('/:eventId', async (req, res, next) => {
    let event;
    try {
      event = await Event.findById(req.params.eventId);
    } catch(err) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.errors = { message: "No event found with that id" };
      return next(error);
    }
    try {
      const event = await Event.findById(req.params.eventId)
                                .sort({ createdAt: -1 })
                                .populate("creator", "_id, username");
      return res.json(event);
    }
    catch(err) {
      return res.json([]);
    }
})

router.patch('/:id', requireUser, validateEventInput, async (req, res, next) => {    
    try {
        Event.findByIdAndUpdate(req.params.id, {
            creator: req.user._id,
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            distance: req.body.distance,
            initCoords: req.body.initCoords,
            price: req.body.price,
            supplies: req.body.supplies,
            gameStatus: req.body.status,
            elevation: req.body.elevation,
            date: req.body.date,
            location: req.body.location
        })
        .exec()
        .then((event) => {
            if(!event) {
                res.status(400).send(`Event ${req.params.id} was not found`);
            } else {
                res.status(200).send(`Event ${req.params.id} was updated`)
            }
    })
    }
    catch(err) {
        next(err)
    }
});

router.delete('/:id', requireUser, async(req, res, next) => {
    try {
        Event.findByIdAndRemove(req.params.id)
        .exec()
        .then((event) => {
            if(!event) {
                res.status(400).send(`Event ${req.params.id} was not found`);
            } else {
                res.status(200).send(`Event ${req.params.id} was deleted`)
            }
    })
    }
    catch(err) {
        next(err)
    }
})

router.post("/postImages", function (req, res) {
    let photoUrl
    console.log('here2')
    imageUpload.single("images")(req, res, function (err) {
        photoUrl = req.file.location
      if (err) {
        // return res.json({})
        console.log(err);
      }
    });

    try {
        Event.findByIdAndUpdate(req.params.id, {
            creator: req.user._id,
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            distance: req.body.distance,
            initCoords: req.body.initCoords,
            price: req.body.price,
            supplies: req.body.supplies,
            gameStatus: req.body.status,
            elevation: req.body.elevation,
            date: req.body.date,
            status: req.body.status,
            location: req.body.location
        })
        .exec()
        .then((event) => {
            if(!event) {
                res.status(400).send(`Event ${req.params.id} was not found`);
            } else {
                res.status(200).send(`Event ${req.params.id} was updated`)
            }
    })
    }
    catch(err) {
        next(err)
    }


});

// router.post("/postImages", requireUser, function (req, res) {
//     console.log('here')
//     const uid = req.user._id;
  
//     imageUpload(req, res, function (err) {
  
//       if (err) {
//         return res.json({
//           success: false,
//           errors: {
//             title: "Image Upload Error",
//             detail: err.message,
//             error: err,
//           },
//         });
//       }
//       console.log(req)
//       let update = { profilePicture: req.file.location };
  
//       Event.findByIdAndUpdate(uid, update, { new: true })
//         .then((user) => res.status(200).json({ success: true, user: user }))
//         .catch((err) => res.status(400).json({ success: false, error: err }));
//     });
//   });


module.exports = router;