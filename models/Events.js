const mongoose = require('mongoose')

const EventsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event Name Required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'done', 'cancelled'],
        default: 'upcoming'
    },
    desc: {
        type: String,
        required: [true, 'Enter Event Description']
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    date: {
        type: Date,
        required: [true, 'Event Date Required'],
    }
})

module.exports = mongoose.model('Events', EventsSchema)