const activiteService = require('../services/activite.service');

// Fonction pour insérer une nouvelle activité
const insertActivite = async (request, response) => {
    try {
        const { nom, description, imagecouverture, icon, couleurbackground } = request.body;
        const nouvelleActivite = await activiteService.insertActivite(nom, description, imagecouverture, icon, couleurbackground);
        response.status(201).json({ success: true, data: nouvelleActivite, message: "Activité insérée avec succès" });
    } catch (err) {
        response.status(500).json({ success: false, data: null, message: "Une erreur s'est produite lors de l'insertion de l'activité" });
    }
};

// Fonction pour modifier une activité existante
const modifyActivite = async (request, response) => {
    try {
        const { activiteId } = request.params;
        const { nom, description, imagecouverture, icon, couleurbackground } = request.body;
        const activiteModifiee = await activiteService.modifyActivite(activiteId, nom, description, imagecouverture, icon, couleurbackground);
        response.status(200).json({ success: true, data: activiteModifiee, message: "Activité modifiée avec succès" });
    } catch (err) {
        response.status(500).json({ success: false, data: null, message: err.message || "Une erreur s'est produite lors de la modification de l'activité" });
    }
};

// Fonction pour supprimer une activité
const deleteActivite = async (request, response) => {
    try {
        const { activiteId } = request.params;
        const activiteSupprimee = await activiteService.deleteActivite(activiteId);
        response.status(200).json({ success: true, data: activiteSupprimee, message: "Activité supprimée avec succès" });
    } catch (err) {
        response.status(500).json({ success: false, data: null, message: "Une erreur s'est produite lors de la suppression de l'activité" });
    }
};

// Fonction pour obtenir la liste des activités
const getActivites = async (request, response) => {
    try {
        const { word } = request.query;
        const activites = await activiteService.getActivites(word || '');
        response.status(200).json({ success: true, data: activites, message: "Liste des activités récupérée avec succès" });
    } catch (err) {
        response.status(500).json({ success: false, data: null, message: "Une erreur s'est produite lors de la récupération des activités" });
    }
};

// Fonction pour obtenir une activité par son ID
const getOneActivite = async (request, response) => {
    try {
        const { activiteId } = request.params;
        const activite = await activiteService.getOneActivite(activiteId);
        if (activite) {
            response.status(200).json({ success: true, data: activite, message: "Activité récupérée avec succès" });
        } else {
            response.status(404).json({ success: false, data: null, message: "Activité non trouvée" });
        }
    } catch (err) {
        response.status(500).json({ success: false, data: null, message: "Une erreur s'est produite lors de la récupération de l'activité" });
    }
};

// Fonction pour obtenir les activités pour un province donné (en utilisant son ID)
const getProvinceActivite = async (request, response) => {
    try {
        const { provinceId } = request.params;
        const activites = await activiteService.getProvinceActivite(provinceId);
        response.status(200).json({ success: true, data: activites, message: "Liste des activités du province récupérée avec succès" });
    } catch (err) {
        response.status(500).json({ success: false, data: null, message: "Une erreur s'est produite lors de la récupération des activités du province" });
    }
};

// Fonction pour obtenir les activités supprimées (corbeille) des 30 derniers jours
const getActiviteCorbeille = async (request, response) => {
    try {
        const activitesSupprimees = await activiteService.getActiviteCorbeille();
        return response.status(200).json({ success: true, data: activitesSupprimees
        , message: "Liste des activités supprimées récupérée avec succès" });
    } catch (err) {
        response.status(500).json({ success: false, data: null, message: "Une erreur s'est produite lors de la récupération des activités supprimées" });
    }
};

// Fonction pour restaurer une activité supprimée
const restaurerActivite = async (request, response) => {
    try {
        const { activiteId } = request.params;
        const activiteRestauree = await activiteService.restaurerActivite(activiteId);
        if (activiteRestauree) {
            response.status(200).json({ success: true, data: activiteRestauree, message: "Activité restaurée avec succès" });
        } else {
            response.status(404).json({ success: false, data: null, message: "Impossible de restaurer l'activité" });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, data: null, message: "Une erreur s'est produite lors de la restauration de l'activité" });
    }
};

// Exporter les fonctions du contrôleur activite
module.exports = {
    insertActivite,
    modifyActivite,
    deleteActivite,
    getActivites,
    getOneActivite,
    getProvinceActivite,
    getActiviteCorbeille,
    restaurerActivite,
};
