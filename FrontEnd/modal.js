// VARIABLES GLOBALES
// editButton vaut null si l'utilisateur n'est pas connecté
const editButton = document.querySelector(".edit-button");
const dialog = document.querySelector(".modal");
const closeButton = document.querySelector(".modal-close");

// SUPPRIME UN TRAVAIL (API + affichage)
async function deleteWork(workId) {
  const token = window.localStorage.getItem("token");

  try {
    // Envoie la demande de suppression au serveur avec le token
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Le serveur a refusé : on s'arrête
    if (!response.ok) {
      console.error(response.status);
      return;
    }

    // Retire le travail du tableau puis met à jour les deux galeries
    works = works.filter((work) => work.id !== workId);
    displayWorks(works);
    displayModalWorks();
  } catch (error) {
    // Problème réseau (serveur injoignable)
    console.error(`Une erreur est survenue : ${error}`);
  }
}

// AFFICHE LES MINIATURES DANS LA MODALE
function displayModalWorks() {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Évite les doublons

  works.forEach((work) => {
    // Image
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Bouton corbeille
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("modal-delete");
    deleteButton.setAttribute("aria-label", `Supprimer ${work.title}`);

    deleteButton.addEventListener("click", () => {
      deleteWork(work.id);
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");

    // Assemblage
    deleteButton.appendChild(deleteIcon);
    figure.append(img, deleteButton);
    modalGallery.appendChild(figure);
  });
}

// OUVERTURE DE LA MODALE (bouton "modifier")
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

// FERMETURE AU CLIC SUR LE FOND SOMBRE
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
