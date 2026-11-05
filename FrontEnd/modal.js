// VARIABLES GLOBALES
// null si l'utilisateur n'est pas connecté (le bouton est créé par authentificator.js)
const editButton = document.querySelector(".edit-button");
const dialog = document.querySelector(".modal");
const closeButton = document.querySelector(".modal-close");

// SUPPRIME LE TRAVAIL AU CLIC SUR LE BOUTON CORBEILLE

async function deleteWork(workId) {
  const token = window.localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // À FAIRE : vérifier response.ok, puis mettre à jour works + les deux galeries
  } catch (error) {
    // À FAIRE : erreur réseau (serveur éteint, pas de connexion…)
  }
}

// AFFICHE LES TRAVAUX DANS LA MODALE
function displayModalWorks() {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  works.forEach((work) => {
    // Crée la structure de chaque figure
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Bouton corbeille (fond noir géré par la classe .modal-delete dans style.css)
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("modal-delete");
    // Le bouton ne contient qu'une icône : aria-label donne un nom lisible aux lecteurs d'écran
    deleteButton.setAttribute("aria-label", `Supprimer ${work.title}`);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");

    deleteButton.appendChild(deleteIcon);
    figure.append(img, deleteButton);
    modalGallery.appendChild(figure);
  });
}

// OUVERTURE : au clic sur "modifier", affiche le dialog en modale (avec le fond sombre)
if (editButton) {
  editButton.addEventListener("click", () => {
    displayModalWorks();
    dialog.showModal();
  });
}

// FERMETURE AU CLIC SUR LA CROIX
closeButton.addEventListener("click", () => {
  dialog.close();
});

// FERMETURE AU CLIC EN DEHORS DE LA MODALE
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
