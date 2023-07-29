// services/activite-service.js

const Activite = require('../models/activite.model');
const Lieu = require('../models/lieu.model');

const moment = require('moment');

// Insérer une nouvelle activité
async function insertActivite(nom, description, imagecouverture, icon, couleurbackground) {
    try {
        // Vérifier si le champ "nom" est manquant ou vide
        if (!nom || nom.trim() === '') {
            throw new Error('Le nom de l\'activité est requis');
        }

        // Définir les valeurs par défaut pour les autres champs
        description = description || '';
        imagecouverture = imagecouverture || 'default';
        icon = icon || 'default';
        couleurbackground = couleurbackground || '#ecf0f1';

        const nouvelleActivite = new Activite({
            nom,
            description,
            imagecouverture,
            icon,
            couleurbackground,
        });

        const activite = await nouvelleActivite.save();
        return activite;
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'insertion d'une nouvelle activité :", err);
        throw err;
    }
}


// Modifier les détails d'une activité
async function modifyActivite(activiteId, nom, description, imagecouverture, icon, couleurbackground) {
    try {
        const activite = await Activite.findById(activiteId);

        if (!activite) {
            throw new Error("Activité non trouvée");
        }

        // Vérifier quels champs doivent être mis à jour
        if (nom) {
            activite.nom = nom;
        }
        if (description) {
            activite.description = description;
        }
        if (imagecouverture) {
            activite.imagecouverture = imagecouverture;
        }
        if (icon) {
            activite.icon = icon;
        }
        if (couleurbackground) {
            activite.couleurbackground = couleurbackground;
        }

        const activiteModifiee = await activite.save();
        return activiteModifiee;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la modification de l'activité :", err);
        throw err;
    }
}
// Supprimer une activité (définir isDeleted à true et mettre à jour la date de suppression)
async function deleteActivite(activiteId) {
    try {
        const dateSuppression = new Date(); // Date actuelle

        // Mettre à jour l'activité pour définir isDeleted à true et dateSuppression à la date actuelle
        return await Activite.findOneAndUpdate(
            {_id: activiteId, isDeleted: false },
            { isDeleted: true, dateSuppression },
            { new: true }
        );
    } catch (err) {
        console.error("Une erreur s'est produite lors de la suppression de l'activité :", err);
        throw err;
    }
}
// Obtenir la liste des activités contenant le mot spécifié dans le nom
async function getActivites(word = '') {
    try {
        const regex = new RegExp(word, 'i'); // i pour insensible à la casse

        const activites = await Activite.find({ nom: regex, isDeleted: false });

        // Ajouter l'attribut "nombreLieu" pour chaque activité
        const activitesAvecNombreLieu = await Promise.all(
            activites.map(async (activite) => {
                // Compter le nombre de lieux non supprimés qui ont cette activité
                const nombreLieu = await Lieu.countDocuments({ activites: activite._id, isDeleted: false });
                return { ...activite.toObject(), nombreLieu };
            })
        );

        return activitesAvecNombreLieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des activités :", err);
        throw err;
    }
}

// Obtenir une activité par son ID avec le nombre de lieux associés
async function getOneActivite(activiteId) {
    try {
        const activite = await Activite.findById(activiteId);

        if (!activite) {
            return null;
        }

        // Compter le nombre de lieux non supprimés qui ont cette activité
        const nombreLieu = await Lieu.countDocuments({ activites: activite._id, isDeleted: false });

        // Ajouter l'attribut "nombreLieu" à l'activité
        const activiteAvecNombreLieu = { ...activite.toObject(), nombreLieu };

        return activiteAvecNombreLieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche de l'activité par ID :", err);
        throw err;
    }
}

// Obtenir les activités pour un province donné (en utilisant son ID)
async function getProvinceActivite(provinceId) {
    try {
        // Rechercher les lieux non supprimés liés à la province spécifiée
        const lieux = await Lieu.find({ province: provinceId, isDeleted: false });

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

        // Retourner les activités complètes non supprimées en utilisant la fonction populate() de Mongoose
        const activitesCompletes = await Activite.find({ _id: { $in: activitesArray }, isDeleted: false });

        return activitesCompletes;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des activités pour le province :", err);
        throw err;
    }
}


// Obtenir les activités supprimées (corbeille) des 30 derniers jours
async function getActiviteCorbeille() {
    try {
        // Calculer la date limite pour les activités supprimées (30 jours avant la date actuelle)
        const dateLimite = moment().subtract(30, 'days').toDate();

        // Rechercher les activités supprimées (isDeleted: true) des 30 derniers jours
        const activitesSupprimees = await Activite.find({ isDeleted: true, dateSuppression: { $gte: dateLimite } });

        return activitesSupprimees;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la récupération des activités supprimées :", err);
        throw err;
    }
}

// Restaurer une activité supprimée
async function restaurerActivite(activiteId) {
    try {
        // Calculer la date limite pour les activités supprimées (30 jours avant la date actuelle)
        const dateLimite = moment().subtract(30, 'days').toDate();

        // Rechercher l'activité par son ID avec la date de suppression inférieure ou égale à la date limite
        const activite = await Activite.findOneAndUpdate(
            { _id: activiteId, isDeleted: true, dateSuppression: { $gte: dateLimite } },
            { isDeleted: false },
            { new: true }
        );

        return activite;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la restauration de l'activité :", err);
        throw err;
    }
}


// Exporter les fonctions du service activite
module.exports = {
    insertActivite,
    modifyActivite,
    deleteActivite,
    getActivites,
    getOneActivite,
    getProvinceActivite,
    getActiviteCorbeille,
    restaurerActivite, // Ajout de la fonction restaurerActivite au module.exports
};