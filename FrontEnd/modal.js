// ==================== VARIABLES GLOBALES ====================

// Modale
const editButton = document.querySelector(".edit-button"); // editButton vaut null si l'utilisateur n'est pas connecté
const dialog = document.querySelector(".modal");
const closeButton = document.querySelector(".modal-close");

// Vue 1 : galerie
const galleryView = document.querySelector(".modal-view-gallery");
const modalGallery = document.querySelector(".modal-gallery");
const galleryViewAddPhoto = document.querySelector(".modal-button");

// Vue 2 : ajout photo
const addView = document.querySelector(".modal-view-add");
const addViewBack = document.querySelector(".modal-back");

// Formulaire d'ajout
const modalForm = document.querySelector(".add-form");
const imgInput = document.querySelector(".upload-input");
const titleInput = document.getElementById("add-title");
const categorySelect = document.getElementById("add-category");
const modalFormError = document.querySelector(".add-error");
const submitButton = document.querySelector(".modal-send");
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 Mo en octets

// Zone d'upload
const uploadIcon = document.querySelector(".upload-icon");
const uploadPreview = document.querySelector(".upload-preview");
const uploadActions = document.querySelector(".upload-actions");
const uploadRemove = document.querySelector(".upload-remove");
const uploadLabel = document.querySelector(".upload-label");
const uploadInfo = document.querySelector(".upload-info");

// ==================== FONCTIONS ====================

// AFFICHE LES MINIATURES DANS LA MODALE
function displayModalWorks() {
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

// SUPPRIME UN TRAVAIL (API + affichage)
async function deleteWork(workId) {
  try {
    // Envoie la demande de suppression au serveur avec le token
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Le serveur a refusé : on s'arrête
    if (!response.ok) {
      console.error(`Une erreur ${response.status} est survenue.`);
      return;
    }

    // Retire le travail du tableau puis met à jour les deux galeries
    works = works.filter((work) => work.id !== workId);
    displayWorks(works);
    displayModalWorks();
  } catch (error) {
    // Problème réseau (serveur injoignable)
    console.error(`Erreur ${error} : Le serveur est injoignable`);
  }
}

// AJOUTE UN TRAVAIL (API + affichage)
async function sendWorkToApi() {
  try {
    // Prépare les données au format attendu par l'API (multipart/form-data)
    const formData = new FormData();
    formData.append("image", imgInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    // Envoie le nouveau travail au serveur avec le token
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    // Le serveur a refusé : on s'arrête
    if (!response.ok) {
      modalFormError.textContent = "L'ajout a échoué. Veuillez vous reconnecter puis réessayer.";
      console.error(`Une erreur ${response.status} est survenue.`);
      return;
    }

    // Ajoute le travail renvoyé par l'API puis met à jour les deux galeries
    const newWork = await response.json();
    works.push(newWork);
    displayWorks(works);
    displayModalWorks();

    // Ferme la modale (le formulaire est remis à zéro par l'événement "close")
    dialog.close();
  } catch (error) {
    // Problème réseau (serveur injoignable)
    modalFormError.textContent = "Impossible de contacter le serveur. Veuillez réessayer plus tard.";
    console.error(`Erreur ${error} : Le serveur est injoignable`);
  }
}

// REMPLIT LE SELECT DES CATÉGORIES DU FORMULAIRE D'AJOUT DEPUIS L'API
async function fillCategorySelect() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  // Option vide sélectionnée par défaut (oblige l'utilisateur à choisir)
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "";
  categorySelect.appendChild(defaultOption);

  // Une option par catégorie : le texte affiché est le nom, la valeur envoyée est l'id
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.textContent = category.name;
    option.value = category.id;

    categorySelect.appendChild(option);
  });
}

// REMET LA ZONE D'UPLOAD À SON ÉTAT DE DÉPART (sans image)
function resetUpload() {
  imgInput.value = ""; // Vide le fichier choisi
  uploadPreview.src = "";
  uploadPreview.hidden = true;
  uploadActions.hidden = true;

  // Réaffiche le contenu par défaut de la zone
  uploadIcon.style.display = "";
  uploadLabel.hidden = false;
  uploadInfo.hidden = false;

  // Vide le message d'erreur
  modalFormError.textContent = "";

  // Met à jour la couleur du bouton (grisé si le formulaire est incomplet)
  submitButton.classList.toggle("add-submit-active", isFormValid());
}

// VÉRIFIE QUE LES 3 CHAMPS SONT REMPLIS (image, titre, catégorie)
function isFormValid() {
  if (imgInput.files.length >= 1 && titleInput.value.trim() !== "" && categorySelect.value !== "") {
    return true;
  }

  return false;
}

// ==================== OUVERTURE / FERMETURE ====================

// OUVERTURE DE LA MODALE (bouton "modifier") : toujours sur la vue galerie
if (editButton) {
  editButton.addEventListener("click", () => {
    galleryView.hidden = false;
    addView.hidden = true;
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

// REMET LE FORMULAIRE À ZÉRO À CHAQUE FERMETURE (croix, fond sombre, Échap ou après un ajout)
dialog.addEventListener("close", () => {
  modalForm.reset(); // Vide les champs
  resetUpload(); // Vide la zone d'upload, le message d'erreur et grise le bouton
});

// ==================== CHANGEMENT DE VUE ====================

// "Ajouter une photo" : passe à la vue ajout
galleryViewAddPhoto.addEventListener("click", () => {
  galleryView.hidden = true;
  addView.hidden = false;
});

// Flèche retour : revient à la vue galerie
addViewBack.addEventListener("click", () => {
  galleryView.hidden = false;
  addView.hidden = true;
});

// ==================== FORMULAIRE D'AJOUT ====================

// APERÇU DE L'IMAGE CHOISIE
imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];

  // Aucun fichier (sélecteur annulé) : on revient à la zone vide
  if (!file) {
    resetUpload();
    return;
  }

  // Fichier trop lourd (plus de 4 Mo) : on le refuse et on prévient l'utilisateur
  if (file.size > MAX_FILE_SIZE) {
    resetUpload(); // Vide le champ (efface aussi le message, donc on l'écrit après)
    modalFormError.textContent = "L'image ne doit pas dépasser 4 Mo.";
    return;
  }

  // Crée une adresse temporaire pour afficher le fichier dans l'aperçu
  uploadPreview.src = URL.createObjectURL(file);
  uploadPreview.hidden = false;
  uploadActions.hidden = false;

  // Cache le contenu par défaut de la zone (style.display pour l'icône : Font Awesome écrase hidden)
  uploadIcon.style.display = "none";
  uploadLabel.hidden = true;
  uploadInfo.hidden = true;
});

// RETIRE L'IMAGE CHOISIE (croix sur l'aperçu)
uploadRemove.addEventListener("click", resetUpload);

// ACTIVE LE BOUTON À CHAQUE SAISIE SI LE FORMULAIRE EST COMPLET
modalForm.addEventListener("input", () => {
  submitButton.classList.toggle("add-submit-active", isFormValid());

  // Formulaire complet : on efface le message d'erreur
  if (isFormValid()) {
    modalFormError.textContent = "";
  }
});

// ENVOI DU FORMULAIRE : vérifie les champs puis envoie à l'API
modalForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  if (!isFormValid()) {
    modalFormError.textContent = "Veuillez remplir tous les champs.";
    return; // Formulaire incomplet : on n'envoie rien
  }

  sendWorkToApi();
});

// ==================== LANCEMENT ====================

fillCategorySelect();
