const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema(
    {
        "nom": {
            type: String,
            required: true
        },
        "prenom": {
            type: String,
            default: ''
        },
        "datenaissance": {
            type: Date,
            required: true
        },
        "username": {
            type: String,
            required: true,
        },
        "email": {
            type: String,
            required: true,
        },
        "password": {
            type: String,
            required: true,
        },
        "profilepicture": {
            type: String,
            default: 'default-avatar.png'
        },
        "datecreation": {
            type: Date,
            default: Date.now()
        },
        "typeCompte": {
            type: String,
            default: 'user',
        }
    },
    {
        collection: "utilisateur"
    }
);

const Utilisateur = mongoose.model("Utilisateur", UtilisateurSchema);

module.exports = Utilisateur;