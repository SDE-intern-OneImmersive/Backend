const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    versionID: {
        type: String,
        required: true,
    },
    versionName: {
        type: String,
        required: false,
    },
    activeVersion: {
        type: Boolean,
        required: false,
    },
    ContainerTag: {
        type: String,
        required: false,
    },
    Registry: {
        type: String,
        required: false,
    },
    Username: {
        type: String,
        required: false,
    },
    Password: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const VersionSchema = mongoose.model('VersionSchema', Schema);
export default VersionSchema;