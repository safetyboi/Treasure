const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const { requireUser } = require('../../config/passport');
const validateEventInput = require('../../validations/events');


router.get('/', async (req, res) => {
    try {
        const events = await Event.find().populate("name", "description", "_id");
        return res.json(events);
    }
    catch(err) {
        return res.json([]);
    }
});

router.post('/', requireUser, validateEventInput, async (req, res, next) => {
    try {
        const newEvent = new Event({
            name: req.body.name,
            description: req.body.description,
            duration: req.body.duration,
            distance: req.body.distance,
            price: req.body.price,
            supplies: req.body.supplies
        })

        let event = await newEvent.save()
        event = await Event.populate("name", "description _id")
        return res.json(event)
    }
    catch(err) {
        next(err)
    }
})

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