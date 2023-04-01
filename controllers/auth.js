// const { StatusCodes } = require('http-status-codes')
// const { BadRequestError, UnauthenticatedError } = require('../errors')
//
// const User = require('../models/User')
//
// // ! Register
// const register = async (req, res) => {
// 	const user = await User.create({ ...req.body })
// 	const token = user.createJWT()
// 	res.status(StatusCodes.CREATED).json({
// 		user: {
// 			email: user.email,
// 			name: user.name,
// 			lastName: user.lastName,
// 			location: user.location,
// 			token,
// 		},
// 	})
// }
//
// // ! Login
// const login = async (req, res) => {
// 	const { email, password } = req.body
// 	if (!email || !password) {
// 		throw new BadRequestError('Please provide email and password')
// 	}
//
// 	// check for user
// 	const user = await User.findOne({ email })
// 	if (!user) {
// 		throw new UnauthenticatedError('Invalid Credentials')
// 	}
//
// 	// compare password
// 	const isPasswordCorrect = await user.comparePassword(password)
// 	if (!isPasswordCorrect) {
// 		throw new UnauthenticatedError('Invalid Credentials')
// 	}
//
// 	const token = user.createJWT()
// 	res.status(StatusCodes.OK).json({
// 		user: {
// 			email: user.email,
// 			name: user.name,
// 			lastName: user.lastName,
// 			location: user.location,
// 			token,
// 		},
// 	})
// }
// // ! Update user
// const updateUser = async (req, res) => {
// 	const { email, name, lastName, location } = req.body
// 	if (!email || !name || !lastName || !location) {
// 		throw new BadRequestError('Please provide all fields')
// 	}
// 	const user = await User.findOne({ _id: req.user.userId })
// 	user.email = email
// 	user.name = name
// 	user.lastName = lastName
// 	user.location = location
//
// 	await user.save()
//
// 	const token = user.createJWT()
// 	res.status(StatusCodes.OK).json({
// 		user: {
// 			email: user.email,
// 			name: user.name,
// 			lastName: user.lastName,
// 			location: user.location,
// 			token,
// 		},
// 	})
// }
//
// module.exports = { register, login, updateUser }
