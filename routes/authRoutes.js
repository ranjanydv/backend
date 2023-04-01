const express = require('express')
const router = express.Router()

const {
	register,
	login,
	logout,
	validateTokenForMobile,
	registerMerchant,
} = require('../controllers/authController')

// get routes
router.get('/logout', logout)
// router.get('/forgotPassword', forgotPassword)

// post routes
router.post('/register', register)
router.post('/login', login)
router.post('/isValidToken', validateTokenForMobile)
router.post('/joinMerchant', registerMerchant)

// patch routes
// router.patch('/updatePassword', updatePassword)
// router.patch('/updateProfile', updateProfile)

// delete routes
// router.get('/deleteUser', deleteUser)

module.exports = router
