const Review = require('../models/Review')
const Product = require('../models/Product')

const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermissions } = require('../utils')

const createReview = async (req, res) => {
	const { product: productId } = req.body

	// This checks if the product exists or not
	const isValidProduct = await Product.findById(productId)
	if (!isValidProduct) {
		throw new CustomError.NotFoundError(`No product with id ${productId} found`)
	}
	// This checks whether the user has already submitted a review
	const alreadySubmitted = await Review.findOne({
		product: productId,
		user: req.user.userId,
	})
	if (alreadySubmitted) {
		throw new CustomError.BadRequestError(
			'You already have a review for this product'
		)
	}
	req.body.user = req.user.userId
	const review = await Review.create(req.body)
	res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
	const reviews = await Review.find({})
		.populate({
			path: 'product',
			select: 'name company price',
		})
		.populate({ path: 'user', select: 'name' })
	if (reviews.length === 0) {
		res.status(StatusCodes.OK).json({ msg: `No Reviews Till Now` })
		return
	}
	res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}

const getSingleReview = async (req, res) => {
	const { id: reviewId } = req.params
	const review = await Review.findOne({ _id: reviewId })
		.populate({
			path: 'product',
			select: 'name company price',
		})
		.populate({ path: 'user', select: 'name' })
	if (!review) {
		throw new CustomError.NotFoundError(`No review found of ID: ${reviewId}`)
	}
	res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
	const { id: reviewId } = req.params
	const { rating, title, comment } = req.body
	const review = await Review.findOne({ _id: reviewId })
	if (!review) {
		throw new CustomError.NotFoundError(`No review found of ID: ${reviewId}`)
	}
	// Checking if the user who tends to update the review is the one who created it or not
	await checkPermissions(req.user, review.user)
	// Updating the values
	review.rating = rating
	review.title = title
	review.comment = comment
	// Update using Save Method
	await review.save()
	res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
	const { id: reviewId } = req.params
	const review = await Review.findOne({ _id: reviewId })
	if (!review) {
		throw new CustomError.NotFoundError(`No review with id: ${reviewId} found`)
	}
	await checkPermissions(req.user, review.user)
	await review.remove()
	res.status(StatusCodes.OK).json({ msg: `Review deletion Successful` })
}

const getSingleProductReviews = async (req, res) => {
	const { id: productId } = req.params
	const reviews = await Review.find({ product: productId })
	res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}

module.exports = {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	getSingleProductReviews,
}
