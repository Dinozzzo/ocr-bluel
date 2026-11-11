// ==================== VARIABLES GLOBALES ====================

const header = document.querySelector("header");

// Token stocké à la connexion (null si l'utilisateur n'est pas connecté), utilisé aussi par gallery.js et modal.js
const token = window.localStorage.getItem("token");

// ==================== MODE ÉDITION ====================

// UTILISATEUR CONNECTÉ : AFFICHE LE MODE ÉDITION ET PASSE LE LIEN "login" EN "logout"
if (token) {
  const navLogin = document.getElementById("nav-login");
  navLogin.textContent = "logout";

  // Bandeau noir "Mode édition" inséré tout en haut de la page, avant le header
  const editorHeader = document.createElement("div");
  editorHeader.classList.add("editor-header");

  // Icône crayon Font Awesome (les classes suffisent, la feuille Font Awesome est chargée dans index.html)
  const editorIcon = document.createElement("i");
  editorIcon.classList.add("fa-regular", "fa-pen-to-square");

  editorHeader.append(editorIcon, "Mode édition");
  document.body.insertBefore(editorHeader, header);

  // Bouton "modifier" ajouté à droite du titre "Mes Projets" (ouvre la modale, voir modal.js)
  const portfolioHeader = document.querySelector(".portfolio-header");
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");

  editButton.append(editIcon, "modifier");
  portfolioHeader.appendChild(editButton);

  // ==================== DÉCONNEXION ====================

  // CLIC SUR "logout" : supprime le token puis recharge l'accueil en mode visiteur
  navLogin.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le lien de suivre son href (login.html)
    window.localStorage.removeItem("token");
    window.location.reload();
  });
}
