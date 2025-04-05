const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        Location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

module.exports = { listingSchema };