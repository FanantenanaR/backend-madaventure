const express = require('express');
const router = express.Router();
const activiteController = require('../controllers/activite.controller');

// Route pour insérer une nouvelle activité
router.post('/', activiteController.insertActivite);

// Route pour mettre à jour une activité existante
router.put('/:activiteId', activiteController.modifyActivite);

// Route pour supprimer une activité
router.delete('/:activiteId', activiteController.deleteActivite);

// Route pour obtenir toutes les activités
router.get('/', activiteController.getActivites);

// Route pour obtenir une activité par son ID
router.get('/get/:activiteId', activiteController.getOneActivite);

// Route pour obtenir les activités liées à un province
router.get('/province/:provinceId', activiteController.getProvinceActivite);

// Route pour obtenir les activités supprimées (corbeille) des 30 derniers jours
router.get('/corbeille', activiteController.getActiviteCorbeille);

// Route pour restaurer une activité supprimée
router.put('/corbeille/:activiteId', activiteController.restaurerActivite);

// Exporter le routeur
module.exports = router;
