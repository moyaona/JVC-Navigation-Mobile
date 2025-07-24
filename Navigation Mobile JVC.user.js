// ==UserScript==
// @name         Navigation Mobile JVC
// @version      1.1
// @description  Ajoute deux bulles de navigation pour répondre aux topics et retourner à la liste des sujets.
// @author       moyaona
// @downloadURL https://github.com/moyaona/Navigation-Mobile-JVC/raw/refs/heads/main/Navigation%20Mobile%20JVC.user.js
// @updateURL https://github.com/moyaona/Navigation-Mobile-JVC/raw/refs/heads/main/Navigation%20Mobile%20JVC.user.js
// @match        https://www.jeuxvideo.com/forums/42-*
// @grant        GM_addStyle
// @icon  https://image.noelshack.com/fichiers/2025/30/3/1753234120-logo-nav-mobile-jvc.png
// ==/UserScript==

(function() {
    'use strict';

    // --- Définition des styles CSS pour les bulles ---
    // On utilise GM_addStyle pour injecter le CSS proprement dans la page.
    GM_addStyle(`
        #jvc-nav-bubbles-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column-reverse; /* Met la bulle "retour" en bas */
        }

         .jvc-nav-bubble {
            width: 50px;
            height: 50px;
            background-color: #054c98; /* bleu foncé */
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            margin-top: 15px; /* Espace entre les deux bulles */
            transition: transform 0.2s ease-in-out, background-color 0.2s;
        }

        .jvc-nav-bubble:hover {
            transform: scale(1.1);
        }

        .jvc-nav-bubble:active {
            transform: scale(0.95);
            background-color: #0b3e75 ; /* bleu un peu plus foncé au clic */
        }

        .jvc-nav-bubble svg {
            width: 28px;
            height: 28px;
            fill: #ffffff ; /* orange */
        }
    `);

    // --- Création des icônes SVG ---

    // Icône pour "Répondre" (une flèche de réponse)
    const replyIconSVG = `
        <svg viewBox="0 0 24 24">
            <path d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z" />
        </svg>
    `;

    // Icône pour "Liste des sujets" (une liste)
    const listIconSVG = `
        <svg viewBox="0 0 24 24">
            <path d="M3,13H11V11H3M3,6V8H21V6M3,18H11V16H3Z" />
        </svg>
    `;


    // --- Logique du script ---

    // 1. Extraire l'ID du forum depuis l'URL actuelle
    // L'URL d'un topic est /forums/42-ID_FORUM-ID_TOPIC...
    const urlMatch = window.location.pathname.match(/\/forums\/42-(\d+)-/);
    if (!urlMatch) return; // Ne rien faire si on n'est pas sur une page de topic valide

    const forumId = urlMatch[1];
    const listUrl = `https://www.jeuxvideo.com/forums/0-${forumId}-0-1-0-1-0-0.htm`;

    // 2. Créer les éléments HTML

    // Le conteneur principal pour les bulles
    const container = document.createElement('div');
    container.id = 'jvc-nav-bubbles-container';

    // Bulle "Répondre"
    const replyBubble = document.createElement('a');
    replyBubble.className = 'jvc-nav-bubble';
    replyBubble.title = 'Répondre au topic';
    // Le formulaire de réponse a l'id "bloc-formulaire-forum"
    replyBubble.href = '#bloc-formulaire-forum';
    replyBubble.innerHTML = replyIconSVG;
    // Ajout d'un petit scroll en douceur pour les navigateurs qui le supportent
    replyBubble.onclick = (e) => {
        const form = document.getElementById('bloc-formulaire-forum');
        if (form) {
            e.preventDefault();
            form.scrollIntoView({ behavior: 'smooth' });
            // On focus directement le textarea pour pouvoir écrire
            const textarea = form.querySelector('textarea');
            if(textarea) textarea.focus();
        }
    };


    // Bulle "Retour à la liste"
    const listBubble = document.createElement('a');
    listBubble.className = 'jvc-nav-bubble';
    listBubble.title = 'Retour à la liste des sujets';
    listBubble.href = listUrl;
    listBubble.innerHTML = listIconSVG;

    // 3. Ajouter les bulles à la page
    container.appendChild(listBubble); // Ajouté en premier, mais apparaît en bas grâce à flex-direction: column-reverse
    container.appendChild(replyBubble); // Ajouté en second, apparaît en haut

    document.body.appendChild(container);

})();
