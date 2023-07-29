function normalizeString(str) {

    // Changement en minuscule
    str = str.toLowerCase();

    // Supprimer les caractères spéciaux et les accents
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Remplacer les espaces par des tirets
    str = str.replace(/\s+/g, '-');
    
    // Supprimer tous les caractères non alphabétiques et non numériques
    str = str.replace(/[^a-zA-Z0-9-]/g, '');

    str = str.replace(/-+/g, '-');
        
    return str;
}

function checkEmailFormat(email) {
    // Expression régulière pour vérifier le format de l'e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Vérifier si l'e-mail correspond au format valide
    return emailRegex.test(email);
}


module.exports = {
    normalizeString,
    checkEmailFormat
}