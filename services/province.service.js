// services/province-service.js

const Province = require('../models/province.model');
const Lieu = require('../models/lieu.model');

// Obtenir la liste des provinces contenant le mot spécifié dans le nom ou le nomFR
async function getProvinces(word = '') {
    try {
        const regex = new RegExp(word, 'i'); // i pour insensible à la casse
        const provinces = await Province.find({ $or: [{ nom: regex }, { nomFR: regex }] });

        // Ajouter l'attribut "nombreLieu" pour chaque province
        const provincesAvecNombreLieu = await Promise.all(
            provinces.map(async (province) => {
                const nombreLieu = await Lieu.countDocuments({ province: province._id, isDeleted: false });
                return { ...province.toObject(), nombreLieu };
            })
        );

        return provincesAvecNombreLieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des provinces :", err);
        throw err;
    }
}

// Obtenir un province par son ID
async function getOneProvince(provinceId) {
    try {
        const province = await Province.findById(provinceId);

        if (!province) {
            return null;
        }

        // Compter le nombre de lieux pour le province spécifié
        const nombreLieu = await Lieu.countDocuments({ province: province._id, isDeleted: false });

        // Ajouter l'attribut "nombreLieu" au province
        const provinceAvecNombreLieu = { ...province.toObject(), nombreLieu };

        return provinceAvecNombreLieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche du province par ID :", err);
        throw err;
    }
}
// Modifier les détails d'un province
async function modifyContenuProvince(provinceId, description, imagecouverture, couleur) {
    try {
        // Créer un objet pour stocker les champs que l'on souhaite mettre à jour
        const updatedFields = {};
        
        // Vérifier si les paramètres sont définis et les ajouter à l'objet
        if (description) {
            updatedFields.description = description;
        }
        if (imagecouverture) {
            updatedFields.imagecouverture = imagecouverture;
        }
        if (couleur) {
            updatedFields.couleur = couleur;
        }

        // Mettre à jour les champs spécifiés de la province
        return await Province.findByIdAndUpdate(provinceId, updatedFields, { new: true });
    } catch (err) {
        console.error("Une erreur s'est produite lors de la modification du contenu du province :", err);
        throw err;
    }
}

// Obtenir les activités pour un province donné (en utilisant son ID)
async function getProvinceActivite(provinceId) {
    try {
        // Rechercher les lieux liés à la province spécifiée
        const lieux = await Lieu.find({ province: provinceId });

        // Créer un tableau pour stocker toutes les activités uniques trouvées dans les lieux
        const activites = new Set();

        // Parcourir tous les lieux et ajouter les activités uniques dans le tableau
        lieux.forEach((lieu) => {
            lieu.activites.forEach((activiteId) => {
                activites.add(activiteId);
            });
        });

        // Convertir le Set d'ID d'activités en un tableau
        const activitesArray = Array.from(activites);

        // Retourner les activités complètes en utilisant la fonction populate() de Mongoose
        const activitesCompletes = await Lieu.populate(activitesArray, { path: 'activites', model: 'Activite' });

        return activitesCompletes;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des activités pour le province :", err);
        throw err;
    }
}

// ... Autres fonctions pour gérer les provinces

// Exporter les fonctions du service province
module.exports = {
    getProvinces,
    getOneProvince,
    modifyContenuProvince,
    getProvinceActivite,
    // ... Autres fonctions pour gérer les provinces
};
