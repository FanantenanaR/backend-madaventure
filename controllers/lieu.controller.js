// controllers/lieu.controller.js

const LieuService = require('../services/lieu.service');

// Fonction utilitaire pour formater la réponse
const sendResponse = (response, status, success, data, message) => {
    response.status(status).json({
        success,
        data,
        message,
    });
};

// Fonction pour insérer un lieu
const insererLieu = async (req, res) => {
    const { nom, description, corpstextuel, imagecouverture, idutilisateur, idprovince, idactivites, images } = req.body;

    try {
        // Vérification si le champ "nom" est manquant, vide, null ou undefined
        if (!nom) {
            return sendResponse(res, 400, false, null, 'Le champ "nom" est obligatoire.');
        }

        // Si les champs optionnels (description, corpstextuel, imagecouverture, images) sont manquants, undefined ou null, on les met à vide ou à leur valeur par défaut
        const lieu = await LieuService.insertLieu(
            nom,
            description || '',
            corpstextuel || '',
            imagecouverture || 'default',
            idutilisateur,
            idprovince,
            idactivites,
            images || []
        );

        return sendResponse(res, 201, true, { lieu }, 'Le lieu a été créé avec succès.');
    } catch (err) {
        return sendResponse(res, 500, false, null, 'Une erreur s\'est produite lors de la création du lieu.');
    }
};

// Fonction pour rechercher des lieux
const rechercherLieux = async (req, res) => {
    const { nomLieu } = req.query;

    try {
        const lieux = await LieuService.getLieu(nomLieu || '');
        return sendResponse(res, 200, true, { lieux }, 'Liste des lieux trouvés.');
    } catch (err) {
        return sendResponse(res, 500, false, null, 'Une erreur s\'est produite lors de la recherche des lieux.');
    }
};

// Fonction pour obtenir un lieu par son ID
const getOneLieu = async (req, res) => {
    const { lieuId } = req.params;

    try {
        const lieu = await LieuService.getOneLieu(lieuId);
        if (!lieu) {
            return sendResponse(res, 404, false, null, 'Le lieu spécifié n\'a pas été trouvé.');
        }

        return sendResponse(res, 200, true, { lieu }, 'Lieu trouvé.');
    } catch (err) {
        return sendResponse(res, 500, false, null, 'Une erreur s\'est produite lors de la recherche du lieu.');
    }
};


// Fonction pour modifier un lieu (nom, description, corps textuel, image de couverture)
const modifierLieu = async (req, res) => {
    const { lieuId } = req.params;
    const { nouveauNom, nouvelleDescription, nouveauCorpsTextuel, nouvelleImageCouverture } = req.body;

    try {
        const lieu = await LieuService.getOneLieu(lieuId);
        if (!lieu) {
            return res.status(404).json({
                success: false,
                message: 'Le lieu spécifié n\'a pas été trouvé.',
            });
        }

        // Créer un objet contenant les champs à mettre à jour
        const updateFields = {};
        if (nouveauNom) updateFields.nom = nouveauNom;
        if (nouvelleDescription) updateFields.description = nouvelleDescription;
        if (nouveauCorpsTextuel) updateFields.corpstextuel = nouveauCorpsTextuel;
        if (nouvelleImageCouverture) updateFields.imagecouverture = nouvelleImageCouverture;

        // Mettre à jour le lieu avec les champs spécifiés (non vides et non nuls)
        const updatedLieu = await LieuService.modifierLieu(lieuId, updateFields);

        return res.status(200).json({
            success: true,
            data: { lieu: updatedLieu },
            message: 'Le lieu a été modifié avec succès.',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Une erreur s\'est produite lors de la modification du lieu.',
        });
    }
};

// Fonction pour supprimer un lieu
const supprimerLieu = async (req, res) => {
    const { lieuId } = req.params;

    try {
        const lieu = await LieuService.deleteLieu(lieuId);
        if (!lieu) {
            return sendResponse(res, 404, false, null, 'Le lieu spécifié n\'a pas été trouvé ou ne peut pas être supprimé.');
        }

        return sendResponse(res, 200, true, { lieu }, 'Le lieu a été supprimé avec succès.');
    } catch (err) {
        return sendResponse(res, 500, false, null, 'Une erreur s\'est produite lors de la suppression du lieu.');
    }
};

// Fonction pour obtenir les lieux dans la corbeille (lieux supprimés) des 30 derniers jours
const getCorbeilleLieu = async (req, res) => {
    try {
        const lieuxSupprimes = await LieuService.getCorbeilleLieu();
        return sendResponse(res, 200, true, { lieux: lieuxSupprimes }, "Liste des lieux dans la corbeille récupérée avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des lieux dans la corbeille :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de la recherche des lieux dans la corbeille.");
    }
};

// Fonction pour restaurer un lieu supprimé (corbeille)
const restaurerLieu = async (req, res) => {
    const lieuId = req.params.lieuId;

    try {
        const lieuRestaure = await LieuService.restaurerLieu(lieuId);
        if (!lieuRestaure) {
            return sendResponse(res, 404, false, null, "Le lieu spécifié n'a pas été trouvé ou ne peut pas être restauré.");
        }
        return sendResponse(res, 200, true, { lieu: lieuRestaure }, "Le lieu a été restauré avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la restauration du lieu :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de la restauration du lieu.");
    }
};

// Fonction pour insérer une activité dans un lieu
const insererActivite = async (req, res) => {
    const lieuId = req.params.lieuId;
    const activiteId = req.body.activiteId;

    try {
        const lieuAvecActivite = await LieuService.insererActivite(lieuId, activiteId);
        if (!lieuAvecActivite) {
            return sendResponse(res, 404, false, null, "Le lieu spécifié n'a pas été trouvé ou l'activité existe déjà dans le lieu.");
        }
        return sendResponse(res, 200, true, { lieu: lieuAvecActivite }, "L'activité a été ajoutée au lieu avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'insertion de l'activité dans le lieu :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de l'insertion de l'activité dans le lieu.");
    }
};

// Fonction pour supprimer une activité d'un lieu
const removeActivite = async (req, res) => {
    const lieuId = req.params.lieuId;
    const activiteId = req.body.activiteId;

    try {
        const lieuSansActivite = await LieuService.removeActivite(lieuId, activiteId);
        if (!lieuSansActivite) {
            return sendResponse(res, 404, false, null, "Le lieu spécifié n'a pas été trouvé ou l'activité n'existe pas dans le lieu.");
        }
        return sendResponse(res, 200, true, { lieu: lieuSansActivite }, "L'activité a été supprimée du lieu avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la suppression de l'activité du lieu :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de la suppression de l'activité du lieu.");
    }
};

// Fonction pour insérer une image dans un lieu
const insererImage = async (req, res) => {
    const lieuId = req.params.lieuId;
    const image = req.body.image;

    try {
        const lieuAvecImage = await LieuService.insererImage(lieuId, image);
        if (!lieuAvecImage) {
            return sendResponse(res, 404, false, null, "Le lieu spécifié n'a pas été trouvé ou l'image existe déjà dans le lieu.");
        }
        return sendResponse(res, 200, true, { lieu: lieuAvecImage }, "L'image a été ajoutée au lieu avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'insertion de l'image dans le lieu :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de l'insertion de l'image dans le lieu.");
    }
};

// Fonction pour supprimer une image d'un lieu
const removeImage = async (req, res) => {
    const lieuId = req.params.lieuId;
    const image = req.body.image;

    try {
        const lieuSansImage = await LieuService.removeImage(lieuId, image);
        if (!lieuSansImage) {
            return sendResponse(res, 404, false, null, "Le lieu spécifié n'a pas été trouvé ou l'image n'existe pas dans le lieu.");
        }
        return sendResponse(res, 200, true, { lieu: lieuSansImage }, "L'image a été supprimée du lieu avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la suppression de l'image du lieu :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de la suppression de l'image du lieu.");
    }
};

// Fonction pour obtenir la liste des lieux dans une province donnée
const getLieuProvince = async (req, res) => {
    const { provinceId }= req.params;

    try {
        const lieuxProvince = await LieuService.getLieuProvince(provinceId);
        return sendResponse(res, 200, true, { lieux: lieuxProvince }, "Liste des lieux dans la province récupérée avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des lieux dans la province :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de la recherche des lieux dans la province.");
    }
};

// Fonction pour obtenir la liste des lieux ayant une activité donnée
const getLieuActivite = async (req, res) => {
    const { activiteId }= req.params;

    try {
        const lieuxActivite = await LieuService.getLieuActivite(activiteId);
        return sendResponse(res, 200, true, { lieux: lieuxActivite }, "Liste des lieux avec l'activité spécifiée récupérée avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des lieux avec l'activité spécifiée :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de la recherche des lieux avec l'activité spécifiée.");
    }
};

// Fonction pour obtenir la liste des lieux publiés par un utilisateur donné
const getLieuUtilisateur = async (req, res) => {
    const { utilisateurId }= req.params;

    try {
        const lieuxUtilisateur = await LieuService.getLieuUtilisateur(utilisateurId);
        return sendResponse(res, 200, true, { lieux: lieuxUtilisateur }, "Liste des lieux publiés par l'utilisateur récupérée avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la recherche des lieux publiés par l'utilisateur :", err);
        return sendResponse(res, 500, false, null, "Une erreur s'est produite lors de la recherche des lieux publiés par l'utilisateur.");
    }
};

// Exporter les fonctions du contrôleur lieu
module.exports = {
    insererLieu,
    modifierLieu,
    rechercherLieux,
    supprimerLieu,
    getOneLieu,
    // ... Autres fonctions CRUD
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