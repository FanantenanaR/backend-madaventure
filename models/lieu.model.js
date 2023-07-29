const mongoose = require('mongoose');

const LieuSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        corpstextuel: {
            type: String,
            default: '',
        },
        imagecouverture: {
            type: String,
            default: '',
        },
        idutilisateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Utilisateur',
        },
        province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Province',
            required: true
        },
        activites: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Activite'
                }
            ],
            default: []
        },
        datecreation: {
            type: Date,
            default: Date.now()
        },
        images: {
            type: [
                {
                    type: String
                }
            ],
            default: []
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
        collection: "lieu"
    }
);

const Lieu = mongoose.model("Lieu", LieuSchema);

module.exports = Lieu;
