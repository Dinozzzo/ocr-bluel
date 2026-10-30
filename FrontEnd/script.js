const gallery = document.querySelector(".gallery");
const figure = document.createElement("figure");
const img = document.createElement("img");
const figcaption = document.createElement("figcaption");

gallery.appendChild(figure);
figure.appendChild(img, figcaption);

async function displayWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  console.log(works);

  img.src = works[0].imageUrl;
}

displayWorks();
