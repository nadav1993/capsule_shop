'use strict';

const mongoose = require('mongoose');
const View = mongoose.model('View');
const Capsule = mongoose.model('Capsule');

module.exports.newView = (req, res) => {
    let view = new View(req.body);

    view.save().then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);        
    });
};

module.exports.recommend = (req, res) => {
    View.aggregate([
        {
            $group: {
                _id: '$strength',
                views: {
                   $push: '$$ROOT'
               }
           }
        }
    ]).then(results => {
        if (results.length === 0) {
            res.json(null);
        } else {
            results.sort((a, b) => {
                return b.views.length - a.views.length;
            });
            results[0].views.sort((a, b) => {
                return new Date(b.viewDate) - new Date(a.viewDate);
            });
            const topStrength = results[0]._id;
            const lastVisited = results[0].views[0].productId;
            Capsule.findOne({ strength: topStrength, _id: { $ne: lastVisited } }).then(obj => {
                res.json(obj);
            }).catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};