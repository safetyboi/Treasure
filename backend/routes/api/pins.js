const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Pin = mongoose.model('Pin');
const { requireUser } = require('../../config/passport');
const validatePinInput = require('../../validations/pins');


router.get('/', async (req, res) => {
    try {
        const events = await Pin.find()
        return res.json(events);
    }
    catch(err) {
        return res.json([]);
    }
});

router.get('/:eventId', async (req, res, next) => {
    let pins;
    try {
        pins = await Pin.find({event: req.params.eventId})
        return res.json(pins);
    } catch(err) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        error.errors = { message: "No event found with that id" };
        return next(error);
    }

})

router.post('/:eventId', requireUser, validatePinInput, async (req, res, next) => {
    try {
        const dupPins = await Pin.find({event: req.params.eventId})

        Object.values(dupPins).forEach((dupPin) => {
            if (`${dupPin.order}` === req.body.order && `${dupPin.order}`) {
                throw next(error);
            }
        })

        const newPin = new Pin({
            event: req.params.eventId,
            location: req.body.location,
            order: req.body.order,
            task: req.body.task,
            directionToPin: req.body.directionToPin,
            price: req.body.price,
            supplies: req.body.supplies
        })

        let pin = await newPin.save()
        // pin = await Pin.populate("name", "description _id")
        return res.json(pin)
    }
    catch(err) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.errors = { message: "Cannot duplicate a pin" };
        next(error)
    }
})

router.patch('/:id', requireUser, validatePinInput, async (req, res, next) => {    
    try {
        Pin.findByIdAndUpdate(req.params.id, {
            event: req.params.eventId,
            location: req.body.location,
            order: req.body.order,
            task: req.body.task,
            directionToPin: req.body.directionToPin,
            price: req.body.price,
            supplies: req.body.supplies
        })
        .exec()
        .then((pin) => {
            if(!pin) {
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

router.delete('/:pinId', requireUser, async(req, res, next) => {
    try {
        Pin.findByIdAndRemove(req.params.pinId)
        .exec()
        .then((pin) => {
            if(!pin) {
                res.status(400).send(`Pin ${req.params.pinId} was not found`);
            } else {
                res.status(200).send(`Pin ${req.params.pinId} was deleted`)
            }
    })
    }
    catch(err) {
        next(err)
    }
})

module.exports = router;