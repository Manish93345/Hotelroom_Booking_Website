const express = require("express");
const app = express();
const session = require("express-session")
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption = {
    secret: "meri_pyari_Lisa",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let{name="anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "some error occured");
    } else {
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name });
});

// app.get("/test", (req, res) => {
//     res.send("test successful");
// })

// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });
app.listen(3000, () => {
    console.log("Server is listening to 3000");
});