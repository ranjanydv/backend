const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	website: {
		type: String,
	},
	location: {
		type: String,
	},
	contactEmail: {
		type: String,
		required: true,
		max: 100,
	},
	contactNumber: {
		type: String,
		required: false,
		max: 15,
	},
	// favouriteListing: [
	//   {
	//     listingId: {
	//       type: Schema.Types.ObjectId,
	//       ref: 'propertylisting',
	//     },
	//     savedAt: {
	//       type: Date,
	//       default: Date.now,
	//     },
	//   },
	// ],

	//   viewedListing: [
	//     {
	//       listingId: {
	//         type: Schema.Types.ObjectId,
	//         ref: 'propertylisting',
	//       },
	//       viewedAt: {
	//         type: Date,
	//         default: Date.now,
	//       },
	//     },
	//   ],

	//   listedproperties: [
	//     {
	//       type: Schema.Types.ObjectId,
	//       ref: 'propertylisting',
	//     },
	//   ],
	//   ownedproperty: [
	//     {
	//       propertyId: {
	//         type: Schema.Types.ObjectId,
	//         ref: 'propertylisting',
	//       },
	//       cost: {
	//         type: String,
	//       },
	//       description: {
	//         type: String,
	//       },
	//       inprofilesince: {
	//         type: Date,
	//         default: Date.now,
	//       },
	//     },
	//   ],
	//   rentedproperty: [
	//     {
	//       propertyId: {
	//         type: Schema.Types.ObjectId,
	//         ref: 'propertylisting',
	//       },
	//       cost: {
	//         type: String,
	//       },
	//       rentFrequency: {
	//         type: String,
	//       },
	//       description: {
	//         type: String,
	//       },
	//       inprofile: {
	//         type: Date,
	//         default: Date.now,
	//       },
	//     },
	//   ],
})
UserSchema.set('timestamps', true)

module.exports = Profile = mongoose.model('profile', UserSchema)
