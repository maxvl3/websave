document.addEventListener("DOMContentLoaded", function () {
  const newProjectBtn = document.getElementById("newProjectBtn");
  const projectPopup = document.getElementById("projectPopup");
  const cancelBtn = document.getElementById("cancelBtn");

  newProjectBtn.addEventListener("click", function () {
    projectPopup.style.display = "block";

    const projectInput = document.getElementById("titel");
    projectInput.setAttribute("autocomplete", "off");
  });

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault();
    projectPopup.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const newFileBtn = document.getElementById("newFileBtn");
  const zipUploadPopup = document.getElementById("zipUploadPopup");
  const cancelbutton = document.getElementById("cancelbutton");

  newFileBtn.addEventListener("click", function () {
    zipUploadPopup.style.display = "block";

    const projectdescripton = document.getElementById("description");
    projectdescripton.setAttribute("autocomplete", "off");
  });

  cancelbutton.addEventListener("click", function (e) {
    e.preventDefault();
    zipUploadPopup.style.display = "none";
  });
});

function filterResults(searchTerm) {
  const items = document.querySelectorAll(".searchable-item");

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    const isVisible = text.includes(searchTerm.toLowerCase());
    item.style.display = isVisible ? "flex" : "none";
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.trim();
  filterResults(searchTerm);
});
