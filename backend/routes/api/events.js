const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const { requireUser } = require('../../config/passport');
const validateEventInput = require('../../validations/events');


router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate("creator", "_id, username");
        return res.json(events);
    }
    catch(err) {
        return res.json([]);
    }
});

router.post('/', requireUser, validateEventInput, async (req, res, next) => {
    console.log(req.body.elevation)
    try {
        const newEvent = new Event({
            creator: req.user._id,
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            distance: req.body.distance,
            price: req.body.price,
            supplies: req.body.supplies,
            elevation: req.body.elevation
        })

        let event = await newEvent.save()
        event = await Event.populate("name", "description _id")
        return res.json(event)
    }
    catch(err) {
        next(err)
    }
})

router.get('/:userId', async (req, res, next) => {
    let user;
    try {
      user = await User.findById(req.params.userId);
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
})

router.patch('/:id', requireUser, validateEventInput, async (req, res, next) => {    
    try {
        Event.findByIdAndUpdate(req.params.id, {
            creator: req.user._id,
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            distance: req.body.distance,
            price: req.body.price,
            supplies: req.body.supplies,
            elevation: req.body.elevation
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

module.exports = router;