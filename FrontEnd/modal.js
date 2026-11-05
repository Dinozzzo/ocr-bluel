const editButton = document.querySelector(".edit-button");
const dialog = document.querySelector(".modal");

if (editButton) {
  editButton.addEventListener("click", (event) => {
    dialog.showModal();
  });
}

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
