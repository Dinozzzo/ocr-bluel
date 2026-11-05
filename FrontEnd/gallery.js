// VARIABLES GLOBALES
let works = []; // Tous les travaux récupérés depuis l'API (rempli par fetchWorks)
const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

// RÉCUPÈRE LES TRAVAUX DEPUIS L'API PUIS LES AFFICHE
async function fetchWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();

  displayWorks(works);
}

// AFFICHE DANS LA GALERIE LA LISTE DE TRAVAUX REÇUE EN PARAMÈTRE
function displayWorks(worksList) {
  // Vide la galerie pour ne pas cumuler les anciens travaux
  gallery.innerHTML = "";

  worksList.forEach((work) => {
    // Crée la structure de chaque figure
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.innerText = work.title;

    // Assemble la figure, puis l'ajoute à la galerie
    figure.append(img, figcaption);
    gallery.appendChild(figure);
  });
}

// DÉPLACE LA CLASSE "filters-selected" SUR LE BOUTON CLIQUÉ
function selectButton(button) {
  const filtersSelected = document.querySelector(".filters-selected");
  filtersSelected.classList.remove("filters-selected");
  button.classList.add("filters-selected");
}

// RÉCUPÈRE LES CATÉGORIES DEPUIS L'API ET CRÉE LE MENU DE FILTRES
async function createCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();

  // Conteneur du menu de filtres
  const nav = document.createElement("nav");
  nav.classList.add("filters-nav");

  // Bouton "Tous" : sélectionné par défaut, réaffiche tous les travaux
  const tousButton = document.createElement("button");
  tousButton.classList.add("filters-button", "filters-selected");
  tousButton.innerText = "Tous";

  tousButton.addEventListener("click", () => {
    selectButton(tousButton);
    displayWorks(works);
  });

  nav.append(tousButton);

  // Un bouton par catégorie de l'API
  categories.forEach((category) => {
    const filtersButton = document.createElement("button");
    filtersButton.classList.add("filters-button");
    filtersButton.innerText = category.name;

    // Au clic : n'affiche que les travaux de cette catégorie
    filtersButton.addEventListener("click", () => {
      selectButton(filtersButton);

      const filteredWorks = works.filter((work) => work.categoryId === category.id);

      displayWorks(filteredWorks);
    });

    nav.append(filtersButton);
  });

  // Insère le menu juste avant la galerie, dans la section #portfolio
  portfolio.insertBefore(nav, gallery);
}

// LANCEMENT
fetchWorks();

// Filtres affichés seulement si l'utilisateur n'est pas connecté (pas de token)
if (!window.localStorage.getItem("token")) {
  createCategories();
}
