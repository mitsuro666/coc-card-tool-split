function initApp() {
  initModal();
  initInfoNotes();
  initNotes();
  initPreview();
  initProfile();
  initAttributes();
  initSkills();
  initBackgroundItems();
  initImages();
  initRouter();
  initStorage();
  initDataTransfer();

  restore();
  initDetailsState();
  document.querySelectorAll("[data-skill-filter]").forEach((button) => button.classList.toggle("active", button.dataset.skillFilter === currentSkillFilter));
  renderRollHistory();

  updatePreview({ force: true });
  updateAttributeCalculations();
  updateAssetCalculations();
  openPage(currentPage);
}

initApp();
