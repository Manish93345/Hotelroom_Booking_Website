const express = require("express");
const app = express();

const mongoose = require("mongoose");

const Listing = require("./models/listing.js");

// for making ejs template
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// update karne ke liye overrride
const mehtodOverride = require("method-override");
app.use(mehtodOverride("_method"));

// to use params in show route
app.use(express.urlencoded({extended: true}));

// styling ke liye ejs mate
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);

// to use static files like css
app.use(express.static(path.join(__dirname, "/public")));

const wrapAsync = require("./utils/wrapAsync.js");

//requiring expresserror for custom errors
const ExpressError = require("./utils/ExpressError.js");

// requiriring listing schema to validate our databse schmea
const {listingSchema} = require("./schema.js");

// database creation and connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=> {
        console.log("connected to database");
    }).catch((err) => {
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_URL);
}


app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

app.get("/", (req, res) => {
    res.send("Working");
});

// route to test listing model

// app.get("/testListing", async (req, res) => {
//     let sammpleListing = new Listing({
//         title: "Maish aur Lisa ka pyara ghar",
//         description: "Beach ke kinare",
//         price: 12000,
//         Location: "Calangute, Goa",
//         country: "India",
//     });

//     await sammpleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// });



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
    const listing = await Listing.findById(id);
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

app.use((err, req, res, next) => {
    let {statusCode, message} = err;
    res.render("error.ejs", {message});
  
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
}); 
