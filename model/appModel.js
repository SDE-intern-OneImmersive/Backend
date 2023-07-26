const mongoose = require('mongoose');

const Version_Schema = new mongoose.Schema({
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
// Define the schema for our user model
const Schema = new mongoose.Schema({
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
        type: [Version_Schema],
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const AppSchema = mongoose.model("AppSchema", Schema);
module.exports = { AppSchema };