const express = require('express');
const router = express.Router();

// Importer le controller de province
const provinceController = require('../controllers/province.controller');

// Route pour obtenir la liste de toutes les provinces
router.get('/', provinceController.getProvinces);

// Route pour obtenir une province par son ID
router.get('/:id', provinceController.getProvinceById);

// Route pour modifier le contenu d'une province par son ID
router.put('/:id', provinceController.modifyContenuProvince);

// ... Autres routes pour les fonctionnalités liées aux provinces

module.exports = router;
