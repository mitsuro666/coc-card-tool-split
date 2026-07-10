    function normalizeSearchText(text) {
      return String(text || "").replace(/Ω/g, "").replace(/[\s　：:（）()、，。·/\\-]/g, "").toLowerCase();
    }

    function getSkillState(skillId) {
      if (!skillPointData[skillId]) {
        skillPointData[skillId] = { career: "", interest: "", specialty: "", manualOccupation: null };
      }
      return skillPointData[skillId];
    }

    function getAttributeMap() {
      return {
        STR: parseAttributeValue("attrSTR") || 0,
        CON: parseAttributeValue("attrCON") || 0,
        SIZ: parseAttributeValue("attrSIZ") || 0,
        DEX: parseAttributeValue("attrDEX") || 0,
        APP: parseAttributeValue("attrAPP") || 0,
        INT: parseAttributeValue("attrINT") || 0,
        POW: parseAttributeValue("attrPOW") || 0,
        EDU: parseAttributeValue("attrEDU") || 0
      };
    }

    function parsePointValue(value) {
      const numeric = Number(String(value || "").trim());
      return Number.isFinite(numeric) ? numeric : 0;
    }

    function getSkillSpecialty(skill) {
      const state = getSkillState(skill.id);
      return (state.specialty || skill.defaultSpecialty || "").trim();
    }

    function getSkillDisplayName(skill) {
      const specialty = getSkillSpecialty(skill);
      const baseName = skill.name.replace(/Ω/g, "").trim();
      if (baseName.endsWith("：") || baseName.endsWith(":")) return baseName + (specialty || "");
      if (specialty && skill.isSpecialized && !/[①②③]/.test(baseName)) return baseName + specialty;
      if (specialty && skill.isSpecialized && /[①②③]/.test(baseName)) return baseName.replace(/[①②③]/g, "") + "：" + specialty;
      return skill.displayName || baseName;
    }

    function lookupCombatBase(specialty) {
      const table = { "鞭子": 5, "电锯": 10, "斧": 15, "剑": 20, "绞具": 15, "链枷": 10, "矛": 20 };
      return table[specialty] || 0;
    }

    function lookupShootingBase(specialty) {
      const table = { "步枪/霰弹枪": 25, "冲锋枪": 15, "弓术": 15, "喷射器": 10, "机枪": 10, "重武器": 10 };
      return table[specialty] || 0;
    }

    function computeSkillBase(skill) {
      const formula = skill.baseFormulaExcel || "";
      const attrs = getAttributeMap();
      const specialty = getSkillSpecialty(skill);
      if (!formula) return Number(skill.baseValue) || 0;
      if (formula.includes("INT(DEX/2)")) return Math.floor(attrs.DEX / 2);
      if (formula === "=AG5" || formula.includes("EDU")) return attrs.EDU;
      if (formula.includes("附表!C")) return lookupCombatBase(specialty);
      if (formula.includes("附表!E")) return lookupShootingBase(specialty);
      if (formula.includes("数学")) return specialty === "数学" ? 10 : (Number(skill.baseCachedValue) || 1);
      return Number(skill.baseCachedValue) || 0;
    }

    function getSkillTotal(skill) {
      const state = getSkillState(skill.id);
      return computeSkillBase(skill) + parsePointValue(state.career) + parsePointValue(state.interest);
    }


    function getSkillTotalClass(total) {
      if (total > 99) return " is-danger";
      if (total > 80) return " is-warning";
      return "";
    }

    function setPointSummaryState(el, used, target) {
      if (!el) return;
      const hasLimit = target !== null && target !== undefined && Number.isFinite(Number(target)) && Number(target) > 0;
      el.classList.toggle("is-danger", Boolean(hasLimit && used > Number(target)));
    }
    function findSelectedOccupation() {
      const selectedId = occupationIdInput && occupationIdInput.value ? Number(occupationIdInput.value) : null;
      if (selectedId !== null && Number.isFinite(selectedId)) {
        const byId = occupationDatabase.find((job) => Number(job.id) === selectedId);
        if (byId) return byId;
      }
      const selected = occupation.value.trim();
      if (!selected) return null;
      return occupationDatabase.find((job) => job.name === selected) ||
        occupationDatabase.find((job) => job.name && job.name.includes(selected)) ||
        occupationDatabase.find((job) => selected.includes(job.name));
    }

    function buildSkillKeywords(skill) {
      const display = getSkillDisplayName(skill).replace(/Ω/g, "");
      const base = skill.name.replace(/Ω/g, "").replace(/[①②③]/g, "").trim();
      const specialty = getSkillSpecialty(skill);
      const keywords = new Set([display, base, specialty].filter(Boolean));
      if (display.includes("图书馆")) keywords.add("图书馆");
      if (display.includes("汽车驾驶")) keywords.add("驾驶");
      if (display.includes("格斗")) keywords.add("格斗");
      if (display.includes("斗殴")) keywords.add("斗殴");
      if (display.includes("射击")) keywords.add("射击");
      if (display.includes("手枪")) keywords.add("手枪");
      if (display.includes("计算机使用")) keywords.add("计算机");
      return Array.from(keywords).map(normalizeSearchText).filter((item) => item.length >= 2);
    }

    function getOccupationTagType(skill) {
      const state = getSkillState(skill.id);
      if (state.manualOccupation === true) return "occupation";
      if (state.manualOccupation === false) return "";
      const selectedOccupation = findSelectedOccupation();
      if (!selectedOccupation) return "";
      const text = normalizeSearchText(selectedOccupation.occupationSkillsText);
      if (!text) return "";
      const direct = buildSkillKeywords(skill).some((keyword) => text.includes(keyword));
      if (direct) return "occupation";
      const social = new Set(["取悦", "话术", "恐吓", "说服"]);
      if (text.includes("社交技能") && social.has(skill.name.replace(/Ω/g, ""))) return "candidate";
      if (text.includes("科学") && skill.name.includes("科学")) return "candidate";
      if (text.includes("外语") && skill.name.includes("外语")) return "candidate";
      if (text.includes("技艺") && skill.name.includes("技艺")) return "candidate";
      if (text.includes("艺术") && skill.name.includes("技艺")) return "candidate";
      if (text.includes("格斗") && skill.name.includes("格斗")) return "candidate";
      if (text.includes("射击") && skill.name.includes("射击")) return "candidate";
      return "";
    }

    function buildSkillTagCandidates(skill) {
      const display = getSkillDisplayName(skill).replace(/Ω/g, "");
      const rawName = skill.name.replace(/Ω/g, "").replace(/[①②③]/g, "").trim();
      const candidates = new Set([display, rawName]);
      if (display.includes("斗殴") || rawName.includes("斗殴")) candidates.add("斗殴");
      if (display.includes("射击") || rawName.includes("射击")) candidates.add("射击");
      if (display.includes("驾驶") || rawName.includes("驾驶")) candidates.add("驾驶");
      return { display, rawName, candidates };
    }

    function matchSkillGroup(skill, groups) {
      const { display, rawName, candidates } = buildSkillTagCandidates(skill);
      for (const [key, group] of Object.entries(groups)) {
        if (group.names.some((name) => candidates.has(name) || display === name || rawName === name || display.includes(name))) {
          return { key, ...group };
        }
      }
      return null;
    }

    function getCommonSkillGroup(skill) {
      return matchSkillGroup(skill, commonSkillGroups);
    }

    function getCategorySkillGroup(skill) {
      return matchSkillGroup(skill, skillCategoryGroups);
    }

    function isCommonSkill(skill) {
      return Boolean(getCommonSkillGroup(skill));
    }

    function isAddedSkill(skill) {
      const state = getSkillState(skill.id);
      return parsePointValue(state.career) > 0 || parsePointValue(state.interest) > 0;
    }


    function normalizeCustomSkill(skill) {
      if (!skill || typeof skill !== "object") return null;
      const name = String(skill.name || skill.displayName || "").trim();
      if (!name) return null;
      const baseValue = Number(skill.baseValue);
      return {
        id: String(skill.id || ("custom_skill_" + Date.now() + "_" + Math.random().toString(16).slice(2))),
        order: Number(skill.order) || 9000 + customSkillData.length,
        name,
        defaultSpecialty: "",
        displayName: name,
        baseValue: Number.isFinite(baseValue) ? Math.max(0, Math.floor(baseValue)) : 0,
        baseFormulaExcel: null,
        baseCachedValue: Number.isFinite(baseValue) ? Math.max(0, Math.floor(baseValue)) : 0,
        totalFormulaExcel: null,
        occupationFlagFormulaExcel: null,
        formulas: {},
        isSpecialized: false,
        isCustom: true,
        lockCareer: false,
        lockInterest: false
      };
    }

    function createCustomSkill(name, baseValue, isOccupation) {
      const normalizedName = String(name || "").trim();
      if (!normalizedName) return null;
      const id = "custom_skill_" + Date.now() + "_" + Math.random().toString(16).slice(2);
      const numericBase = Number(baseValue);
      const skill = normalizeCustomSkill({
        id,
        order: 9000 + customSkillData.length,
        name: normalizedName,
        baseValue: Number.isFinite(numericBase) ? numericBase : 0
      });
      if (!skill) return null;
      customSkillData.push(skill);
      const state = getSkillState(skill.id);
      state.manualOccupation = Boolean(isOccupation);
      return skill;
    }

    function skillMatchesFilter(skill) {
      if (currentSkillFilter === "occupation") return Boolean(getOccupationTagType(skill));
      if (currentSkillFilter === "common") return isCommonSkill(skill);
      if (currentSkillFilter === "added") return isAddedSkill(skill);
      return true;
    }

    function getCanonicalSkillName(skill) {
      return getSkillDisplayName(skill)
        .replace(/Ω/g, "")
        .replace(/[①②③]/g, "")
        .trim();
    }

    function getCategoryOrder(skill) {
      const category = getCategorySkillGroup(skill);
      if (!category) return 9;
      if (category.key === "action") return 0;
      if (category.key === "knowledge") return 1;
      if (category.key === "technique") return 2;
      return 8;
    }

    function getCommonOrder(skill) {
      const common = getCommonSkillGroup(skill);
      if (!common) return 9;
      if (common.key === "explore") return 0;
      if (common.key === "combat") return 1;
      if (common.key === "social") return 2;
      if (common.key === "psychology") return 3;
      return 8;
    }

    function skillDefaultSortRank(skill) {
      const tag = getOccupationTagType(skill);
      if (tag === "occupation") return 0;
      if (tag === "candidate") return 1;
      if (isCommonSkill(skill)) return 2;
      const name = getCanonicalSkillName(skill);
      if (name === "母语") return 3;
      if (name === "克苏鲁神话") return 4;
      const categoryOrder = getCategoryOrder(skill);
      if (categoryOrder < 9) return 5 + categoryOrder;
      return 9;
    }

    function sortByDefaultPriority(a, b) {
      const rankA = skillDefaultSortRank(a);
      const rankB = skillDefaultSortRank(b);
      const rankDiff = rankA - rankB;
      if (rankDiff) return rankDiff;

      if (rankA <= 2) {
        const commonDiff = getCommonOrder(a) - getCommonOrder(b);
        if (commonDiff) return commonDiff;
      }

      const categoryDiff = getCategoryOrder(a) - getCategoryOrder(b);
      if (categoryDiff) return categoryDiff;
      return (a.order || 9999) - (b.order || 9999);
    }

    function sortSkills(skills) {
      const sortMode = $("skillSort") ? $("skillSort").value : "priority";
      return [...skills].sort((a, b) => {
        if (sortMode === "common") return (isCommonSkill(b) - isCommonSkill(a)) || sortByDefaultPriority(a, b);
        if (sortMode === "added") return (isAddedSkill(b) - isAddedSkill(a)) || sortByDefaultPriority(a, b);
        if (sortMode === "total-desc") return getSkillTotal(b) - getSkillTotal(a) || sortByDefaultPriority(a, b);
        if (sortMode === "name") return getSkillDisplayName(a).localeCompare(getSkillDisplayName(b), "zh-CN");
        return sortByDefaultPriority(a, b);
      });
    }

    function renderSkillTags(skill) {
      const tags = [];
      const occupationTag = getOccupationTagType(skill);
      if (occupationTag === "candidate") tags.push(`<span class="skill-tag candidate">可选</span>`);
      const commonGroup = getCommonSkillGroup(skill);
      if (commonGroup) tags.push(`<span class="skill-tag ${commonGroup.className}">${commonGroup.label}</span>`);
      const categoryGroup = getCategorySkillGroup(skill);
      if (categoryGroup) tags.push(`<span class="skill-tag ${categoryGroup.className}">${categoryGroup.label}</span>`);
      if (skill.isCustom) tags.push(`<span class="skill-tag custom">自定义</span>`);
      return tags.join("");
    }

    function renderSkillList() {
      const list = $("skillList");
      if (!list) return;
      const search = normalizeSearchText($("skillSearch") ? $("skillSearch").value : "");
      let visible = getAllSkills().filter((skill) => {
        if (!skillMatchesFilter(skill)) return false;
        if (!search) return true;
        return normalizeSearchText(getSkillDisplayName(skill) + skill.name + (skill.defaultSpecialty || "")).includes(search);
      });
      visible = sortSkills(visible);
      if (!visible.length) {
        list.innerHTML = `<div class="skill-empty">没有符合条件的技能。</div>`;
        updateSkillSummary();
        return;
      }
      list.innerHTML = visible.map((skill) => {
        const state = getSkillState(skill.id);
        const occupationTag = getOccupationTagType(skill);
        const base = computeSkillBase(skill);
        const total = getSkillTotal(skill);
        const highlighted = occupationTag || isCommonSkill(skill) || isAddedSkill(skill);
        const customDeleteButton = skill.isCustom ? `<button class="skill-delete-btn" type="button" data-delete-custom-skill="${skill.id}">删除</button>` : ``;
        return `
          <section class="skill-row${highlighted ? " is-highlighted" : ""}" data-skill-id="${skill.id}">
            <label class="skill-occ-toggle">
              <input class="skill-occ-checkbox" type="checkbox" ${occupationTag ? "checked" : ""} /> 本职
            </label>
            <div class="skill-title">
              <div class="skill-title-head">
                <div class="skill-name-line">
                  <strong data-skill-name>${escapeHTML(getSkillDisplayName(skill) || skill.name)}</strong>
                  <div class="skill-tags">${renderSkillTags(skill)}</div>
                </div>
              </div>
            </div>
            <div class="skill-inputs">
              <div class="skill-base-box"><span>初始</span><strong data-skill-base>${base}</strong></div>
              <label>职业
                <input data-skill-input="career" type="number" inputmode="numeric" min="0" value="${escapeHTML(state.career || "")}" ${skill.lockCareer ? "disabled" : ""} />
              </label>
              <label>兴趣
                <input data-skill-input="interest" type="number" inputmode="numeric" min="0" value="${escapeHTML(state.interest || "")}" ${skill.lockInterest ? "disabled" : ""} />
              </label>
              <div class="skill-total-box"><span>合计</span><strong class="skill-total-value${getSkillTotalClass(total)}" data-skill-total>${total}</strong></div>
              ${customDeleteButton}
            </div>
          </section>
        `;
      }).join("");
      updateSkillSummary();
    }    function updateSkillRow(skillId) {
      const skill = getAllSkills().find((item) => item.id === skillId);
      const row = document.querySelector(`.skill-row[data-skill-id="${skillId}"]`);
      if (!skill || !row) return;
      const base = computeSkillBase(skill);
      const total = getSkillTotal(skill);
      const baseEl = row.querySelector("[data-skill-base]");
      const totalEl = row.querySelector("[data-skill-total]");
      const nameEl = row.querySelector("[data-skill-name]");
      if (baseEl) baseEl.textContent = base;
      if (totalEl) {
        totalEl.textContent = total;
        totalEl.classList.toggle("is-warning", total > 80 && total <= 99);
        totalEl.classList.toggle("is-danger", total > 99);
      }
      if (nameEl) nameEl.textContent = getSkillDisplayName(skill) || skill.name;
    }
    function evaluateOccupationPointFormula(formula) {
      if (!formula) return null;
      const attrs = getAttributeMap();
      let expression = formula.replace(/^=/, "")
        .replace(/MAX\(/g, "Math.max(")
        .replace(/×/g, "*")
        .replace(/＋/g, "+")
        .replace(/，/g, ",");
      ["STR", "CON", "SIZ", "DEX", "APP", "INT", "POW", "EDU"].forEach((key) => {
        expression = expression.replace(new RegExp(`\\b${key}\\b`, "g"), String(attrs[key] || 0));
      });
      if (!/^[0-9+*(),.\sMathmax-]+$/.test(expression)) return null;
      try {
        const value = Function(`"use strict"; return (${expression});`)();
        return Number.isFinite(value) ? Math.floor(value) : null;
      } catch (error) {
        return null;
      }
    }

    function parseCreditRangeMinimum(rangeText) {
      const match = String(rangeText || "").match(/\d+/);
      return match ? Number(match[0]) : null;
    }

    function fillDefaultCreditRating(force = false) {
      if (!creditRatingValue) return;
      const occupation = findSelectedOccupation();
      const minimum = occupation ? parseCreditRangeMinimum(occupation.creditRange) : null;
      if (force || !creditRatingValue.value.trim()) {
        creditRatingValue.value = minimum === null ? "" : String(minimum);
      }
    }

    function updateSkillOccupationInfo(occupation) {
      const nameEl = $("skillOccupationName");
      const formulaEl = $("skillOccupationFormula");
      const skillsEl = $("skillOccupationSkillsText");
      if (nameEl) nameEl.textContent = occupation && occupation.name ? occupation.name : "未选择";
      if (formulaEl) formulaEl.textContent = occupation && occupation.attributeFormulaText ? occupation.attributeFormulaText : "未读取";
      if (skillsEl) skillsEl.textContent = occupation && occupation.occupationSkillsText ? occupation.occupationSkillsText : "选择职业后显示。";
    }

    function updateSkillSummary() {
      if (!$("careerPointSummary")) return;
      const occupation = findSelectedOccupation();
      fillDefaultCreditRating(false);
      const creditUsed = creditRatingValue ? parsePointValue(creditRatingValue.value) : 0;
      const careerUsed = getAllSkills().reduce((sum, skill) => sum + parsePointValue(getSkillState(skill.id).career), 0) + creditUsed;
      const interestUsed = getAllSkills().reduce((sum, skill) => sum + parsePointValue(getSkillState(skill.id).interest), 0);
      const careerTarget = occupation ? evaluateOccupationPointFormula(occupation.skillPointFormulaExcel) : null;
      const interestTarget = (parseAttributeValue("attrINT") || 0) * 2;
      const careerSummary = $("careerPointSummary");
      const interestSummary = $("interestPointSummary");
      careerSummary.textContent = `${careerUsed} / ${careerTarget === null ? "未计算" : careerTarget}`;
      interestSummary.textContent = `${interestUsed} / ${interestTarget || "未计算"}`;
      setPointSummaryState(careerSummary, careerUsed, careerTarget);
      setPointSummaryState(interestSummary, interestUsed, interestTarget);
      $("creditRangeSummary").textContent = occupation && occupation.creditRange ? occupation.creditRange : "未读取";
      updateSkillOccupationInfo(occupation);
      updateAssetCalculations();
      markPreviewDirty("skills");
    }
    function updateSkillCalculations() {
      getAllSkills().forEach((skill) => updateSkillRow(skill.id));
      updateSkillSummary();
      updateAssetCalculations();
    }

function initSkills() {
  $("resetSkillsBtn").addEventListener("click", () => {
    if (!confirm("确定清空技能加点页的内容吗？")) return;
    skillPointData = {};
    customSkillData = [];
    if (creditRatingValue) creditRatingValue.value = "";
    renderSkillList();
    persist();
    showStatus("skillStatus", "已清空本页内容。");
  });
  $("addCustomSkillBtn").addEventListener("click", () => {
    $("customSkillName").value = "";
    $("customSkillBase").value = "1";
    $("customSkillOccupation").checked = false;
    openModal("customSkillModal");
  });

  $("saveCustomSkill").addEventListener("click", () => {
    const name = $("customSkillName").value.trim();
    const base = $("customSkillBase").value.trim();
    if (!name) {
      showStatus("skillStatus", "请填写自定义技能名称。", true);
      return;
    }
    const skill = createCustomSkill(name, base, $("customSkillOccupation").checked);
    if (!skill) {
      showStatus("skillStatus", "自定义技能添加失败。", true);
      return;
    }
    closeModal("customSkillModal");
    renderSkillList();
    persist();
    showStatus("skillStatus", "已添加自定义技能：" + name);
  });

  if (creditRatingValue) {
    creditRatingValue.addEventListener("input", () => {
      updateSkillSummary();
      updateAssetCalculations();
      persist();
    });
  }

  $("skillSearch").addEventListener("input", () => {
    renderSkillList();
    persist();
  });

  $("skillSort").addEventListener("change", () => {
    renderSkillList();
    persist();
  });

  document.querySelectorAll("[data-skill-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentSkillFilter = button.dataset.skillFilter;
      document.querySelectorAll("[data-skill-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderSkillList();
      persist();
    });
  });



  $("skillList").addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-custom-skill]");
    if (!deleteButton) return;
    const skillId = deleteButton.dataset.deleteCustomSkill;
    const skill = customSkillData.find((item) => item.id === skillId);
    if (!skill) return;
    if (!confirm("确定删除自定义技能「" + skill.name + "」吗？")) return;
    customSkillData = customSkillData.filter((item) => item.id !== skillId);
    delete skillPointData[skillId];
    renderSkillList();
    persist();
    showStatus("skillStatus", "已删除自定义技能：" + skill.name);
  });

  $("skillList").addEventListener("input", (event) => {
    const row = event.target.closest(".skill-row");
    if (!row) return;
    const skillId = row.dataset.skillId;
    const state = getSkillState(skillId);
    const type = event.target.dataset.skillInput;
    if (type === "career") state.career = event.target.value;
    if (type === "interest") state.interest = event.target.value;
    if (type === "specialty") state.specialty = event.target.value;
    updateSkillRow(skillId);
    updateSkillSummary();
    persist();
  });

  $("skillList").addEventListener("change", (event) => {
    const row = event.target.closest(".skill-row");
    if (!row) return;
    const skillId = row.dataset.skillId;
    const state = getSkillState(skillId);
    if (event.target.classList.contains("skill-occ-checkbox")) {
      state.manualOccupation = event.target.checked;
      renderSkillList();
      persist();
    }
    if (event.target.dataset.skillInput === "specialty") {
      renderSkillList();
      persist();
    }
  });
}








