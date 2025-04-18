const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

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
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

router.post("/",wrapAsync (async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
   
    
}));

// show route (READ)
router.get("/:id",async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing does'nt exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing} );
});

// edit route
router.get("/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing} );
});

// update route
router.put("/:id",async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});  // req.body.listing ko deconstruct kar rhe hain
    res.redirect(`/listings/${id}`);
});

// delete route
router.delete("/:id", async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings"); 
});

module.exports = router;
