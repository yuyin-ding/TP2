// Utilitaires pour manipuler des fichiers
var fs = require("fs");

var readFile = function (path) {
    return fs.readFileSync(path).toString();
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};





// TODO : compléter cette fonction
var creerModele = function(texte) {
    
};


// TODO : compléter cette fonction
var genererProchainMot = function(modele, motActuel) {

};

// TODO : compléter cette fonction
var genererPhrase = function(modele, maxNbMots) {
    
};

// TODO : compléter cette fonction
var genererParagraphes = function(modele, nbParagraphes, maxNbPhrases, maxNbMots) {
    
};




var tests = function() {
    // TODO : Écrivez des tests ici

    /* Les tests seront lancés automatiquement si vous appelez ce
    fichier avec :

       node markov.js

     */

    // Utilisez console.assert(a == b); pour faire des tests unitaires
    console.log('TODO : exécuter des tests');
};



if (require.main === module) {
    // Si on se trouve ici, alors le fichier est exécuté via : nodejs markov.js
    tests(); // On lance les tests
} else {
    /* Sinon, le fichier est inclus depuis index.js
       On exporte les fonctions importantes pour le serveur web */
    exports.creerModele = creerModele;
    exports.genererParagraphes = genererParagraphes;
}
