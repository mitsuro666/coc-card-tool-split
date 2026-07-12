function renderStepNav() {
  const nav = $("progressPill");
  if (!nav) return;
  nav.innerHTML = stepDefinitions.map((step, index) => {
    const isActive = step.page === currentPage;
    const isUnlocked = index <= maxUnlockedStep;
    const classes = ["step-link", isActive ? "active" : "", isUnlocked ? "is-unlocked" : "is-locked"]
      .filter(Boolean)
      .join(" ");
    return `
      <button class="${classes}" type="button" data-step-page="${step.page}" ${isUnlocked ? "" : "disabled"} ${isActive ? "aria-current=\"step\"" : ""}>
        <span class="step-number">${index + 1}</span><span class="step-name">${escapeHTML(step.label)}</span>
      </button>
    `;
  }).join("");
}

function validateProfileStep() {
  const missing = [];
  if (!$('investigatorName').value.trim()) missing.push('姓名');
  if (!$('age').value.trim()) missing.push('年龄');
  if (!$('occupation').value.trim()) missing.push('职业');
  if (missing.length) {
    showStatus('saveStatus', `未填写${missing.join('、')}`, true);
    openPage('profile', { skipValidation: true });
    return false;
  }
  return true;
}

function validateAttributeStep() {
  const missing = attributes
    .filter((attribute) => parseAttributeValue(attribute.id) === null)
    .map((attribute) => attribute.name);
  if (missing.length) {
    showStatus('attributeStatus', `未填写${missing.join('、')}`, true);
    openPage('attributes', { skipValidation: true });
    return false;
  }
  return true;
}

function validateSkillStep() {
  updateSkillCalculations();
  const limits = getSkillPointLimitState();
  if (limits.careerOver || limits.interestOver) {
    const types = [];
    if (limits.careerOver) types.push('职业');
    if (limits.interestOver) types.push('兴趣');
    showStatus('skillStatus', `使用的${types.join('、')}总点数超过上限，请调整`, true);
    openPage('skills', { skipValidation: true });
    return false;
  }
  return true;
}

function validateBeforePage(page) {
  const targetIndex = getStepIndex(page);
  if (targetIndex > getStepIndex('profile') && !validateProfileStep()) return false;
  if (targetIndex > getStepIndex('attributes') && !validateAttributeStep()) return false;
  if (targetIndex > getStepIndex('skills') && !validateSkillStep()) return false;
  return true;
}
function setVisiblePage(page) {
  $("profilePage").hidden = page !== "profile";
  $("attributePage").hidden = page !== "attributes";
  $("skillPage").hidden = page !== "skills";
  $("itemsPage").hidden = page !== "items";
  $("imagePage").hidden = page !== "images";
  $("finalPage").hidden = page !== "final";
}


function updateFloatingActions() {
  if (!previewToggle || !floatingPreview) return;
  const isFinalPage = currentPage === "final";
  previewToggle.hidden = isFinalPage;
  if (isFinalPage) floatingPreview.classList.remove("show");
}
function openPage(page, options = {}) {
  const requestedIndex = getStepIndex(page);
  const safePage = requestedIndex >= 0 ? page : "profile";
  const stepIndex = Math.max(0, getStepIndex(safePage));

  if (stepIndex > maxUnlockedStep && !options.unlock) {
    renderStepNav();
    return;
  }

  if (!options.skipValidation && stepIndex > getStepIndex(currentPage) && !validateBeforePage(safePage)) {
    renderStepNav();
    return;
  }

  if (options.unlock) {
    maxUnlockedStep = Math.max(maxUnlockedStep, stepIndex);
  }

  currentPage = safePage;
  setVisiblePage(currentPage);
  $("pageTitle").textContent = "COC车卡工具";
  renderStepNav();
  updateFloatingActions();

  markPreviewDirty("all");
  if (currentPage === "attributes") updateAttributeCalculations();
  if (currentPage === "skills") {
    renderSkillList();
    updateSkillCalculations();
  }
  if (currentPage === "items") {
    renderInventoryLists();
    updateAssetCalculations();
  }
  if (currentPage === "images") renderImagePage();
  if (currentPage === "final") renderFinalSummary();

  persist(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initRouter() {
  renderStepNav();

  $("progressPill").addEventListener("click", (event) => {
    const button = event.target.closest("[data-step-page]");
    if (!button || button.disabled) return;
    openPage(button.dataset.stepPage);
  });

  $("nextBtn").addEventListener("click", () => {
    if (!validateProfileStep()) return;
    openPage("attributes", { unlock: true });
  });

  $("backToProfile").addEventListener("click", () => openPage("profile"));

  $("nextAttributesBtn").addEventListener("click", () => {
    if (!validateAttributeStep()) return;
    openPage("skills", { unlock: true });
  });

  $("backToAttributes").addEventListener("click", () => openPage("attributes"));
  $("nextSkillsBtn").addEventListener("click", () => {
    if (!validateSkillStep()) return;
    openPage("items", { unlock: true });
  });
  $("backToSkills").addEventListener("click", () => openPage("skills"));
  $("nextItemsBtn").addEventListener("click", () => openPage("images", { unlock: true }));
  $("backToItems").addEventListener("click", () => openPage("items"));
  $("skipImagesBtn").addEventListener("click", () => openPage("final", { unlock: true }));
  $("nextImagesBtn").addEventListener("click", () => openPage("final", { unlock: true }));
  const backFinalToImages = $("backFinalToImages");
  if (backFinalToImages) backFinalToImages.addEventListener("click", () => openPage("images"));
  $("backFinalToImagesBottom").addEventListener("click", () => openPage("images"));
}
