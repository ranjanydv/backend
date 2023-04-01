const Bidding = require('../models/Bidding')
const Product = require('../models/Product')

const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {onlyUsersBid} = require("../utils/onlyUsersBid");


const createBid = async (req, res) => {
    const {bidAmount, product: productId} = req.body

    // This checks if the product exists or not
    const isProduct = await Product.findById(productId)
    if (!isProduct) {
        throw new CustomError.NotFoundError(`No product with id ${productId} found`)
    }
    // the owner is not allowed to bid
    await onlyUsersBid(req.user, isProduct.user)

    // Bidding Amount verification
    if (bidAmount <= isProduct.price) {
        throw new CustomError.BadRequestError("Cannot Bid less than base amount")
    }
    if (bidAmount <= isProduct.lastBid) {
        throw new CustomError.BadRequestError("A higher or same bid amount already exists")
    }
    isProduct.lastBid = bidAmount
    // Update the last bid in the product table using Save Method
    await isProduct.save()


    req.body.bidder = req.user.userId
    const bid = await Bidding.create(req.body)
    res.status(StatusCodes.CREATED).json({bid})

}

const getAllBids = async (req, res) => {
    const bids = await Bidding.find({})
        .populate({
            path: 'product',
            select: 'name category price lastBid',
        })
        .populate({path: 'bidder', select: 'name'})
    if (bids.length === 0) {
        res.status(StatusCodes.OK).json({msg: `No Bids Till Now`})
        return
    }
    res.status(StatusCodes.OK).json({count: bids.length, bids})
}


const getSingleBid = async (req, res) => {
    const {id: bidId} = req.params
    const bid = await Bidding.findOne({_id: bidId})
        .populate({
            path: 'product',
            select: 'name company price lastBid numOfBids',
        })
        .populate({path: 'bidder', select: 'name'})
    if (!bid) {
        throw new CustomError.NotFoundError(`No bid found of ID: ${bidId}`)
    }
    res.status(StatusCodes.OK).json({bid})
}


const getCurrentUserBids = async (req, res) => {
    const bids = await Bidding.find({bidder: req.user.userId}).populate({
        path: 'product',
        select: 'name category price',
    }).select('-bidder');
    res.status(StatusCodes.OK).json({count: bids.length, bids});
}


module.exports = {
    getAllBids,
    getSingleBid,
    createBid,
    getCurrentUserBids
}