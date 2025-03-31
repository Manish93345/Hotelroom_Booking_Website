const express = require("express");
const app = express();

const mongoose = require("mongoose");

const Listing = require("./models/listing.js")

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
app.get("/testListing", async (req, res) => {
    let sammpleListing = new Listing({
        title: "Maish aur Lisa ka pyara ghar",
        description: "Beach ke kinare",
        price: 12000,
        Location: "Calangute, Goa",
        country: "India",
    });

    await sammpleListing.save();
    console.log("sample was saved");
    res.send("successful");
});