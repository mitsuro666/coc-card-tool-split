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
    const missing = [];
    if (!$("investigatorName").value.trim()) missing.push("姓名");
    if (!$("age").value.trim()) missing.push("年龄");
    if (!$("occupation").value.trim()) missing.push("职业");

    if (missing.length) {
      showStatus("saveStatus", `未填写${missing.join("、")}`, true);
      return;
    }

    openPage("attributes", { unlock: true });
  });

  $("backToProfile").addEventListener("click", () => openPage("profile"));

  $("nextAttributesBtn").addEventListener("click", () => {
    const missing = attributes
      .filter((attribute) => !$(attribute.id).value.trim())
      .map((attribute) => attribute.name);

    if (missing.length) {
      showStatus("attributeStatus", `还缺：${missing.join("、")}。`, true);
      return;
    }

    openPage("skills", { unlock: true });
  });

  $("backToAttributes").addEventListener("click", () => openPage("attributes"));
  $("nextSkillsBtn").addEventListener("click", () => openPage("items", { unlock: true }));
  $("backToSkills").addEventListener("click", () => openPage("skills"));
  $("nextItemsBtn").addEventListener("click", () => openPage("images", { unlock: true }));
  $("backToItems").addEventListener("click", () => openPage("items"));
  $("skipImagesBtn").addEventListener("click", () => openPage("final", { unlock: true }));
  $("nextImagesBtn").addEventListener("click", () => openPage("final", { unlock: true }));
  $("backFinalToImages").addEventListener("click", () => openPage("images"));
  $("backFinalToItems").addEventListener("click", () => openPage("items"));
}
