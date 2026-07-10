let saveTimer = null;

function collectData() {
  const profile = {};
  profileFields.forEach((id) => {
    const el = $(id);
    if (el) profile[id] = el.value;
  });

  const attributeData = {};
  attributeFieldIds.forEach((id) => {
    const el = $(id);
    if (el) attributeData[id] = el.value;
  });

  return {
    profile,
    attributes: attributeData,
    includeLuckInTotal: $("includeLuckInTotal").checked,
    ageAdjustmentState,
    rollHistoryData,
    skills: skillPointData,
    customSkills: customSkillData,
    creditRatingValue: creditRatingValue ? creditRatingValue.value : "",
    skillFilter: currentSkillFilter,
    skillSort: $("skillSort") ? $("skillSort").value : "priority",
    skillSearch: $("skillSearch") ? $("skillSearch").value : "",
    assets: collectFields(assetFieldIds),
    background: collectBackgroundData(),
    inventory: inventoryData,
    images: imageData,
    maxUnlockedStep,
    currentPage
  };
}

function writeStorage(silent = false) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(collectData()));
    if (!silent) {
      showStatus(currentStatusId(), "已自动保存：" + new Date().toLocaleTimeString());
    }
  } catch (error) {
    console.warn("save failed", error);
    if (!silent) {
      showStatus(currentStatusId(), "本地保存失败，可能是图片太大。请换小一点的图片。", true);
    }
  }
}

function persist(silent = false) {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveTimer = null;
    writeStorage(silent);
  }, 300);
}

function flushPersist(silent = true) {
  if (saveTimer) {
    window.clearTimeout(saveTimer);
    saveTimer = null;
  }
  writeStorage(silent);
}

function restore() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.profile || data.attributes) {
      Object.entries(data.profile || {}).forEach(([id, value]) => {
        const el = $(id);
        if (el !== null) el.value = value;
      });
      Object.entries(data.attributes || {}).forEach(([id, value]) => {
        const el = $(id);
        if (el !== null) el.value = value;
      });
      $("includeLuckInTotal").checked = Boolean(data.includeLuckInTotal);
      ageAdjustmentState = data.ageAdjustmentState && typeof data.ageAdjustmentState === "object"
        ? { applied: Boolean(data.ageAdjustmentState.applied), age: String(data.ageAdjustmentState.age || ""), adjustments: data.ageAdjustmentState.adjustments || {}, movePenalty: Number(data.ageAdjustmentState.movePenalty || 0), messages: Array.isArray(data.ageAdjustmentState.messages) ? data.ageAdjustmentState.messages : [] }
        : { applied: false, age: "", adjustments: {}, movePenalty: 0, messages: [] };
      rollHistoryData = Array.isArray(data.rollHistoryData) ? data.rollHistoryData.slice(0, 5) : [];
      skillPointData = data.skills && typeof data.skills === "object" ? data.skills : {};
      customSkillData = Array.isArray(data.customSkills) ? data.customSkills.map(normalizeCustomSkill).filter(Boolean) : [];
      if (creditRatingValue && data.creditRatingValue !== undefined) creditRatingValue.value = data.creditRatingValue;
      const savedSkillFilter = data.skillFilter === "specialized" || data.skillFilter === "occupation" || data.skillFilter === "common" ? "all" : (data.skillFilter || "all");
      currentSkillFilter = ["all", "added", "unadded"].includes(savedSkillFilter) ? savedSkillFilter : "all";
      if ($("skillSort") && data.skillSort) {
        const savedSort = data.skillSort === "common" ? "priority" : (data.skillSort === "added" ? "added-first" : data.skillSort);
        $("skillSort").value = savedSort;
      }
      if ($("skillSearch") && data.skillSearch) $("skillSearch").value = data.skillSearch;
      restoreFields(data.assets || {});
      restoreBackgroundData(data.background || {});
      inventoryData = {
        weapons: Array.isArray(data.inventory && data.inventory.weapons) ? data.inventory.weapons.map((item) => normalizeInventoryItem(item, "weapons")) : [],
        others: Array.isArray(data.inventory && data.inventory.others) ? data.inventory.others.map((item) => normalizeInventoryItem(item, "others")) : []
      };
      imageData = normalizeImageData(data.images || data.imageData || {});
      currentPage = stepDefinitions.some((step) => step.page === data.currentPage) ? data.currentPage : "profile";
    } else {
      profileFields.forEach((id) => {
        const el = $(id);
        if (el && data[id] !== undefined) el.value = data[id];
      });
    }

    const restoredStepIndex = Math.max(0, getStepIndex(currentPage));
    const savedUnlockedStep = Number(data.maxUnlockedStep);
    maxUnlockedStep = Number.isFinite(savedUnlockedStep)
      ? Math.max(restoredStepIndex, Math.min(stepDefinitions.length - 1, Math.max(0, savedUnlockedStep)))
      : restoredStepIndex;

    if (currentPage === "items") renderInventoryLists();
    renderImagePage();
    updateAssetCalculations();

    if (era && customEra) {
      const savedEra = era.value === "自定义" ? customEra.value.trim() : era.value.trim();
      const fixedEra = Array.from(era.options).some((option) => option.value === savedEra && savedEra !== "自定义");
      if (savedEra && fixedEra) {
        era.value = savedEra;
        era.hidden = false;
        customEra.classList.remove("show");
      } else if (savedEra) {
        era.value = "自定义";
        era.hidden = false;
        customEra.value = savedEra === "自定义" ? "" : savedEra;
        customEra.classList.add("show");
      }
    }
    if ($("storyLocationChoice") && $("storyLocation")) {
      const locationValue = $("storyLocation").value.trim();
      const fixedLocation = Array.from($("storyLocationChoice").options).some((option) => option.value === locationValue && locationValue !== "自定义");
      if (locationValue && fixedLocation) {
        $("storyLocationChoice").value = locationValue;
        $("storyLocationChoice").hidden = false;
        $("storyLocation").classList.remove("show");
      } else if (locationValue) {
        $("storyLocationChoice").value = "自定义";
        $("storyLocationChoice").hidden = false;
        $("storyLocation").value = locationValue === "自定义" ? "" : locationValue;
        $("storyLocation").classList.add("show");
      }
    }
    if (typeof findExactProfession === "function" && occupation && occupationIdInput) {
      const exactOccupation = findExactProfession(occupation.value);
      if (exactOccupation) {
        occupationIdInput.value = String(exactOccupation.occupationId ?? "");
      } else if (occupation.value.trim()) {
        occupationIdInput.value = "";
      }
    }
    const restoredOccupation = findSelectedOccupation();
    if (restoredOccupation) {
      const hintText = [
        restoredOccupation.creditRange ? "信用评级：" + restoredOccupation.creditRange : "",
        restoredOccupation.attributeFormulaText ? "职业属性：" + restoredOccupation.attributeFormulaText : "",
        restoredOccupation.occupationSkillsText ? "本职技能：" + truncateText(restoredOccupation.occupationSkillsText) : ""
      ].filter(Boolean).join("　");
      setOccupationHint(hintText);
      if (occupationIdInput && !occupationIdInput.value) occupationIdInput.value = String(restoredOccupation.id);
      fillDefaultCreditRating(false);
    }
    markPreviewDirty("all");
  } catch (error) {
    console.warn("restore failed", error);
  }
}

function initStorage() {
  window.addEventListener("beforeunload", () => flushPersist(true));
}




