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

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

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


const sessionOptions = {
    secret: "Lisa_baby",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req, res) => {
    res.send("Working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});






app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld"); 
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.use((err, req, res, next) => {
    let {statusCode, message} = err;
    res.render("error.ejs", {message});
  
});

app.use((req, res) => {
    res.status(404).send("Page not found");
  });
  

app.use("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
}); 


