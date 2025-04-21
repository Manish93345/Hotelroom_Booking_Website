const Listing = require("../models/listing")
const Review = require("../models/review");

module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");

    console.log("new review saved");
    res.redirect("/listings");
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pill: {reviews: reviewId}});
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
};