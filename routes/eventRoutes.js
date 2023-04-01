const express = require('express')
const router = express.Router()

const {authenticateUser, authorizePermissions} = require('../middleware/authentication')

const {
    createEvent,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    deleteEvent

} = require('../controllers/eventController')


router.route('/')
    .post(authenticateUser, authorizePermissions('admin'), createEvent)
    .get(getAllEvents)


router.route('/:id')
    .get(getSingleEvent)
    .patch(authenticateUser, authorizePermissions('admin'), updateEvent)
    .delete(authenticateUser, authorizePermissions('admin'), deleteEvent)

module.exports = router