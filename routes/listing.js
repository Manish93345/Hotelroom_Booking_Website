const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const User = require("../models/user.js");

const LisitingController = require("../controllers/listings.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let  errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// index route listing
router.get("/", wrapAsync(LisitingController.index));

router.get("/new", isLoggedIn, LisitingController.renderNewForm);

router.post("/",wrapAsync(LisitingController.createListing));

// show route (READ)
router.get("/:id", LisitingController.showListing);

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, LisitingController.renderEditForm);

// update route
router.put("/:id",isLoggedIn, isOwner, LisitingController.updateListing);

// delete route
router.delete("/:id", isLoggedIn, isOwner, LisitingController.destroyListing);

module.exports = router;
