const mongoose = require('mongoose');
const Event = require('../models/Event');

const express = require('express');
const router = express.Router();
// const Event = mongoose.model('Event');


const newEvent1 = new Event({
    creator: '637409b47a11fb016c4004b3',
    name: 'hike hunt',
    description: 'super trill',
    duration: 50,
    distance: 50,
    initCoords: {"latitude": 50, "longitude": 50},
    price: 50,
    supplies: 'shovel',
    gameStatus: false,
    elevation: '50',
    date: '1552261496289',
    location: "golden gate",
    image: "https://treasure-photos.s3.us-west-1.amazonaws.com/hike1.jpeg"
});
newEvent1.save()