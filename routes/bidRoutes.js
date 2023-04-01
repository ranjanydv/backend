const express = require('express')
const router = express.Router()

const {authenticateUser, authorizePermissions} = require('../middleware/authentication')

const {
    createBid,
    getAllBids,
    getSingleBid,
    getCurrentUserBids,
} = require('../controllers/bidController')


router.route('/')
    .post(authenticateUser, createBid)
    .get(authenticateUser, authorizePermissions('admin'), getAllBids)

router.route('/showAllMyBids').get(authenticateUser, getCurrentUserBids)

router.route('/:id').get(authenticateUser, getSingleBid)

module.exports = router