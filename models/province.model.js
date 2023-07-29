const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true
        },
        emplacement: {
            type: {
                latitude: Number,
                longitude: Number
            },
            required: true
        },
        imagecouverture: {
            type: String,
            required: true
        },
        couleur: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        collection: "province"
    }
);

const Province = mongoose.model("Province", ProvinceSchema);

module.exports = Province;
