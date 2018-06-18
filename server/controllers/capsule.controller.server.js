'use strict';

const mongoose = require('mongoose');
const Capsule = mongoose.model('Capsule');
const socket = require('../socket.io.js');
const { escapeRegExp } = require('lodash');

module.exports.cartCheckout = (req, res) => {
    socket.emit('checkout', {message: 'succeeded'});
};

module.exports.search = (req, res) => {
    const name = req.body.name || '';
    const strengths = req.body.strengths || [];
    const companies = req.body.companies || [];
    let opts = {};

    if (companies.length !== 0) {
        opts.company = { $in: companies };
    }
    if (name !== '') {
        opts.name = { $regex: escapeRegExp(name.trim()), $options: 'i' };
    }
    if (strengths.length !== 0) {
        opts.strength = { $in: strengths };
    }
    Capsule.find(opts).then(results => {
        res.json(results);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

module.exports.getAllCapsules = (req, res) => {
    Capsule.aggregate([
        {
            $group: {
                _id: '$company',
                capsules: {
                   $push: '$$ROOT'
               }
           }
        }
    ]).then(results => {
        res.json(results);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
};

module.exports.fillData = (req, res) => {
    Capsule.find().then((results)=> {
        if (results.length == 0) {
            let arr = [
                {company: 'Nespresso', strength: 0, name: 'Livanto', price: 1, description: 'Nespressos leading roast', image: 'livanto.jpg'},
                {company: 'Nespresso', strength: 1, name: 'Capriccio', price: 2, description: 'Light Roast', image: 'Capriccio.jpg'},
                {company: 'Nescaffe', strength: 2, name: 'Grande Intenso', price: 1, description: '', image: 'Grande_Intenso.jpg'},
                {company: 'Nescaffe', strength: 0, name: 'Arpeggio', price: 3, description: '', image: 'Arpeggio.jpg'},
                {company: 'Seattlecoffeegear', strength: 1, name: 'Roma', price: 2, description: '', image: 'Roma.jpg'},
                {company: 'Seattlecoffeegear', strength: 2, name: 'Volluto', price: 1, description: '', image: 'Volluto.png'},
                {company: 'ZCafe', strength: 0, name: 'Cosi', price: 3, description: '', image: 'Cosi.jpg'},
                {company: 'ZCafe', strength: 1, name: 'Dulsão Do Brazil', price: 2, description: '', image: 'Dulsao_do_Brasil.jpg'},
                {company: 'Bon Caffe', strength: 2, name: 'Rosabaya de Brazil', price: 2, description: '', image: 'Rosabaya-de-Colombia.png'},
                {company: 'Nespresso', strength: 0, name: 'Ristretto', price: 3, description: 'Strong Coffee', image: 'Ristretto.jpg'},
                {company: 'Bon Caffe', strength: 1, name: 'Indriya from India', price: 1, description: '', image: 'Indriya-from-India.png'}
            ];

            Capsule.collection.insertMany(arr).then((d)=> {
                console.log(d);
            }).catch(err => {
                console.log(err);
            });
        }
    })
}

module.exports.getCapsuleById = (req, res) => {
    Capsule.findById(req.params.id).then(results => {
        res.json(results);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);        
    });
}

module.exports.addCapsule = (req, res) => {
    let capsule = new Capsule(req.body);

    capsule.save().then(result => {
        res.json(result);
        socket.emit('capsuleAdded', result.toJSON());
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);        
    });
}

module.exports.updateCapsule = (req, res) => {
    Capsule.findByIdAndUpdate(req.body._id, req.body, {new: true}).then(result => {
        res.json(result);
        socket.emit('capsuleUpdated', result.toJSON());        
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);        
    });    
}

module.exports.deleteCapsule = (req, res) => {
    Capsule.findByIdAndRemove(req.params.id).then(result => {
        res.json(result);
        socket.emit('capsuleRemoved', result.toJSON());                
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);        
    });    
}

module.exports.uploadCapsuleImage = (req, res) => {
    res.json(req.file);
}