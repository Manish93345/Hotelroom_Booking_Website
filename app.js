const express = require("express");
const app = express();

const mongoose = require("mongoose");

const Listing = require("./models/listing.js");
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


//requiring expresserror for custom errors
const ExpressError = require("./utils/ExpressError.js");

const reviews = require("./routes/review.js");

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


const Review = require("./models/review.js")




app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

app.get("/", (req, res) => {
    res.send("Working");
});


const listings = require("./routes/listing.js")


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



app.use((err, req, res, next) => {
    let {statusCode, message} = err;
    res.render("error.ejs", {message});
  
});





app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
}); 


