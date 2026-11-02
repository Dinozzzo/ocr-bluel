const gallery = document.querySelector(".gallery");
const portfolio = document.getElementById("portfolio");

// AFFICHE TOUS LES TRAVAUX
async function displayWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  console.log(works);

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.innerText = work.title;

    gallery.appendChild(figure);
    figure.append(img, figcaption);
  });
}

displayWorks();

// CRÉE LES 4 BUTTONS
const nav = document.createElement("nav");
nav.classList.add("filters-nav");

// AFFICHE OU ENLEVE LA SELECTION DU BUTTON
function selectButton(button) {
  const filtersSelected = document.querySelector(".filters-selected");
  filtersSelected.classList.remove("filters-selected");
  button.classList.add("filters-selected");
}

//
async function createCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  console.log(categories);

  // BUTTONS "TOUS"
  const allBtn = document.createElement("button");
  allBtn.classList.add("filters-button", "filters-selected");
  allBtn.innerText = "Tous";
  nav.append(allBtn);

  allBtn.addEventListener("click", () => {
    selectButton(allBtn);
  });

  // BUTTONS DE L'API
  categories.forEach((category) => {
    const filtersButton = document.createElement("button");
    filtersButton.classList.add("filters-button");
    filtersButton.innerText = category.name;
    nav.append(filtersButton);

    filtersButton.addEventListener("click", () => {
      selectButton(filtersButton);
    });
  });

  portfolio.insertBefore(nav, gallery);
}

createCategories();
