const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const User = require("../models/user.js");


const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const LisitingController = require("../controllers/listings.js");



router.route("/")
    .get(wrapAsync(LisitingController.index))
    .post(upload.single('listing[image]'), wrapAsync(LisitingController.createListing));


router.get("/new", isLoggedIn, LisitingController.renderNewForm);

router.route("/:id")
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), LisitingController.updateListing)
    .delete(isLoggedIn, isOwner, LisitingController.destroyListing)
    .get(LisitingController.showListing);

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let  errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};




// edit route
router.get("/:id/edit", isLoggedIn, isOwner, LisitingController.renderEditForm);


module.exports = router;
