const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const register = async (req, res) => {
	const { email, name, password } = req.body
	const emailAlreadyExists = await User.findOne({ email })
	if (emailAlreadyExists)
		throw new CustomError.BadRequestError('Email already exists')

	// * make the first user Admin by default
	const isFirstUser = (await User.countDocuments({})) === 0
	const role = isFirstUser ? 'admin' : 'user'

	const user = await User.create({ email, name, password, role })
	const tokenUser = createTokenUser(user)
	// const tokenUser = { name: user.name, userId: user._id, role: user.role }
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new CustomError.BadRequestError('Please provide email and password')
	}
	const user = await User.findOne({ email })
	if (!user) {
		throw new CustomError.UnauthenticatedError('Invalid Credentials')
	}
	const isPasswordCorrect = await user.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError('Invalid Credentials')
	}
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = async (req, res) => {
	res.cookie('userToken', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now()),
	})
	res.status(StatusCodes.OK).json({ msg: 'Logout Successful' })
}

const validateTokenForMobile = async (req, res) => {
	try {
		const token = req.header('x-auth-token')
		if (!token) {
			throw new CustomError.BadRequestError('Please provide token')
		}
		const isTokenValid = ({ token }) =>
			jwt.verify(token, process.env.JWT_SECRET)

		if (!isTokenValid) {
			throw new CustomError.UnauthenticatedError('Invalid Credentials')
		}
		const user = await User.findById(isTokenValid.id).select('-password')
		if (!user) {
			throw new CustomError.UnauthenticatedError('Invalid Credentials')
		}

		// const attachCookiesToResponse = ({ res, user }) => {
		// 	const token = createJWT({ payload: user })
		// 	const oneDay = 1000 * 60 * 60 * 24
		// 	res.cookie('userToken', token, {
		// 		httpOnly: true,
		// 		expires: new Date(Date.now() + oneDay),
		// 		secure: process.env.NODE_ENV.trim() !== 'dev',
		// 		signed: true,
		// 	})
		// }
		res.status(StatusCodes.OK).json(true)
	} catch (error) {
		console.error(error)
	}
}

const registerMerchant = async (req, res) => {
	const { email, name, password } = req.body
	const emailAlreadyExists = await User.findOne({ email })
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email Already Exists.')
	}
	const role = 'owner'
	const user = await User.create({ email, name, password, role })
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

module.exports = {
	register,
	login,
	logout,
	validateTokenForMobile,
	registerMerchant,
}
