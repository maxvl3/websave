document.addEventListener("DOMContentLoaded", function () {
  const newProjectBtn = document.getElementById("newProjectBtn");
  const projectPopup = document.getElementById("projectPopup");
  const cancelBtn = document.getElementById("cancelBtn");

  newProjectBtn.addEventListener("click", function () {
    projectPopup.style.display = "block";

    // Voeg autocomplete="off" toe aan het inputveld in de projectpopup
    const projectInput = document.getElementById("titel");
    projectInput.setAttribute("autocomplete", "off");
  });

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault();
    projectPopup.style.display = "none";
  });
});
