const express = require("express");
const router = express.Router();

// index route listing

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

// create or new route 
// isko show route se upar rakhna hai nhi toh wo phir new name ka id ko search karega
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});


// create route after adding new listing
// ye async type ka hoga kyunki isse database mein changes karne wale hain
app.post("/listings",wrapAsync (async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
   
    
}));

// show route (READ)
app.get("/listings/:id",async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", {listing} );
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing} );
});

// update route
app.put("/listings/:id",async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});  // req.body.listing ko deconstruct kar rhe hain
    res.redirect(`/listings/${id}`);
});

// delete route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings"); 
});
