const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        ownerName: { type: String, required: true },
        ownerAvatar: { type: String },
        songs: [{ type: ObjectId, ref: 'Song' }],
        listenerIds: [{ type: String }],
        published: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
)

playlistSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = mongoose.model('Playlist', playlistSchema)