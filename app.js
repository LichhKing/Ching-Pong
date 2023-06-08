var terrain;
var partie;

const HAUTEUR_JOUEUR = 50;
const LARGEUR_JOUEUR = 5;

//-----------Creation de notre fonction qui va dessiner le terrain de jeu-----------
function dessiner() {
    //Definition du contexte (2D)
    var context = terrain.getContext('2d');

    //Remplissage du terrain
    context.fillStyle = 'black';
    context.fillRect(0, 0, terrain.width, terrain.height);

    //Dessin de la ligne cetrale
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(terrain.width / 2, 0);
    context.lineTo(terrain.width / 2, terrain.height);
    context.stroke();

    // Dessin des joueurs
    context.fillStyle = 'white';
    context.fillRect(partie.joueur.x, partie.joueur.y, LARGEUR_JOUEUR, HAUTEUR_JOUEUR);
    context.fillRect(partie.adversaire.x, partie.adversaire.y, LARGEUR_JOUEUR, HAUTEUR_JOUEUR);

    // Dessin de la balle
    context.beginPath();
    context.fillStyle = 'white';
    //Methode arc : ctx.arc(x, y, rayon, angleDepart, angleFin, sensAntiHoraire);
    context.arc(partie.balle.x, partie.balle.y, partie.balle.rayon, 0, Math.PI * 2, false);
    context.fill();

}
//-----------Fin de la creation de notre fonction qui va dessiner le terrain de jeu-----------


//-----------Creation de notre fonction qui va gerer le deplacement de la balle-----------
function deplacementBalle() {
    // Rebonds en bas et en haut
    if (partie.balle.y > terrain.height || partie.balle.y < 0) {
        partie.balle.vitesse.y *= -1;
    }

    if (partie.balle.x > terrain.width - LARGEUR_JOUEUR) {
        collision(partie.adversaire);
    } else if (partie.balle.x < LARGEUR_JOUEUR) {
        collision(partie.joueur);
    }

    //Ajout d'une vitesse horizontale
    partie.balle.x += partie.balle.vitesse.x;
    //Ajout d'une vitesse verticale
    partie.balle.y += partie.balle.vitesse.y;
}
//-----------Fin de la creation de notre fonction qui va gerer le deplacement de la balle-----------

//-----------Creation de notre fonction qui va gerer les collisions-----------
function collision(joueur) {
    // Le joueur ne touche pas la balle
    if (partie.balle.y < joueur.y || partie.balle.y > joueur.y + HAUTEUR_JOUEUR) {
        // Réinitialiser la position de la balle et des joueurs au centre
        partie.balle.x = terrain.width / 2;
        partie.balle.y = terrain.height / 2;
        partie.joueur.y = terrain.height / 2 - HAUTEUR_JOUEUR / 2;
        partie.adversaire.y = terrain.height / 2 - HAUTEUR_JOUEUR / 2;

        // Ajouter la classe pour le flash de couleur <-- Ne fonctionne pas
        // var bordure = document.getElementById("bordure");
        // if (joueur == partie.joueur) {
        //     bordure.classList.add('flash-red');
        // } else {
        //     bordure.classList.add('flash-green');
        // }

        // setTimeout(function() {
        //     bordure.classList.remove('flash-green');
        //     bordure.classList.remove('flash-red');
        // }, 500);

        // Réinitialiser la vitesse de la balle
        partie.balle.vitesse.x = 2;
    } else {
        if (partie.balle.y <= joueur.y || partie.balle.y >= joueur.y + HAUTEUR_JOUEUR) {
            partie.balle.vitesse.y *= -1;
        }
        // Augmenter la vitesse et changer de direction de la balle
        partie.balle.vitesse.x *= -1.2;
    }
}
//-----------Fin de la creation de notre fonction qui va gerer les collisions-----------


//-----------Creation de notre fonction qui va gerer le jeu-----------
function play() {
    deplacementAdversaire();
    deplacementBalle();
    dessiner();
    requestAnimationFrame(play);
}
//-----------Fin de la creation de notre fonction qui va gerer le jeu-----------

//-----------Creation de la fonction qui gere le deplacement du joueur-----------
function deplacementJoueur(event) {
    // Calculer la position verticale de la souris par rapport au terrain
    var hauteurSouris = event.clientY - terrain.offsetTop;

    // Définir la position du joueur en fonction de la position de la souris
    partie.joueur.y = Math.max(0, Math.min(terrain.offsetHeight - HAUTEUR_JOUEUR, hauteurSouris - HAUTEUR_JOUEUR / 2));
}
//-----------Fin de la creation de la fonction qui gere le deplacement du joueur-----------

//-----------Creation de la fonction qui gere le deplacement de l'adversaire-----------
function deplacementAdversaire() {
    // Calculer la position verticale de la souris par rapport au terrain
    partie.adversaire.y += partie.balle.vitesse.y * partie.adversaire.speedRatio;
}
//-----------Fin de la creation de la fonction qui gere le deplacement de l'adversaire-----------

//Au chargement de la page on dessine le terrain et on lance la partie
document.addEventListener('DOMContentLoaded', function() {
    terrain = document.getElementById('terrain');
    //Creation d'un objet partie
    partie = {
        //Ajout d'une propriete joueur
        joueur: {
            //Ajout des proprietes de position
            y: terrain.height / 2 - HAUTEUR_JOUEUR / 2,
            x: LARGEUR_JOUEUR
        },
        adversaire: {
            //Ajout des proprietes de position
            y: terrain.height / 2 - HAUTEUR_JOUEUR / 2,
            x: terrain.width - LARGEUR_JOUEUR * 2,
            //Ajout d'une propriete de vitesse pour l'adversaire
            speedRatio: 0.70
        },
        balle: {
            //Ajout des proprietes de position
            y: terrain.height / 2,
            x: terrain.width / 2,
            rayon: 5,
            //Ajout desproprietes de vitesse
            vitesse: {
                x: 2,
                y: 2
            }
        }
    }

    //Appel de la methode qui dessine le canvas.
    dessiner();

    //appel de la methode qui gere le jeu
    play();

    // Mouse move event
    terrain.addEventListener('mousemove', deplacementJoueur);

});
