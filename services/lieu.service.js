// services/lieu-service.js

const Lieu = require('../models/lieu.model');
const moment = require('moment');

// ...

// Insérer un lieu
async function insertLieu(nom, description, corpstextuel, imagecouverture, idutilisateur, idprovince, idactivites, images) {
    try {
        const lieu = new Lieu({
            nom,
            description,
            corpstextuel,
            imagecouverture,
            idutilisateur,
            province: idprovince,
            activites: idactivites,
            images,
        });
        return await lieu.save();
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'insertion du lieu :", err);
        throw err;
    }
}

// Rechercher des lieux
async function getLieu(nomLieu) {
    try {
        const regex = new RegExp(nomLieu, 'i'); // Expression régulière pour la recherche insensible à la casse
        const lieux = await Lieu.find({ nom: regex, isDeleted: false })
            .populate({
                path: 'activites',
                select: 'nom description imagecouverture icon couleurbackground',
            })
            .populate({
                path: 'province',
                select: 'nom emplacement imagecouverture couleur description',
            })

        return lieux;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche de lieux :", err);
        throw err;
    }
}

// Obtenir un lieu par son ID
async function getOneLieu(lieuId) {
    try {
        const lieu = await Lieu.findOne({ _id: lieuId, isDeleted: false })
            .populate({
                path: 'activites',
                select: 'nom description imagecouverture icon couleurbackground',
            })
            .populate({
                path: 'province',
                select: 'nom emplacement imagecouverture couleur description',
            })

        return lieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche d'un lieu :", err);
        throw err;
    }
}

// Modifier un lieu en fonction des champs spécifiés (non vides et non nuls)
async function modifierLieu(lieuId, updateFields) {
    try {
        // Vérifier si le lieu existe
        const lieu = await Lieu.findOne({ _id: lieuId, isDeleted: false });
        if (!lieu) {
            throw new Error("Le lieu spécifié n'a pas été trouvé.");
        }

        // Filtrer les champs à mettre à jour (éliminer les valeurs non définies, null ou vides)
        const filteredUpdateFields = {};
        for (const key in updateFields) {
            if (updateFields[key] !== undefined && updateFields[key] !== null && updateFields[key] !== '') {
                filteredUpdateFields[key] = updateFields[key];
            }
        }

        // Si aucun champ à mettre à jour n'est spécifié, retourner simplement le lieu tel quel
        if (Object.keys(filteredUpdateFields).length === 0) {
            return lieu;
        }

        // Mettre à jour le lieu avec les champs spécifiés (non vides et non nuls)
        const updatedLieu = await Lieu.findOneAndUpdate(
            { _id: lieuId, isDeleted: false },
            { $set: filteredUpdateFields },
            { new: true }
        );

        return updatedLieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la modification du lieu :", err);
        throw err;
    }
}

// Supprimer un lieu (définir isDeleted à true et mettre à jour la date de suppression)
async function deleteLieu(lieuId) {
    try {
        const dateSuppression = new Date(); // Date actuelle

        // Mettre à jour le lieu pour définir isDeleted à true et dateSuppression à la date actuelle
        return await Lieu.findOneAndUpdate(
            { _id: lieuId, isDeleted: false },
            { isDeleted: true, dateSuppression },
            { new: true }
        );
    } catch (err) {
        console.error("Une erreur s'est produite lors de la suppression du lieu :", err);
        throw err;
    }
}

// Obtenir les lieux supprimés (corbeille) des 30 derniers jours
async function getCorbeilleLieu() {
    try {
        const dateLimite = moment().subtract(30, 'days').toDate();
        const lieuxSupprimes = await Lieu.find({ isDeleted: true, dateSuppression: { $gte: dateLimite } })
            .populate({
                path: 'activites',
                select: 'nom description imagecouverture icon couleurbackground',
            })
            .populate({
                path: 'province',
                select: 'nom emplacement imagecouverture couleur description',
            });
        return lieuxSupprimes;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la récupération des lieux supprimés :", err);
        throw err;
    }
}

// Restaurer un lieu supprimé
async function restaurerLieu(lieuId) {
    try {
        const dateLimite = moment().subtract(30, 'days').toDate();
        const lieu = await Lieu.findOneAndUpdate(
            { _id: lieuId, isDeleted: true, dateSuppression: { $gte: dateLimite } },
            { isDeleted: false },
            { new: true }
        );

        if (!lieu) {
            throw new Error("Le lieu n'a pas été trouvé ou ne peut pas être restauré.");
        }

        return lieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la restauration du lieu :", err);
        throw err;
    }
}

// services/lieu-service.js

// ...

// Insérer une activité dans un lieu
async function insererActivite(lieuId, activiteId) {
    try {
        const lieu = await Lieu.findOneAndUpdate(
            { _id: lieuId, isDeleted: false, activites: { $ne: activiteId } },
            { $push: { activites: activiteId } },
            { new: true }
        );
        return lieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'insertion de l'activité dans le lieu :", err);
        throw err;
    }
}

// Supprimer une activité d'un lieu
async function removeActivite(lieuId, activiteId) {
    try {
        const lieu = await Lieu.findOneAndUpdate(
            { _id: lieuId, isDeleted: false, activites: activiteId },
            { $pull: { activites: activiteId } },
            { new: true }
        );
        return lieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la suppression de l'activité du lieu :", err);
        throw err;
    }
}

// Insérer une image dans un lieu
async function insererImage(lieuId, image) {
    try {
        const lieu = await Lieu.findOneAndUpdate(
            { _id: lieuId, isDeleted: false, images: { $ne: image } },
            { $push: { images: image } },
            { new: true }
        );
        return lieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'insertion de l'image dans le lieu :", err);
        throw err;
    }
}

// Supprimer une image d'un lieu
async function removeImage(lieuId, image) {
    try {
        const lieu = await Lieu.findOneAndUpdate(
            { _id: lieuId, isDeleted: false, images: image },
            { $pull: { images: image } },
            { new: true }
        );
        return lieu;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la suppression de l'image du lieu :", err);
        throw err;
    }
}


// Obtenir la liste des lieux dans une province donnée avec toutes les informations sur les activités et la province
async function getLieuProvince(provinceId) {
    try {
        const lieux = await Lieu.find({ province: provinceId, isDeleted: false })
            .populate({
                path: 'activites',
                select: 'nom description imagecouverture icon couleurbackground',
            })
            .populate({
                path: 'province',
                select: 'nom nomFR emplacement imagecouverture couleur description',
            });
        return lieux;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des lieux dans une province :", err);
        throw err;
    }
}

// Obtenir la liste des lieux ayant une activité donnée avec toutes les informations sur les activités et la province
async function getLieuActivite(activiteId) {
    try {
        const lieux = await Lieu.find({ activites: activiteId, isDeleted: false })
            .populate({
                path: 'activites',
                select: 'nom description imagecouverture icon couleurbackground',
            })
            .populate({
                path: 'province',
                select: 'nom nomFR emplacement imagecouverture couleur description',
            });
        return lieux;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des lieux avec une activité donnée :", err);
        throw err;
    }
}

// Obtenir la liste des lieux publiés par un utilisateur donné avec toutes les informations sur les activités et la province
async function getLieuUtilisateur(userId) {
    try {
        const lieux = await Lieu.find({ idutilisateur: userId, isDeleted: false })
            .populate({
                path: 'activites',
                select: 'nom description imagecouverture icon couleurbackground',
            })
            .populate({
                path: 'province',
                select: 'nom nomFR emplacement imagecouverture couleur description',
            });
        return lieux;
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des lieux d'un utilisateur :", err);
        throw err;
    }
}

// Exporter les fonctions du service lieu
module.exports = {
    insertLieu,
    getLieu,
    getOneLieu,
    modifierLieu,
    deleteLieu,
    getCorbeilleLieu,
    restaurerLieu,
    insererActivite,
    removeActivite,
    insererImage,
    removeImage,
    getLieuProvince,
    getLieuActivite,
    getLieuUtilisateur,
};