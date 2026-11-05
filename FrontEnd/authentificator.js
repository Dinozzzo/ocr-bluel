const header = document.querySelector("header");

// RÉCUPÈRE LE TOKEN STOCKÉ À LA CONNEXION (null si l'utilisateur n'est pas connecté)
const token = window.localStorage.getItem("token");

// UTILISATEUR CONNECTÉ : PASSE LE LIEN "login" EN "logout"
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

  // Bouton "modifier" ajouté à droite du titre "Mes Projets"
  const portfolioHeader = document.querySelector(".portfolio-header");
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");

  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-regular", "fa-pen-to-square");

  editButton.append(editIcon, "modifier");
  portfolioHeader.appendChild(editButton);

  // Au clic : supprime le token pour se déconnecter, puis recharge l'accueil
  navLogin.addEventListener("click", (event) => {
    // Empêche le lien de suivre son href (login.html)
    event.preventDefault();
    window.localStorage.removeItem("token");
    window.location.reload();
  });
}
