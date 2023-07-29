const express = require('express');
const router = express.Router();

const lieuController = require('../controllers/lieu.controller');

// Routes pour les fonctions CRUD
router.post('/', lieuController.insererLieu);
router.get('/', lieuController.rechercherLieux);
router.get('/t/:lieuId', lieuController.getOneLieu);
router.put('/t/:lieuId', lieuController.modifierLieu);
router.delete('/t/:lieuId', lieuController.supprimerLieu);

// Routes pour les opérations supplémentaires
router.get('/get/corbeille', lieuController.getCorbeilleLieu);
router.put('/restaurer/:lieuId', lieuController.restaurerLieu);
router.put('/add/activite/:lieuId', lieuController.insererActivite);
router.delete('/del/activite/:lieuId', lieuController.removeActivite);
router.put('/add/image/:lieuId', lieuController.insererImage);
router.delete('/del/image/:lieuId', lieuController.removeImage);
router.get('/province/:provinceId', lieuController.getLieuProvince);
router.get('/activite/:activiteId', lieuController.getLieuActivite);
router.get('/utilisateur/:utilisateurId', lieuController.getLieuUtilisateur);

module.exports = router;
