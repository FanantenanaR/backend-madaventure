// services/utilisateur-service.js

const { normalizeString } = require('../helper/normalizer.helper');
const Utilisateur = require('../models/utilisateur.model');

// Créer un nouvel utilisateur
async function creerUtilisateur(nom, prenom, datenaissance, username, email, password, profilepicture) {
    try {
        const nouvelUtilisateur = new Utilisateur({
            nom,
            prenom,
            datenaissance,
            username,
            email,
            password,
            profilepicture,
        });
        const user = await nouvelUtilisateur.save();
        if (user) user.password = '';
        return user;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la création de l'utilisateur :", err);
        throw err;
    }
}


// Fonction pour générer un nom d'utilisateur alternatif basé sur le prénom et le nom de l'utilisateur
function genererUsernameSuggere(nom, prenom, usernameDonne) {
    let baseUsername = normalizeString(usernameDonne).replace('-', '_');
    let usernameSuggereNomPrenom = normalizeString(prenom + nom).replace('-', '_');
    let usernameSuggereUsername = baseUsername;
    let suffixe = 5;

    // Vérifier si l'utilisateur existe déjà avec le nom d'utilisateur généré à partir du nom et prénom
    // Si oui, ajouter un suffixe numérique pour rendre le nom d'utilisateur unique
    async function checkAndGenerateUniqueUsernameNomPrenom() {
        const utilisateurExistant = await Utilisateur.findOne({ username: usernameSuggereNomPrenom });
        if (utilisateurExistant) {
            suffixe+= 5;
            usernameSuggereNomPrenom = (usernameSuggereNomPrenom + suffixe);
            return checkAndGenerateUniqueUsernameNomPrenom();
        }
        return usernameSuggereNomPrenom;
    }

    // Vérifier si l'utilisateur existe déjà avec le nom d'utilisateur généré à partir du username
    // Si oui, ajouter un suffixe numérique pour rendre le nom d'utilisateur unique
    async function checkAndGenerateUniqueUsernameUsername() {
        const utilisateurExistant = await Utilisateur.findOne({ username: usernameSuggereUsername });
        if (utilisateurExistant) {
            suffixe+= 5;
            usernameSuggereUsername = baseUsername + suffixe;
            return checkAndGenerateUniqueUsernameUsername();
        }
        return usernameSuggereUsername;
    }

    // Appeler les fonctions de vérification et de génération de noms d'utilisateur
    return Promise.all([checkAndGenerateUniqueUsernameNomPrenom(), checkAndGenerateUniqueUsernameUsername()]);
}



// Obtenir un utilisateur par son ID
async function getUtilisateurParId(userId) {
    try {
        return await Utilisateur.findById(userId);
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche de l'utilisateur par ID :", err);
        throw err;
    }
}

// Obtenir un utilisateur par son nom d'utilisateur
async function getUtilisateurParUsername(username) {
    try {
        return await Utilisateur.findOne({ username });
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche de l'utilisateur par nom d'utilisateur :", err);
        throw err;
    }
}

// Authentifier un utilisateur par son email et mot de passe
async function authentifierUtilisateur(email, password) {
    try {
        const user = await Utilisateur.findOne({ email, password })
        if (user) user.password = 'Nothing to see here.';
        return user;
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'authentification de l'utilisateur :", err);
        throw err;
    }
}

// Obtenir un utilisateur par son adresse e-mail
async function getUtilisateurParEmail(email) {
    try {
        return await Utilisateur.findOne({ email });
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche de l'utilisateur par adresse e-mail :", err);
        throw err;
    }
}

// Exporter les fonctions du service utilisateur
module.exports = {
    creerUtilisateur,
    getUtilisateurParId,
    getUtilisateurParUsername,
    authentifierUtilisateur,
    getUtilisateurParEmail, // Ajout de la fonction getUtilisateurParEmail
    genererUsernameSuggere,
    // ... Autres fonctions pour gérer les utilisateurs
};