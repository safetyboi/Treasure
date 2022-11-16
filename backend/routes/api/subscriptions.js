const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Subscription = mongoose.model('Subscription');
const { requireUser } = require('../../config/passport');
// const Subscription = require('../../models/Subscription');
const validateSubscriptionInput = require('../../validations/subscription');


router.get('/', async (req, res) => {
    try {
        const events = await Subscription.find()
        return res.json(events);
    }
    catch(err) {
        return res.json([]);
    }
});

router.get('/:userId', async (req, res, next) => {
    let subscription;
    try {
        console.log(req.params.eventId)
        subscription = await Subscription.find({user: req.params.userId})
        return res.json(subscription);
    } catch(err) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      error.errors = { message: "No event found with that id" };
      return next(error);
    }

})

router.post('/:eventId', requireUser, validateSubscriptionInput, async (req, res, next) => {
    console.log('hello')
    try {
        const newSubscription = new Subscription({
            user: req.user._id,
            event: req.params.eventId,
            currentPin: req.body.currentPin,
            location: req.body.location
        })

        let subscription = await newSubscription.save()
        subscription = await Subscription.populate("name", "description _id")
        return res.json(subscription)
    }
    catch(err) {
        next(err)
    }
})

router.patch('/:id', requireUser, validateSubscriptionInput, async (req, res, next) => {    
    try {
        Subscription.findByIdAndUpdate(req.params.id, {
            currentPin: req.body.currentPin,
            location: req.body.location
        })
        .exec()
        .then((pin) => {
            if(!pin) {
                res.status(400).send(`Subscription ${req.params.id} was not found`);
            } else {
                res.status(200).send(`Subscription ${req.params.id} was updated`)
            }
    })
    }
    catch(err) {
        next(err)
    }
});

router.delete('/:subscriptionId', requireUser, async(req, res, next) => {
    try {
        Subscription.findByIdAndRemove(req.params.subscriptionId)
        .exec()
        .then((subscription) => {
            if(!subscription) {
                res.status(400).send(`Subscription ${req.params.subscriptionId} was not found`);
            } else {
                res.status(200).send(`Subscription ${req.params.subscriptionId} was deleted`)
            }
    })
    }
    catch(err) {
        next(err)
    }
})

module.exports = router;