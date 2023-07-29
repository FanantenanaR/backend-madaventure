const mongoose = require('mongoose');

const ActiviteSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        imagecouverture: {
            type: String,
            required: true,
            default: 'default'
        },
        icon: {
            type: String,
            default: ''
        },
        couleurbackground: {
            type: String,
            default: ''
        },
        dateajout: {
            type: Date,
            default: Date.now()
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        dateSuppression: {
            type: Date,
        }
    },
    {
        collection: "activite"
    }
);

const Activite = mongoose.model("Activite", ActiviteSchema);

module.exports = Activite;
