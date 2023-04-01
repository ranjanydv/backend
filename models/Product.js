const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Product name must be provided'],
            maxlength: [100, 'Product name cannot be more than 100 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Product price must be provided'],
            default: 0,
        },
        lastBid: {
            type: Number,
            required: [true, 'Product price must be provided'],
            default: 0,
        },
        status: {
            type: String,
            default: 'basic',
            enum: {
                values: ['live', 'upcoming', 'basic', 'done'],
                message: '{VALUE} is not supported',
            },
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Product description must be provided'],
            maxlength: [
                1000,
                'Product description cannot be more than 1000 characters',
            ],
        },
        image: {
            type: String,
            default: '/uploads/example.jpg',
        },
        category: {
            type: String,
            required: [true, 'Product category must be provided'],
            enum: ['traditional', 'cultural', 'others'],
        },
        company: {
            type: String,
            enum: {
                values: ['ikea', 'liddy', 'marcos'],
                message: '{VALUE} is not supported',
            },
        },
        colors: {
            type: [String],
            default: ['#000', '#fff']
        },
        featured: {
            type: Boolean,
            default: false,
        },
        freeShipping: {
            type: Boolean,
            default: false,
        },
        inventory: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        numOfBids: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    }
)
/* This links the review model to the product model
 *	And can be used to retrieve list of review in the product description
 */
ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
    // match: { rating: 1 },
})

// This deletes all the bids made on the product
ProductSchema.virtual('bids', {
    ref: 'Bidding',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
    // match: { rating: 1 },
})

ProductSchema.post('remove', async function (doc) {
    if (doc) {
        // this deletes all reviews
        await mongoose.model('Review').deleteMany({product: doc._id})
        // this deletes all Bids
        await mongoose.model('Bidding').deleteMany({product: doc._id})
    }
})


module.exports = mongoose.model('Product', ProductSchema)
