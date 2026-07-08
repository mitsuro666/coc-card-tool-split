let pendingProfessionMatch = null;

function setOccupationHint(text) {
  occupationHint.textContent = text || "";
  occupationHint.hidden = !text;
}

function findProfessionMatches(keyword) {
  const text = keyword.trim().toLowerCase();
  if (!text) return [];
  return professions.filter((p) => {
    return p.name.toLowerCase().includes(text) ||
      p.tags.some((tag) => tag.toLowerCase().includes(text));
  }).sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aStarts = aName.startsWith(text) ? 0 : 1;
    const bStarts = bName.startsWith(text) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    const aIndex = aName.indexOf(text);
    const bIndex = bName.indexOf(text);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.name.localeCompare(b.name, "zh-CN");
  });
}
function findExactProfession(keyword) {
  const text = keyword.trim().toLowerCase();
  if (!text) return null;
  return professions.find((p) => p.name.toLowerCase() === text) || null;
}

function updateOccupationValidity() {
  const keyword = occupation.value.trim();
  const exact = findExactProfession(keyword);
  if (!keyword) {
    if (occupationIdInput) occupationIdInput.value = "";
    setOccupationHint("");
    return null;
  }
  if (exact) {
    if (occupationIdInput) occupationIdInput.value = String(exact.occupationId ?? "");
    setOccupationHint(exact.meta);
    fillDefaultCreditRating(false);
    return exact;
  }
  if (occupationIdInput) occupationIdInput.value = "";
  setOccupationHint("没有精准匹配职业，请添加自定义职业。");
  return null;
}

function autoMatchProfession() {
  const keyword = occupation.value.trim();
  if (!keyword) {
    showStatus("saveStatus", "请先输入职业名。", true);
    return;
  }

  const exact = findExactProfession(keyword);

  if (exact) {
    applyProfession(exact);
    showStatus("saveStatus", "已匹配职业：" + exact.name);
    return;
  }

  const matches = findProfessionMatches(keyword);
  if (!matches.length) {
    showStatus("saveStatus", "没有匹配到职业，可使用自定义职业。", true);
    return;
  }

  pendingProfessionMatch = matches[0];
  $("matchName").textContent = pendingProfessionMatch.name;
  $("matchMeta").textContent = pendingProfessionMatch.meta;
  openModal("matchModal");
}

function applyProfession(profession) {
  occupation.value = profession.name;
  if (occupationIdInput) occupationIdInput.value = profession.occupationId !== undefined ? String(profession.occupationId) : "";
  setOccupationHint(profession.meta);
  professionResults.classList.remove("show");
  fillDefaultCreditRating(true);
  markPreviewDirty("basic");
  renderSkillList();
  updateSkillSummary();
  persist();
}

function positionProfessionResults() {
  if (!professionResults.classList.contains("show")) return;
  const rect = occupation.getBoundingClientRect();
  const margin = 8;
  const left = Math.max(12, rect.left);
  const width = Math.min(rect.width, window.innerWidth - left - 12);
  professionResults.style.left = `${left}px`;
  professionResults.style.top = `${rect.bottom + margin}px`;
  professionResults.style.width = `${width}px`;
  professionResults.style.maxHeight = `${Math.max(180, window.innerHeight - rect.bottom - 96)}px`;
}
function showProfessionMatches(keyword) {
  const text = keyword.trim().toLowerCase();
  if (!text) {
    professionResults.classList.remove("show");
    professionResults.innerHTML = "";
    setOccupationHint("");
    return;
  }

  const matches = findProfessionMatches(keyword);

  if (!matches.length) {
    professionResults.innerHTML = `<div class="profession-option"><div class="profession-name">没有匹配结果</div><div class="profession-meta">可以手动填写。</div></div>`;
    professionResults.classList.add("show");
    return;
  }

  professionResults.innerHTML = matches.map((p, idx) => `
    <div class="profession-option" data-index="${idx}">
      <div class="profession-name">${p.name}</div>
      <div class="profession-meta">${p.meta}</div>
    </div>
  `).join("");

  professionResults.classList.add("show");
}

function initProfile() {
  occupation.addEventListener("input", () => {
    if (creditRatingValue && !findExactProfession(occupation.value)) creditRatingValue.value = "";
    showProfessionMatches(occupation.value);
    updateOccupationValidity();
    markPreviewDirty("all");
    renderSkillList();
    updateSkillSummary();
    persist();
  });

  occupation.addEventListener("focus", () => {
    showProfessionMatches(occupation.value);
    updateOccupationValidity();
  });

  professionResults.addEventListener("click", (event) => {
    const option = event.target.closest(".profession-option[data-index]");
    if (!option) return;
    const matches = findProfessionMatches(occupation.value);
    const selected = matches[Number(option.dataset.index)];
    if (selected) applyProfession(selected);
  });

  window.addEventListener("resize", positionProfessionResults);
  window.addEventListener("scroll", positionProfessionResults, true);

  $("autoMatchOccupation").addEventListener("click", autoMatchProfession);

  $("confirmMatch").addEventListener("click", () => {
    if (pendingProfessionMatch) {
      applyProfession(pendingProfessionMatch);
      showStatus("saveStatus", "已匹配职业：" + pendingProfessionMatch.name);
    }
    closeModal("matchModal");
  });

  $("customOccupation").addEventListener("click", () => {
    $("customProfessionName").value = occupation.value.trim();
    openModal("customProfessionModal");
  });

  $("saveCustomProfession").addEventListener("click", () => {
    const name = $("customProfessionName").value.trim();
    if (!name) {
      showStatus("saveStatus", "请填写自定义职业名称。", true);
      return;
    }

    const credit = $("customCreditRange").value.trim();
    const formula = $("customSkillFormula").value.trim();
    const skills = $("customProfessionSkills").value.trim();

    occupation.value = name;
    if (occupationIdInput) occupationIdInput.value = "";
    if (creditRatingValue) creditRatingValue.value = parseCreditRangeMinimum(credit) ?? "";
    setOccupationHint([
      credit ? "信用评级：" + credit : "",
      formula ? "职业技能点规则：" + formula : "",
      skills ? "职业技能：" + skills : ""
    ].filter(Boolean).join("　") || "自定义职业");

    markPreviewDirty("all");
    updateSkillSummary();
    persist();
    closeModal("customProfessionModal");
    showStatus("saveStatus", "已保存自定义职业：" + name);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profession-wrap")) {
      professionResults.classList.remove("show");
    }
  });

  function syncChoiceSelect(selectEl, inputEl) {
    if (!selectEl || !inputEl) return;
    if (selectEl.value === "自定义") {
      inputEl.value = "";
      inputEl.classList.add("show");
      selectEl.hidden = false;
      inputEl.focus();
    } else {
      inputEl.value = selectEl.value;
      inputEl.classList.remove("show");
      selectEl.hidden = false;
    }
    markPreviewDirty("basic");
    updateAssetCalculations();
    persist();
  }

  function restoreChoiceSelect(selectEl, inputEl) {
    if (!selectEl || !inputEl) return;
    const saved = inputEl.value || selectEl.value;
    const hasOption = Array.from(selectEl.options).some((option) => option.value === saved);
    if (saved && hasOption && saved !== "自定义") {
      selectEl.value = saved;
      inputEl.classList.remove("show");
      selectEl.hidden = false;
    } else if (saved) {
      selectEl.value = "自定义";
      inputEl.value = saved === "自定义" ? "" : saved;
      inputEl.classList.add("show");
      selectEl.hidden = false;
    }
  }

  era.addEventListener("change", () => syncChoiceSelect(era, customEra));
  if (customEra) customEra.addEventListener("input", () => {
    markPreviewDirty("basic");
    updateAssetCalculations();
    persist();
  });
  if ($("storyLocationChoice") && $("storyLocation")) {
    $("storyLocationChoice").addEventListener("change", () => syncChoiceSelect($("storyLocationChoice"), $("storyLocation")));
    $("storyLocation").addEventListener("input", () => {
      markPreviewDirty("basic");
      persist();
    });
  }

  restoreChoiceSelect(era, customEra);
  restoreChoiceSelect($("storyLocationChoice"), $("storyLocation"));

  profileFields.forEach((id) => {
    const el = $(id);
    if (!el || id === "occupation") return;
    el.addEventListener("input", () => {
      if (id === "age" && ageAdjustmentState && ageAdjustmentState.age && el.value.trim() !== ageAdjustmentState.age) {
        if (ageAdjustmentState.applied) {
          const confirmed = confirm("已使用年龄补正，是否确认修改年龄？修改后，已适用的年龄补正将会全部失效。");
          if (!confirmed) {
            el.value = ageAdjustmentState.age || "";
            return;
          }
          if (typeof handleAgeChangedAfterAdjustment === "function") handleAgeChangedAfterAdjustment();
        } else if (typeof resetAgeAdjustmentState === "function") {
          resetAgeAdjustmentState();
        }
      }
      markPreviewDirty(id === "age" ? "secondary" : "basic");
      updateAssetCalculations();
      persist();
    });
  });

  $("resetProfileBtn").addEventListener("click", () => {
    if (!confirm("确定清空基础信息页的内容吗？备忘笔记也会一起清空。")) return;
    profileFields.forEach((id) => {
      const el = $(id);
      if (el) el.value = "";
    });
    if (customEra) {
      customEra.value = "";
      customEra.classList.remove("show");
      era.hidden = false;
    }
    if ($("storyLocationChoice") && $("storyLocation")) {
      $("storyLocationChoice").hidden = false;
      $("storyLocationChoice").value = "";
      $("storyLocation").classList.remove("show");
    }
    setOccupationHint("");
    renderSkillList();
    updateSkillSummary();
    markPreviewDirty("all");
    updateAssetCalculations();
    persist();
    showStatus("saveStatus", "已清空本页内容。");
  });
}




