const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
} = require('../utils')

const getAllUsers = async (req, res) => {
    console.log(req.user)
    // const users = await User.find({ role: 'user' }).select('-password')
    const users = await User.find({role: {$in: ['user', 'owner']}}).select('-password')
    res.status(StatusCodes.OK).json({users})
}
const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).select('-password')
    if (!user) {
        throw new CustomError.NotFoundError(
            `No user with id ${req.params.id} found`
        )
    }
    await checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}
// update user details using user.save() method
const updateUser = async (req, res) => {
    const {email, name} = req.body
    if (!email || !name) {
        throw new CustomError.BadRequestError('Name and Email required')
    }
    const user = await User.findOne({_id: req.user.userId})
    user.email = email
    user.name = name
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser})
}
// Update User Details using findOneAndUpdate
/*
const updateUser = async (req, res) => {
    const {email, name} = req.body
    if (!email || !name) {
        throw new CustomError.BadRequestError("Name and Email required")
    }
    const user = await User.findOneAndUpdate(
        {_id: req.user.userId},
        {name, email},
        {new: true, runValidators: true}
    )
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser})
}
 */
const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values')
    }
    if (oldPassword === newPassword) {
        throw new CustomError.BadRequestError(
            'Old password and new password cannot be same'
        )
    }
    const user = await User.findOne({_id: req.user.userId})
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword
    user.save()
    res.status(StatusCodes.OK).json({msg: 'Password changed successfully'})
}

const upgradeToMerchant = async (req, res) => {
    console.log('Upgrade to merchant')
    const user = await User.findOne({_id: req.user.userId})
    user.role = 'owner'
    // saving with save method
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({res, user: tokenUser})
    res.status(StatusCodes.OK).json({user: tokenUser})
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    upgradeToMerchant,
}
