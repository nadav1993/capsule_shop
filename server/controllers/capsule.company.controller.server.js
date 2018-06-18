'use strict';

const mongoose = require('mongoose');
const Company = mongoose.model('Company');
const socket = require('../socket.io.js');

module.exports.getAllCompanies = (req, res) => {
    Company.find().then(results => {
        res.json(results);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

module.exports.addCompany = (req, res) => {
    let company = new Company(req.body);
    
    company.save().then(result => {
        res.json(result);
        socket.emit('companyAdded', result.toJSON());
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);        
        });
}

module.exports.fillData = (req, res) => {
    Company.find().then((results) => {
        if (results.length == 0) {
            const now = new Date();
            let arr = [
                {
                    name: 'Nespresso',
                    creationDate: now,
                    updateDate: now
                },
                {
                    name: 'Nescaffe',
                    creationDate: now,
                    updateDate: now
                },
                {
                    name: 'Seattlecoffeegear',
                    creationDate: now,
                    updateDate: now
                },
                {
                    name: 'ZCafe',
                    creationDate: now,
                    updateDate: now
                },
                {
                    name: 'Bon Caffe',
                    creationDate: now,
                    updateDate: now
                }
            ];

            Company.collection.insertMany(arr).then((d)=> {
                console.log(d);
            }).catch(err => {
                console.log(err);
            });
        }
    })
}