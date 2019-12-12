// Utilitaires pour manipuler des fichiers
var fs = require("fs");

var readFile = function (path) {
    return fs.readFileSync(path).toString();
};

var writeFile = function (path, texte) {
    fs.writeFileSync(path, texte);
};


//une fonction pour enlever les mots pareils
var motsPareil = function(mots) {
    //creer un nouveau tableau avec premier element "chaine vide"
    var dic = [""];
    //pour chaque mots dans le tableau "mots"
    for (var i=0; i < mots.length; i++) {
        //s'il existe pas le mot pareil dans le nouveau tableau
        if(dic.indexOf(mots[i]) == -1) {
            //ajouter ce mots dans le taleau "dic"
            dic.push(mots[i]);
        }
    }
    return dic;
};

/*une fonction pour trouver les mots prochaine possibles pour chaque mots dans
 le "dictionnaire" qui est "dic" dans cette fonction*/
var prochainMots = function(phrase,dic) {
    //creer un nouveau tableau avec longueur de dic et remplir avec"[]"
    var prochainMots = Array(dic.length).fill([]);
    //pour chaque element du tableau "phrase"
    phrase.forEach(function(x) {
        x = x.split(" ");//separer chaque phrase en mots
        /*le premier element du tableau "prochainMots" sont le premier mots
         de chaque phrase*/
        prochainMots[0] = prochainMots[0].concat(x[0]);

    });
    //pour l'index de chaque element de "dic"
    for (var n = 1; n < dic.length; n++) {
        //pour chaque phrase
        for (var i = 0; i < phrase.length;i++) {
            //separer chaque phrase a un tableau des mots
            var phr = phrase[i].split(" ");
            var ind = phr.indexOf(dic[n]);
            //si le mots dans "dic" existe dans le phrase et n'est pas le fin
            if(ind != -1 && ind+1 < phr.length) {
                /*ajouter le prochain mots a l'element de tableau 
                "prochainMots"*/
                prochainMots[n]= prochainMots[n].concat(phr[ind+1]);
            }
        }
    }
    return prochainMots;
};


/*une fonction pour calculer les probabilites des chaque mot prochain et 
les mettres dans le format désiré.
L'enter est le tableau qui contient les mots prochains trouvés*/
var probaMots = function(prochMots) {
    var prochMotsdifTot = [];
    var probMotsTot = [];
    //pour chaque element de "prochMots"
    for (var i = 0; i<prochMots.length; i++) {
        /*mettre un element qui contient les mots proch. possibles 
        comme un nouveau variable*/
        var proch = prochMots[i];
        //creer un tableau pour les mots proch. sans repetition
        var prochMotsdif = [];
        //creer un tableau pour les prob. de chaque mots different
        var probMots = [];
        for (var j = 0; j<proch.length; j++) {
            /*s'il n'y a pas encore le mots dans le "prochMotsdif"*/
            if (prochMotsdif.indexOf(proch[j])==-1) {
                //ajouter le mots dans "prochMotsdif"
                prochMotsdif.push(proch[j]);
                //ajouter le prob. du mots comme 1/(proch. mots total)
                probMots.push(1/proch.length);
            } else {//s'il existe deja le mot pareil
                //ajouter le prob +1/(proch. mots total)
                probMots[prochMotsdif.indexOf(proch[j])] += 1/proch.length;
            }
        }
        //ajouter les mots proch. differes dans le tab. en total
        prochMotsdifTot.push(prochMotsdif);
        //ajouter des prob. des mots proch. differes dans le tab. en total
        probMotsTot.push(probMots);
    }
    //creer un nouveau tab. en taille de "prochMotsdifTot" et remplir avec "[]"
    var prochainMotsPossibles = Array(prochMotsdifTot.length).fill([]);
    prochMotsdifTot.forEach(function(x,n) {
        x.forEach(function(y,i) {
            /*pour chaque element de "prochainMotsPossibles", ajouter un 
            enregistrement avec "mot:chaque mot dif. de chaque element du 
            "prochMotsdifTot"" et "prob: les prob. de chaque mot dif."*/
            prochainMotsPossibles[n]=prochainMotsPossibles[n]
                .concat({mot:y,prob:probMotsTot[n][i]});
        });
    });
    return prochainMotsPossibles;
};

var creerModele = function(path) {
    //lire le fichier pour obtenir le texte
    var texte = readFile(path);
    //enlever le saute des lignes pour obtenir les phrases
    var phrase = texte.split("\n");
    //enlever les saute des lignes et separer chaque mots
    var mots = texte.split("\n").join(" ").split(" ");
    //appeler la fonction "motsPareil" pour former le "dictionnaire"
    var dictionnaire = motsPareil(mots);
    //appeler la fonction "prochainMots" pour trouver les prochaines mots
    var prochMots = prochainMots(phrase,dictionnaire);
    /*appeler la fonction "probMots" pour trouver les prochaines mots et ses
     probabilites*/
    var prochainMotstab =  probaMots(prochMots);

    var modele = {
        dictionnaire:dictionnaire,
        prochaineMots:prochainMotstab};
    return modele;
};
console.log(creerModele("corpus/trivial"));
//une fonction pour trouver le prochain mots du mot actuel
var genererProchainMot = function(modele, motActuel) {
    //trouver l'index du mot actuel dans le dictionnaire
    var index = modele.dictionnaire.indexOf(motActuel);
    //trouver les mots prochains possibles et ses prob.
    var prochaineMotsPossibles = modele.prochaineMots[index];
    //s'il n'y pas de mots prochains
    if (prochaineMotsPossibles.length <= 1) {
        return -1;//retourner -1
    } else {
        var motsProchaine = prochaineMotsPossibles[0].mot;
        var motsProchaineProb = prochaineMotsPossibles[0].prob;
        for (var i = 1; i < prochaineMotsPossibles.length; i++) {
            //si le prob. est plus grand que le premier mot
            if (prochaineMotsPossibles[i].prob > motsProchaineProb)
                //mettre le mots plus possible a "motsProchaine"
                motsProchaine = prochaineMotsPossibles[i].mot;
            //s'ils ont les prob. pareils
            else if (prochaineMotsPossibles[i].prob == motsProchaineProb)
                //prendre le mot au hasard
                motsProchaine = prochaineMotsPossibles
                    [Math.round(Math.random()*1)].mot;
    }
    return motsProchaine;
};

console.log(creerModele(exemple));

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
    //console.log('TODO : exécuter des tests');
};



if (require.main === module) {
    // Si on se trouve ici, alors le fichier est exécuté via : nodejs markov.js
    tests(); // On lance les tests
} else {
    /* Sinon, le fichier est inclus depuis index.js
       On exporte les fonctions importantes pour le serveur web */
    exports.creerModele = creerModele;
    exports.genererParagraphes = genererParagraphes;
}};
