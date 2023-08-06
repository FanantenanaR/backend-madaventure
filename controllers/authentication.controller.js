// controllers/authentication-controller.js
const { checkEmailFormat, normalizeString } = require('../helper/normalizer.helper');
const utilisateurService = require('../services/utilisateur.service');

const login = (request, response) => {
    const { email, password } = request.body;

    // Appeler la fonction pour authentifier l'utilisateur
    utilisateurService.authentifierUtilisateur(email, password)
        .then((utilisateur) => {
            if (utilisateur) {
                // L'utilisateur est authentifié avec succès
                response.status(200).json({
                    success: true,
                    message: "Authentification réussie",
                    data: utilisateur,
                });
            } else {
                // L'utilisateur n'a pas pu être authentifié
                response.status(401).json({
                    success: false,
                    message: "Nom d'utilisateur ou mot de passe incorrect",
                });
            }
        })
        .catch((err) => {
            // Une erreur s'est produite lors de l'authentification
            console.log("error", err);
            response.status(500).json({
                success: false,
                message: "Une erreur s'est produite lors de l'authentification",
                reason: err
            });

        });
};

const inscription = (request, response) => {
    const { nom, prenom, datenaissance, username, email, password, profilepicture } = request.body;
    if (!prenom) {
        prenom = '';
    }
    
    
    // Vérifier si toutes les informations requises sont fournies
    if (!nom || !prenom || !datenaissance || !username || !email || !password) {
        return response.status(400).json({
            success: false,
            message: "Toutes les informations requises doivent être fournies.",
        });
    } 
    let finalusername = normalizeString(username);
    if (!checkEmailFormat(email)) {
        return response.status(400).json({
            success: false,
            message: "L'email donnée ne suit pas le format valide d'une adresse email."
        });
    }
    if (finalusername == '' || password == '') {
        return response.status(400).json({
            success: false,
            message: "Vous devez remplir les champs obligatoires.",
        });
    }

    // Vérifier si l'username est déjà pris
    utilisateurService.getUtilisateurParUsername(finalusername)
        .then((utilisateur) => {
            if (utilisateur) {
                // Générer un nom d'utilisateur alternatif suggéré
                utilisateurService.genererUsernameSuggere(nom, prenom, finalusername)
                    .then((usernameSuggere) => {
                        // Utiliser le nom d'utilisateur alternatif suggéré
                        // pour proposer une suggestion à l'utilisateur
                        return response.status(400).json({
                            success: false,
                            message: "Le nom d'utilisateur est déjà pris. Essayez `" + usernameSuggere.join('` ou `') + "` à la place.",
                        });
                    })
                    .catch((err) => {
                        
                        // En cas d'erreur lors de la génération du nom d'utilisateur alternatif
                        // renvoyer simplement le message d'erreur sans suggestion
                        console.log("error", err)
                        return response.status(500).json({
                            success: false,
                            message: "Une erreur s'est produite lors de la vérification du nom d'utilisateur.",
                            reason: err
                        });

                    });
            } else {

                // Vérifier si l'email est déjà pris
                utilisateurService.getUtilisateurParEmail(email)
                    .then((utilisateurByEmail) => {
                        if (utilisateurByEmail) {
                            return response.status(400).json({
                                success: false,
                                message: "L'adresse e-mail est déjà prise.",
                            });
                        }
    
                        // Si toutes les vérifications sont réussies, procéder à l'inscription
                        utilisateurService.creerUtilisateur(nom, prenom, datenaissance, finalusername, email, password, profilepicture)
                            .then((nouvelUtilisateur) => {
                                return response.status(201).json({
                                    success: true,
                                    message: "L'inscription a été effectuée avec succès.",
                                    data: {
                                        utilisateur: nouvelUtilisateur,
                                    }
                                });
                            })
                            .catch((err) => {
                                console.log("error", err)
                                return response.status(500).json({
                                    success: false,
                                    message: "Une erreur s'est produite lors de l'inscription.",
                                    reason: err
                                });
    
                            });
                    })
                    .catch((err) => {
                        console.log("error", err)
                        return response.status(500).json({
                            success: false,
                            message: "Une erreur s'est produite lors de la vérification de l'adresse e-mail.",
                            reason: err
                        });
    
                    });
            }

        })
        .catch((err) => {
            console.log("error", err)
            return response.status(500).json({
                success: false,
                message: "Une erreur s'est produite lors de la vérification du nom d'utilisateur.",
                reason: err
            });

        });
};
const checkUsername = (request, response) => {
    const { username } = request.params;

    // Appeler la fonction pour vérifier si le nom d'utilisateur est déjà pris
    utilisateurService.getUtilisateurParUsername(username)
        .then((utilisateur) => {
            if (utilisateur) {
                // Le nom d'utilisateur est déjà pris
                response.status(200).json({
                    success: true,
                    message: "Le nom d'utilisateur est déjà pris",
                });
            } else {
                // Le nom d'utilisateur est disponible
                response.status(200).json({
                    success: true,
                    message: "Le nom d'utilisateur est disponible",
                    data: null
                });
            }
        })
        .catch((err) => {
            // Une erreur s'est produite lors de la vérification du nom d'utilisateur
            console.log("error", err)
            response.status(500).json({
                success: false,
                message: "Une erreur s'est produite lors de la vérification du nom d'utilisateur",
                reason: err
            });

        });
};

const checkEmail = (request, response) => {
    const { email } = request.params;

    // Appeler la fonction pour vérifier si l'adresse e-mail est déjà utilisée
    utilisateurService.getUtilisateurParEmail(email)
        .then((utilisateur) => {
            if (utilisateur) {
                // L'adresse e-mail est déjà utilisée
                response.status(200).json({
                    success: true,
                    message: "L'adresse e-mail est déjà utilisée",
                });
            } else {
                // L'adresse e-mail est disponible
                response.status(200).json({
                    success: true,
                    message: "L'adresse e-mail est disponible",
                    data: null
                });
            }
        })
        .catch((err) => {
            // Une erreur s'est produite lors de la vérification de l'adresse e-mail
            console.log("error", err)
            response.status(500).json({
                success: false,
                message: "Une erreur s'est produite lors de la vérification de l'adresse e-mail",
                reason: err
            });

        });
};

module.exports = {
    login,
    inscription,
    checkUsername,
    checkEmail,
};
