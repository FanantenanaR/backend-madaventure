// controllers/province-controller.js

// Importer le service de province
const provinceService = require('../services/province.service');

// Fonction utilitaire pour formater la réponse
const sendResponse = (response, status, success, data, message) => {
    response.status(status).json({
        success,
        data,
        message,
    });
};
// Controller pour obtenir toutes les provinces avec les détails des lieux pour chaque province
const getProvinces = async (request, response) => {
    try {
        const { word } = request.query;
        const provinces = await provinceService.getProvinces(word ? word : '');
        sendResponse(response, 200, true, { data: provinces}, "Liste des provinces obtenue avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la récupération des provinces :", err);
        sendResponse(response, 500, false, null, "Une erreur s'est produite lors de la récupération des provinces.");
    }
};

// Controller pour obtenir les détails d'une province par son ID
const getProvinceById = async (request, response) => {
    const provinceId = request.params.id;
    try {
        const province = await provinceService.getOneProvince(provinceId);
        if (!province) {
            return sendResponse(response, 404, false, null, "Province non trouvée.");
        }
        sendResponse(response, 200, true, { data: province}, "Détails de la province obtenus avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la récupération de la province par ID :", err);
        sendResponse(response, 500, false, null, "Une erreur s'est produite lors de la récupération de la province.");
    }
};
// Controller pour modifier le contenu d'une province par son ID
const modifyContenuProvince = async (request, response) => {
    const provinceId = request.params.id;
    const { imagecouverture, couleur, description } = request.body;


    try {
        // Appeler la fonction correspondante du service pour effectuer la modification
        const updatedProvince = await provinceService.modifyContenuProvince(provinceId, description, imagecouverture, couleur);
        if (!updatedProvince) {
            return sendResponse(response, 404, false, null, "Province non trouvée.");
        }
        sendResponse(response, 200, true, { data: updatedProvince}, "Contenu de la province modifié avec succès.");
    } catch (err) {
        console.error("Une erreur s'est produite lors de la modification du contenu de la province :", err);
        sendResponse(response, 500, false, null, "Une erreur s'est produite lors de la modification de la province.");
    }
};
// ... Autres fonctions pour gérer les provinces

// Exporter les fonctions du contrôleur
module.exports = {
    getProvinces,
    getProvinceById,
    modifyContenuProvince,
    // ... Autres fonctions pour gérer les provinces
};
