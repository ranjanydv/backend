const Event = require('../models/Events')

const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

const createEvent = async (req, res) => {
    const event = await Event.create(req.body)
    res.status(StatusCodes.CREATED).json({event})
}

const getAllEvents = async (req, res) => {
    const events = await Event.find({})
    if (events.length === 0) {
        res.status(StatusCodes.OK).json({msg: `No Events Till Now`})
        return
    }
    res.status(StatusCodes.OK).json({count: events.length, events})
}


const getSingleEvent = async (req, res) => {
    const {id: eventId} = req.params
    const event = await Event.findOne({_id: eventId})
    if (!event) {
        throw new CustomError.NotFoundError(`No Event found of ID: ${eventId}`)
    }
    res.status(StatusCodes.OK).json({event})
}

const updateEvent = async (req, res) => {
    const {id: eventId} = req.params
    const {status, date} = req.body
    const event = await Event.findOne({_id: eventId})
    if (!event) {
        throw new CustomError.NotFoundError(`No event found of ID: ${eventId}`)
    }

    event.status = status
    event.date = date
    // Update using Save Method
    await event.save()
    res.status(StatusCodes.OK).json({event})
}


const deleteEvent = async (req, res) => {
    const {id: eventId} = req.params
    const event = await Event.findOneAndDelete({_id: eventId})
    if (!event) {
        throw new CustomError.NotFoundError(`No event with id: ${eventId} found`)
    }
    res.status(StatusCodes.OK).json({msg: `Event deletion Successful`})
}

module.exports = {
    createEvent, getAllEvents, getSingleEvent, updateEvent, deleteEvent
}