'use strict';

const capsuleController = require('../controllers/capsule.controller.server');
const companyController = require('../controllers/capsule.company.controller.server');
const storesController = require('../controllers/stores.controller.server');
const viewsController = require('../controllers/view.controller.server');
const twitterController = require('../controllers/twitter.controller.server');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('public/Images/'));
    }
});

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000,
        files: 1
    },
    fileFilter: imageFilter
});

function imageFilter(req, file, cb) {
    // accept image only
    if (!file.mimetype.match(/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    
    cb(null, true);
};

module.exports = (app) => {
    app.route('/').get((req, res) => {  
        capsuleController.fillData();
        companyController.fillData();
        storesController.fillData();
        twitterController.init();
		res.sendFile(path.resolve('server/views/index.html'));
	});

    app.route('/api/capsules')
        .get(capsuleController.getAllCapsules)
        .post(capsuleController.addCapsule)
        .put(capsuleController.updateCapsule);

    app.route('/api/capsuleSearch')
        .post(capsuleController.search);

    app.route('/api/capsule/:id')
        .get(capsuleController.getCapsuleById)
        .delete(capsuleController.deleteCapsule);

    app.route('/api/upload').post(upload.single('file'), capsuleController.uploadCapsuleImage);

    app.route('/api/companies')
        .get(companyController.getAllCompanies)
        .post(companyController.addCompany);

    app.route('/api/stores').get(storesController.getAllStores);

    app.route('/api/storesSearch').post(storesController.search);

    app.route('/api/cart').get(capsuleController.cartCheckout);

    app.route('/api/view')
        .get(viewsController.recommend)
        .put(viewsController.newView);

    app.route('/api/twits')
        .get(twitterController.init)
        .post(twitterController.postTweet);
}

