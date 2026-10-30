const gallery = document.querySelector(".gallery");

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
