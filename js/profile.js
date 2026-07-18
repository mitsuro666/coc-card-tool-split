let pendingProfessionMatch = null;
let professionPickerOpen = false;

const customProfessionRuleAttrs = [
  { key: "STR", label: "力量" },
  { key: "CON", label: "体质" },
  { key: "SIZ", label: "体型" },
  { key: "DEX", label: "敏捷" },
  { key: "APP", label: "外貌" },
  { key: "INT", label: "智力" },
  { key: "POW", label: "意志" },
  { key: "EDU", label: "教育" }
];

function buildCustomProfessionMeta(data) {
  if (!data) return "";
  return [
    data.creditRange ? "信用评级：" + data.creditRange : "",
    data.attributeFormulaText ? "职业属性：" + data.attributeFormulaText : "",
    data.occupationSkillsText ? "本职技能：" + data.occupationSkillsText : ""
  ].filter(Boolean).join("　");
}

function getSkillSelectOptions(selected = "") {
  return getAllSkills().map((skill) => {
    const name = getSkillDisplayName(skill) || skill.name;
    return `<option value="${escapeHTML(name)}"${name === selected ? " selected" : ""}>${escapeHTML(name)}</option>`;
  }).join("");
}

function renderCustomProfessionRules(rules = []) {
  const list = $("customProfessionRules");
  if (!list) return;
  const rows = Array.from({ length: 3 }, (_, index) => rules[index] || {});
  list.innerHTML = rows.map((rule, index) => `
    <div class="custom-rule-row" data-rule-index="${index}">
      <select data-custom-rule-attr>
        <option value="">属性</option>
        ${customProfessionRuleAttrs.map((attr) => `<option value="${attr.key}"${rule.attr === attr.key ? " selected" : ""}>${attr.label}</option>`).join("")}
      </select>
      <input data-custom-rule-multiplier type="number" min="1" max="10" value="${rule.multiplier || ""}" />
      <span>倍</span>
    </div>
  `).join("");
}

function addCustomProfessionSkillRow(value = "") {
  const list = $("customProfessionSkillList");
  if (!list) return;
  const row = document.createElement("div");
  row.className = "custom-profession-skill-row";
  row.innerHTML = `
    <select data-custom-profession-skill>
      <option value="">选择技能</option>
      ${getSkillSelectOptions(value)}
    </select>
    <button class="ghost small" type="button" data-remove-custom-profession-skill>删除</button>
  `;
  list.appendChild(row);
}

function renderCustomProfessionSkills(skills = []) {
  const list = $("customProfessionSkillList");
  if (!list) return;
  list.innerHTML = "";
  (skills.length ? skills : [""]).forEach((skillName) => addCustomProfessionSkillRow(skillName));
}

function openCustomProfessionModal() {
  const existing = customProfessionData && customProfessionData.name === occupation.value.trim() ? customProfessionData : null;
  $("customProfessionName").value = existing ? existing.name : occupation.value.trim();
  $("customCreditMin").value = existing ? existing.creditMin || "" : "";
  $("customCreditMax").value = existing ? existing.creditMax || "" : "";
  renderCustomProfessionRules(existing ? existing.rules || [] : []);
  renderCustomProfessionSkills(existing ? existing.skills || [] : []);
  openModal("customProfessionModal");
}

function collectCustomProfessionData() {
  const name = $("customProfessionName").value.trim();
  const creditMin = $("customCreditMin").value.trim();
  const creditMax = $("customCreditMax").value.trim();
  const rules = Array.from(document.querySelectorAll("#customProfessionRules .custom-rule-row")).map((row) => ({
    attr: row.querySelector("[data-custom-rule-attr]").value,
    multiplier: Number(row.querySelector("[data-custom-rule-multiplier]").value || 0)
  })).filter((rule) => rule.attr && rule.multiplier > 0);
  const skills = Array.from(document.querySelectorAll("#customProfessionSkillList [data-custom-profession-skill]"))
    .map((select) => select.value.trim())
    .filter(Boolean);
  const creditRange = creditMin || creditMax ? `${creditMin || 0}-${creditMax || creditMin || 0}` : "";
  const formula = rules.map((rule) => `${rule.attr}*${rule.multiplier}`).join("+");
  return {
    id: "custom",
    name,
    creditMin,
    creditMax,
    creditRange,
    rules,
    attributeFormulaText: formula,
    skillPointFormulaExcel: formula,
    skills,
    occupationSkillsText: skills.join("，")
  };
}


function setOccupationHint(text) {
  occupationHint.textContent = text || "";
  occupationHint.hidden = !text;
}

function findProfessionMatches(keyword, includeAll = false) {
  const text = keyword.trim().toLowerCase();
  if (!text) return includeAll ? [...professions].sort((a, b) => a.name.localeCompare(b.name, "zh-CN")) : [];
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

  if (matches.length === 1) {
    applyProfession(matches[0]);
    showStatus("saveStatus", "已匹配职业：" + matches[0].name);
    return;
  }

  showProfessionPicker(keyword);
  showStatus("saveStatus", "找到多个匹配职业，请选择一个。");
}

function randomizeProfession() {
  if (!professions.length) {
    showStatus("saveStatus", "职业库为空，无法随机职业。", true);
    return;
  }
  const selected = professions[Math.floor(Math.random() * professions.length)];
  applyProfession(selected);
  showStatus("saveStatus", "已随机职业：" + selected.name);
}
function applyProfession(profession) {
  occupation.value = profession.name;
  if (occupationIdInput) occupationIdInput.value = profession.occupationId !== undefined ? String(profession.occupationId) : "";
  setOccupationHint(profession.meta);
  hideProfessionPicker();
  fillDefaultCreditRating(true);
  markPreviewDirty("basic");
  renderSkillList();
  updateSkillSummary();
  persist();
}

function positionProfessionResults() {
  if (!professionResults.classList.contains("show")) return;
  const margin = 10;
  const width = Math.min(680, window.innerWidth - 24);
  const left = Math.max(12, Math.min(window.innerWidth - width - 12, occupation.getBoundingClientRect().left));
  professionResults.style.left = `${left}px`;
  professionResults.style.top = `${margin}px`;
  professionResults.style.width = `${width}px`;
  professionResults.style.maxHeight = `${Math.max(260, window.innerHeight - margin * 2)}px`;
}

function renderProfessionPickerList(keyword) {
  const matches = findProfessionMatches(keyword, true);
  const list = professionResults.querySelector("[data-profession-list]");
  if (!list) return;
  if (!matches.length) {
    list.innerHTML = `<div class="profession-option"><div class="profession-name">没有匹配结果</div><div class="profession-meta">可以继续输入，或使用自定义职业。</div></div>`;
    return;
  }
  list.innerHTML = matches.map((p, idx) => `
    <div class="profession-option" data-index="${idx}">
      <div class="profession-name">${p.name}</div>
      <div class="profession-meta">${p.meta}</div>
    </div>
  `).join("");
}

function showProfessionPicker(keyword = occupation.value) {
  professionPickerOpen = true;
  professionResults.innerHTML = `
    <div class="profession-picker-head">
      <strong>选择职业</strong>
      <button type="button" class="profession-picker-close" data-close-profession-picker>关闭</button>
    </div>
    <div class="profession-picker-search"><input id="professionPickerSearch" type="text" autocomplete="off" value="${escapeHTML(keyword || "")}" /></div>
    <div class="profession-picker-list" data-profession-list></div>
  `;
  professionResults.classList.add("show", "is-picker");
  positionProfessionResults();
  renderProfessionPickerList(keyword || "");
  const search = $("professionPickerSearch");
  if (search) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
}

function hideProfessionPicker() {
  professionPickerOpen = false;
  professionResults.classList.remove("show", "is-picker");
  professionResults.innerHTML = "";
}

function showProfessionMatches(keyword) {
  if (professionPickerOpen) {
    const search = $("professionPickerSearch");
    if (search && search.value !== keyword) search.value = keyword;
    renderProfessionPickerList(keyword);
  }
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

  professionResults.addEventListener("input", (event) => {
    if (event.target.id !== "professionPickerSearch") return;
    renderProfessionPickerList(event.target.value);
  });

  professionResults.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-profession-picker]")) {
      hideProfessionPicker();
      return;
    }
    const option = event.target.closest(".profession-option[data-index]");
    if (!option) return;
    const search = $("professionPickerSearch");
    const matches = findProfessionMatches(search ? search.value : occupation.value, true);
    const selected = matches[Number(option.dataset.index)];
    if (selected) applyProfession(selected);
  });

  $("occupationPickerToggle").addEventListener("click", () => showProfessionPicker(occupation.value));
  window.addEventListener("resize", positionProfessionResults);
  window.addEventListener("scroll", positionProfessionResults, true);

  $("autoMatchOccupation").addEventListener("click", autoMatchProfession);
  $("randomOccupation").addEventListener("click", randomizeProfession);

  $("confirmMatch").addEventListener("click", () => {
    if (pendingProfessionMatch) {
      applyProfession(pendingProfessionMatch);
      showStatus("saveStatus", "已匹配职业：" + pendingProfessionMatch.name);
    }
    closeModal("matchModal");
  });

  $("customOccupation").addEventListener("click", openCustomProfessionModal);

  $("addCustomProfessionSkill").addEventListener("click", () => addCustomProfessionSkillRow(""));

  $("customProfessionSkillList").addEventListener("click", (event) => {
    if (!event.target.closest("[data-remove-custom-profession-skill]")) return;
    const rows = Array.from(document.querySelectorAll("#customProfessionSkillList .custom-profession-skill-row"));
    if (rows.length <= 1) return;
    event.target.closest(".custom-profession-skill-row").remove();
  });

  $("saveCustomProfession").addEventListener("click", () => {
    const data = collectCustomProfessionData();
    if (!data.name) {
      showStatus("saveStatus", "请填写自定义职业名称。", true);
      return;
    }
    if (!data.occupationSkillsText) {
      showStatus("saveStatus", "自定义职业至少需要选择一个职业技能。", true);
      return;
    }

    customProfessionData = data;
    occupation.value = data.name;
    if (occupationIdInput) occupationIdInput.value = "";
    if (creditRatingValue) creditRatingValue.value = parseCreditRangeMinimum(data.creditRange) ?? "";
    setOccupationHint(buildCustomProfessionMeta(data) || "自定义职业");

    markPreviewDirty("all");
    renderSkillList();
    updateSkillSummary();
    persist();
    closeModal("customProfessionModal");
    showStatus("saveStatus", "已保存自定义职业：" + data.name);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".profession-wrap")) {
      hideProfessionPicker();
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








