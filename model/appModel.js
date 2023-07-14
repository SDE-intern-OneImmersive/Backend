const mongoose = require('mongoose');

const VersionSchema = require('./verModel');
// Define the schema for our user model
const Schema = mongoose.Schema({
    appID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    Endpoint: {
        type: String,
        required: false,
    },
    ConnectionOptions: {
        URLs: {
            type: String,
            required: false,
        },
        Username: {
            type: String,
            required: false,
        },
        Credential: {
            type: String,
            required: false,
        },
    },
    Authentication: {
        Endpoint: {
            type: String,
            required: false,
        },
        Type: {
            type: String,
            required: false,
        },
    },
    CloudParameters: {
        GPUs: {
            type: String,
            required: false,
        },
        Regions: {
            type: String,
            required: false,
        },
        Weight: {
            type: String,
            required: false,
        },
    },
    Advanced: {
        CPU: {
            type: String,
            required: false,
        },
        Memory: {
            type: String,
            required: false,
        },
    },
    versions: {
        type: [VersionSchema],
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AppSchema = mongoose.model('AppSchema', Schema);
export default AppSchema;