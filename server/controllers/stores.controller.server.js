'use strict';

const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const socket = require('../socket.io.js');
const { escapeRegExp } = require('lodash');

module.exports.getAllStores = (req, res) => {
    socket.on('home', (data) => {
        console.log(data);
        socket.emit('data', 'socket test succeeded');
    });
    Store.find().then(results => {
        res.json(results);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

module.exports.search = (req, res) => {
    const name = req.body.name || '';
    const city = req.body.city || '';
    const phone = req.body.phone || '';
    let opts = {};

    if (city !== '') {
        opts.city = { $regex: escapeRegExp(city.trim()), $options: 'i' };
    }
    if (name !== '') {
        opts.name = { $regex: escapeRegExp(name.trim()), $options: 'i' };
    }
    if (phone !== '') {
        opts.phone = { $regex: escapeRegExp(phone.trim()), $options: 'i' };
    }
    Store.find(opts).then(results => {
        res.json(results);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

module.exports.fillData = (req, res) => {
    Store.find().then((results) => {
        if (results.length == 0) {

            let arr = [
                {name:"BestCoffee", address:"ענתות 33", city:"תל אביב", phone:"054-4719550"},
                {name:"OfferCoffee", address:"שמורת נחל בשור 8", city:"נתניה", phone:"052-6646489"},
                {name:"HellaCoffe", address:"מרוה 4", city:"חיפה", phone:"054-2000608"}];

            Store.collection.insertMany(arr).then((d)=> {
                console.log(d);
            }).catch(err => {
                console.log(err);
            });
        }
    })
}