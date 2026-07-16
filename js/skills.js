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

    function canUseCareerPoints(skill) {
      return Boolean(getOccupationTagType(skill) || isTalentSkill(skill));
    }

    function getSkillTotal(skill) {
      const state = getSkillState(skill.id);
      const career = canUseCareerPoints(skill) ? parsePointValue(state.career) : 0;
      return computeSkillBase(skill) + career + parsePointValue(state.interest);
    }

    function getSkillTotalClass(total) {
      if (total > 99) return " is-danger";
      if (total > 80) return " is-warning";
      return "";
    }

    function setPointSummaryState(el, used, target) {
      if (!el) return;
      const usedEl = el.querySelector(".point-used");
      if (!usedEl) return;
      const hasLimit = target !== null && target !== undefined && Number.isFinite(Number(target)) && Number(target) > 0;
      usedEl.classList.toggle("is-under", Boolean(hasLimit && used < Number(target)));
      usedEl.classList.toggle("is-danger", Boolean(hasLimit && used > Number(target)));
    }

    function getSkillPointLimitState() {
      const occupation = findSelectedOccupation();
      const creditUsage = getCreditPointUsage(occupation);
      const careerUsed = getAllSkills().reduce((sum, skill) => {
        if (!canUseCareerPoints(skill)) return sum;
        return sum + parsePointValue(getSkillState(skill.id).career);
      }, 0) + creditUsage.career;
      const interestUsed = getAllSkills().reduce((sum, skill) => sum + parsePointValue(getSkillState(skill.id).interest), 0) + creditUsage.interest;
      const careerTarget = occupation ? evaluateOccupationPointFormula(occupation.skillPointFormulaExcel) : null;
      const interestTarget = (parseAttributeValue("attrINT") || 0) * 2;
      const careerHasLimit = careerTarget !== null && Number.isFinite(Number(careerTarget)) && Number(careerTarget) > 0;
      const interestHasLimit = Number.isFinite(Number(interestTarget)) && Number(interestTarget) > 0;
      return {
        careerOver: Boolean(careerHasLimit && careerUsed > Number(careerTarget)),
        interestOver: Boolean(interestHasLimit && interestUsed > Number(interestTarget))
      };
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
    function getCategorySkillGroups(skill) {
      const groups = [];
      Object.entries(skillCategoryGroups).forEach(([key, group]) => {
        const matched = matchSkillGroup(skill, { [key]: group });
        if (matched) groups.push(matched);
      });
      return groups;
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
      if (currentSkillFilter === "added") return isAddedSkill(skill);
      if (currentSkillFilter === "unadded") return !isAddedSkill(skill);
      return true;
    }

    function getCanonicalSkillName(skill) {
      return getSkillDisplayName(skill)
        .replace(/Ω/g, "")
        .replace(/[①②③]/g, "")
        .trim();
    }

    function isSocialOptionSkill(skill) {
      const name = getCanonicalSkillName(skill).replace(/：.*$/, "");
      return ["说服", "取悦", "话术", "恐吓"].includes(name);
    }

    function getCategoryOrder(skill) {
      const category = getCategorySkillGroup(skill);
      if (!category) return 9;
      if (category.key === "investigate") return 0;
      if (category.key === "social") return 1;
      if (category.key === "combat") return 2;
      if (category.key === "stunt") return 3;
      if (category.key === "support") return 4;
      if (category.key === "knowledge") return 5;
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
      const categoryOrder = getCategoryOrder(skill);
      if (categoryOrder < 9) return 3 + categoryOrder;
      return 9;
    }

    function sortByDefaultPriority(a, b) {
      const rankA = skillDefaultSortRank(a);
      const rankB = skillDefaultSortRank(b);
      const rankDiff = rankA - rankB;
      if (rankDiff) return rankDiff;

      const categoryDiff = getCategoryOrder(a) - getCategoryOrder(b);
      if (categoryDiff) return categoryDiff;
      return (a.order || 9999) - (b.order || 9999);
    }

    function sortSkills(skills) {
      const sortMode = $("skillSort") ? $("skillSort").value : "priority";
      return [...skills].sort((a, b) => {
        if (sortMode === "added" || sortMode === "added-first") return (isAddedSkill(b) - isAddedSkill(a)) || sortByDefaultPriority(a, b);
        if (sortMode === "unadded-first") return (isAddedSkill(a) - isAddedSkill(b)) || sortByDefaultPriority(a, b);
        if (sortMode === "total-desc") return getSkillTotal(b) - getSkillTotal(a) || sortByDefaultPriority(a, b);
        if (sortMode === "total-asc") return getSkillTotal(a) - getSkillTotal(b) || sortByDefaultPriority(a, b);
        if (sortMode === "name") return getSkillDisplayName(a).localeCompare(getSkillDisplayName(b), "zh-CN");
        return sortByDefaultPriority(a, b);
      });
    }


    function getSkillNoteKey(skill) {
      const name = getCanonicalSkillName(skill);
      if (name.includes("取悦")) return "取悦";
      if (name.includes("侦察") || name.includes("侦查")) return "侦查";
      if (name.includes("斗殴")) return "斗殴";
      if (name.includes("格斗")) return "格斗";
      if (name.includes("射击")) return "射击";
      if (name.includes("驾驶") && !name.includes("汽车驾驶")) return "驾驶";
      if (name.includes("科学")) return "科学";
      if (name.includes("生存")) return "生存";
      return name.replace(/：.*$/, "");
    }

    function renderSkillInfoButton(skill) {
      const key = getSkillNoteKey(skill);
      return `<span class="info-dot skill-info-trigger" data-info-note data-info-type="skill" data-info-key="${escapeHTML(key)}" aria-label="技能说明">i</span>`;
    }
    function renderSkillTags(skill) {
      const tags = [];
      const occupationTag = getOccupationTagType(skill);
      if (occupationTag === "candidate") tags.push(`<span class="skill-tag candidate">可选</span>`);
      getCategorySkillGroups(skill).forEach((categoryGroup) => {
        const socialOption = categoryGroup.key === "social" && isSocialOptionSkill(skill);
        const label = socialOption ? "社交" : categoryGroup.label;
        const className = socialOption ? `${categoryGroup.className} social-option` : categoryGroup.className;
        tags.push(`<span class="skill-tag ${className}">${label}</span>`);
      });
      if (skill.isCustom) tags.push(`<span class="skill-tag custom">自定义</span>`);
      return tags.join("");
    }


    function normalizeTalentSkillIds() {
      const validIds = new Set(getAllSkills().filter((skill) => !getOccupationTagType(skill)).map((skill) => String(skill.id)));
      talentSkillIds = talentSkillIds.filter((id, index) => validIds.has(String(id)) && talentSkillIds.indexOf(id) === index);
    }

    function isTalentSkill(skill) {
      return talentSkillIds.includes(String(skill.id));
    }

    function updateTalentSkillSummary() {
      const el = $("talentSkillSummary");
      if (el) el.textContent = String(talentSkillIds.length);
    }
    function renderSkillCard(skill, isOccupationSection = false) {
      const state = getSkillState(skill.id);
      const occupationTag = getOccupationTagType(skill);
      const talent = isTalentSkill(skill);
      const base = computeSkillBase(skill);
      const total = getSkillTotal(skill);
      const highlighted = occupationTag || talent || isCommonSkill(skill) || isAddedSkill(skill);
      const talentToggle = isOccupationSection ? `` : `<label class="skill-occ-toggle skill-talent-toggle"><input class="skill-talent-checkbox" type="checkbox" ${talent ? "checked" : ""} /> 特长</label>`;
      const customDeleteButton = skill.isCustom ? `<button class="skill-delete-btn" type="button" data-delete-custom-skill="${skill.id}">删除</button>` : ``;
      return `
          <section class="skill-row${highlighted ? " is-highlighted" : ""}${talent ? " is-talent" : ""}" data-skill-id="${skill.id}">
            ${talentToggle}
            <div class="skill-title">
              <div class="skill-title-head">
                <div class="skill-name-line">
                  <strong data-skill-name>${escapeHTML(getSkillDisplayName(skill) || skill.name)}</strong>
                  ${renderSkillInfoButton(skill)}
                  <div class="skill-tags">${renderSkillTags(skill)}</div>
                </div>
              </div>
            </div>
            <div class="skill-inputs">
              <div class="skill-base-box"><span>初始</span><strong data-skill-base>${base}</strong></div>
              <label class="${skill.lockCareer || !canUseCareerPoints(skill) ? "is-disabled" : ""}">职业
                <input data-skill-input="career" type="number" inputmode="numeric" min="0" value="${escapeHTML(state.career || "")}" ${skill.lockCareer || !canUseCareerPoints(skill) ? "disabled" : ""} />
              </label>
              <label>兴趣
                <input data-skill-input="interest" type="number" inputmode="numeric" min="0" value="${escapeHTML(state.interest || "")}" ${skill.lockInterest ? "disabled" : ""} />
              </label>
              <div class="skill-total-box"><span>合计</span><strong class="skill-total-value${getSkillTotalClass(total)}" data-skill-total>${total}</strong></div>
              ${customDeleteButton}
            </div>
          </section>
        `;
    }

    function renderSkillSection(title, skills) {
      const body = skills.length
        ? `<div class="skill-section-list">${skills.map((skill) => renderSkillCard(skill, title === "本职技能")).join("")}</div>`
        : `<div class="skill-section-empty">暂无符合条件的技能。</div>`;
      return `
        <details class="skill-section" open>
          <summary><span>${title}<strong>${skills.length}</strong></span><i aria-hidden="true"></i></summary>
          ${body}
        </details>
      `;
    }

    function renderSkillList() {
      const list = $("skillList");
      if (!list) return;
      const search = normalizeSearchText($("skillSearch") ? $("skillSearch").value : "");
      normalizeTalentSkillIds();
      const visible = sortSkills(getAllSkills().filter((skill) => {
        if (!skillMatchesFilter(skill)) return false;
        if (!search) return true;
        return normalizeSearchText(getSkillDisplayName(skill) + skill.name + (skill.defaultSpecialty || "")).includes(search);
      }));
      const sections = [
        { title: "本职技能", skills: [] },
        { title: "常用技能", skills: [] },
        { title: "其他技能", skills: [] }
      ];
      visible.forEach((skill) => {
        if (getOccupationTagType(skill)) sections[0].skills.push(skill);
        else if (!skill.isCustom && isCommonSkill(skill)) sections[1].skills.push(skill);
        else sections[2].skills.push(skill);
      });
      list.innerHTML = sections.map((section) => renderSkillSection(section.title, section.skills)).join("");
      updateSkillSummary();
      updateTalentSkillSummary();
      renderSkillRadar();
    }
    function updateSkillRow(skillId) {
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

    function parseCreditRangeMaximum(rangeText) {
      const matches = String(rangeText || "").match(/\d+/g);
      return matches && matches.length ? Number(matches[matches.length - 1]) : null;
    }

    function getCreditPointUsage(occupation = findSelectedOccupation()) {
      const value = creditRatingValue ? parsePointValue(creditRatingValue.value) : 0;
      const maximum = occupation ? parseCreditRangeMaximum(occupation.creditRange) : null;
      if (maximum === null) return { career: value, interest: 0 };
      return {
        career: Math.min(value, maximum),
        interest: Math.max(0, value - maximum)
      };
    }
    function fillDefaultCreditRating(force = false) {
      if (!creditRatingValue) return;
      const occupation = findSelectedOccupation();
      const minimum = occupation ? parseCreditRangeMinimum(occupation.creditRange) : null;
      if (force || !creditRatingValue.value.trim()) {
        creditRatingValue.value = minimum === null ? "" : String(minimum);
      }
    }


    function getAutoCareerSkills() {
      const sorted = [...getAllSkills()].sort(sortByDefaultPriority);
      let occupationSkills = sorted.filter((skill) => getOccupationTagType(skill) && !skill.lockCareer);
      const talentSkills = sorted.filter((skill) => isTalentSkill(skill) && !skill.lockCareer);
      const socialOccupationSkills = occupationSkills.filter((skill) => isSocialOptionSkill(skill));
      if (socialOccupationSkills.length > 1) {
        const persuadeSkill = socialOccupationSkills.find((skill) => getCanonicalSkillName(skill).replace(/：.*$/, "") === "说服");
        if (persuadeSkill) {
          occupationSkills = occupationSkills.filter((skill) => !isSocialOptionSkill(skill) || skill.id === persuadeSkill.id);
        }
      }
      const keepIds = new Set([...occupationSkills, ...talentSkills].map((skill) => String(skill.id)));
      return sorted.filter((skill) => keepIds.has(String(skill.id)));
    }

    function getAutoInterestSkills() {
      return [...getAllSkills()].sort(sortByDefaultPriority).filter((skill) => {
        if (skill.lockInterest) return false;
        if (getOccupationTagType(skill) || isTalentSkill(skill)) return false;
        return !skill.isCustom && isCommonSkill(skill);
      });
    }

    function clearSkillPointValues() {
      getAllSkills().forEach((skill) => {
        const state = getSkillState(skill.id);
        state.career = "";
        state.interest = "";
      });
    }

    function distributePointsEvenly(total, skills, field) {
      const amount = Math.max(0, Math.floor(Number(total) || 0));
      if (!skills.length || amount <= 0) return 0;
      const base = Math.floor(amount / skills.length);
      const remainder = amount % skills.length;
      let assigned = 0;
      skills.forEach((skill, index) => {
        const value = base + (index < remainder ? 1 : 0);
        if (value > 0) {
          getSkillState(skill.id)[field] = String(value);
          assigned += value;
        }
      });
      return assigned;
    }

    function autoAssignSkillPoints() {
      const occupation = findSelectedOccupation();
      const careerTarget = occupation ? evaluateOccupationPointFormula(occupation.skillPointFormulaExcel) : null;
      const interestTarget = (parseAttributeValue("attrINT") || 0) * 2;
      if (careerTarget === null) {
        showStatus("skillStatus", "请先选择有效职业并填写属性。", true);
        return;
      }
      if (!confirm("自动加点会将职业点数平均分配给本职技能，兴趣点数平均分配给常用技能，并覆盖当前填写的所有数值。是否确定执行自动加点方案？")) return;

      clearSkillPointValues();
      if (creditRatingValue) creditRatingValue.value = "";
      fillDefaultCreditRating(true);

      const creditUsage = getCreditPointUsage(occupation);
      const careerSkills = getAutoCareerSkills();
      const interestSkills = getAutoInterestSkills();
      const careerAssigned = distributePointsEvenly(Math.max(0, careerTarget - creditUsage.career), careerSkills, "career");
      const interestAssigned = distributePointsEvenly(Math.max(0, interestTarget - creditUsage.interest), interestSkills, "interest");

      renderSkillList();
      persist();
      showStatus("skillStatus", `已自动加点：职业点 ${careerAssigned}，兴趣点 ${interestAssigned}。`);
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
      const creditUsage = getCreditPointUsage(occupation);
      const careerUsed = getAllSkills().reduce((sum, skill) => {
        if (!canUseCareerPoints(skill)) return sum;
        return sum + parsePointValue(getSkillState(skill.id).career);
      }, 0) + creditUsage.career;
      const interestUsed = getAllSkills().reduce((sum, skill) => sum + parsePointValue(getSkillState(skill.id).interest), 0) + creditUsage.interest;
      const careerTarget = occupation ? evaluateOccupationPointFormula(occupation.skillPointFormulaExcel) : null;
      const interestTarget = (parseAttributeValue("attrINT") || 0) * 2;
      const careerSummary = $("careerPointSummary");
      const interestSummary = $("interestPointSummary");
      careerSummary.innerHTML = `<span class="point-used">${careerUsed}</span> / <span class="point-limit">${careerTarget === null ? "未计算" : careerTarget}</span>`;
      interestSummary.innerHTML = `<span class="point-used">${interestUsed}</span> / <span class="point-limit">${interestTarget || "未计算"}</span>`;
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
      renderSkillRadar();
      updateAssetCalculations();
    }


    function skillMatchesRadarPart(skill, part) {
      const name = getCanonicalSkillName(skill);
      if (part === "驾驶") return name.startsWith("驾驶") && !name.includes("汽车驾驶");
      if (part === "射击") return name.includes("射击");
      if (part === "格斗") return name.includes("格斗");
      if (part === "技艺") return name.includes("技艺");
      if (part === "科学") return name.includes("科学");
      if (part === "外语") return name.includes("外语");
      return name.includes(part);
    }

    function skillValueByName(part) {
      return getAllSkills().reduce((sum, skill) => {
        return skillMatchesRadarPart(skill, part) ? sum + getSkillTotal(skill) : sum;
      }, 0);
    }

    function skillValueByParts(parts) {
      return parts.reduce((sum, part) => sum + skillValueByName(part), 0);
    }

    function calculateSkillRadarValues() {
      const attrs = getAttributeMap();
      const credit = creditRatingValue ? parsePointValue(creditRatingValue.value) : 0;
      const motherTongueBase = attrs.EDU || 0;
      const dodgeBase = Math.floor((attrs.DEX || 0) / 2);
      const groups = [
        {
          label: "调查",
          value: (attrs.INT || 0) + skillValueByParts(["会计", "人类学", "估价", "考古学", "计算机使用", "克苏鲁神话", "外语", "图书馆使用", "聆听", "博物学", "神秘学", "精神分析", "心理学", "侦查", "追踪", "读唇"]) - 122
        },
        {
          label: "交涉",
          value: (attrs.APP || 0) + credit + skillValueByParts(["人类学", "估价", "取悦", "乔装", "话术", "恐吓", "外语", "母语", "法律", "说服", "精神分析", "心理学", "侦查", "追踪", "读唇"]) - 111 - motherTongueBase
        },
        {
          label: "战斗",
          value: ((attrs.STR || 0) + (attrs.SIZ || 0)) / 2 + (attrs.CON || 0) + (attrs.DEX || 0) + skillValueByParts(["闪避", "格斗", "射击", "恐吓", "跳跃", "聆听", "操作重型机械", "心理学", "骑术", "侦查", "潜行", "投掷", "动物驯养", "爆破", "催眠", "炮术"]) - 189 - dodgeBase
        },
        {
          label: "特技",
          value: (attrs.DEX || 0) + skillValueByParts(["考古学", "技艺", "攀爬", "乔装", "汽车驾驶", "电气维修", "跳跃", "锁匠", "机械维修", "医学", "导航", "操作重型机械", "驾驶", "骑术", "妙手", "潜行", "生存", "游泳", "投掷", "追踪", "动物驯养", "潜水", "爆破", "催眠", "炮术"]) - 219
        },
        {
          label: "支援",
          value: credit + skillValueByParts(["急救", "医学", "精神分析", "汽车驾驶", "驾驶", "骑术", "导航", "人类学", "动物驯养", "催眠", "炮术"]) - 76
        },
        {
          label: "学问",
          value: (attrs.EDU || 0) + (attrs.INT || 0) + skillValueByParts(["会计", "人类学", "计算机使用", "克苏鲁神话", "电子学", "历史", "外语", "母语", "法律", "图书馆使用", "医学", "博物学", "神秘学", "精神分析", "心理学", "科学", "读唇"]) - motherTongueBase - 76
        }
      ];
      groups.forEach((group) => { group.value = Math.max(0, group.value); });
      const total = groups.reduce((sum, group) => sum + group.value, 0);
      return groups.map((group) => ({ ...group, ratio: total > 0 ? group.value / total : 0 }));
    }

    function renderSkillRadar() {
      const panel = $("skillRadarPanel");
      const canvas = $("skillRadarCanvas");
      if (!panel || !canvas || !panel.open) return;
      const cssWidth = Math.max(280, Math.round(canvas.getBoundingClientRect().width || 360));
      const cssHeight = Math.max(240, Math.round(canvas.getBoundingClientRect().height || 280));
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * ratio);
      canvas.height = Math.round(cssHeight * ratio);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      const items = calculateSkillRadarValues();
      const cx = cssWidth / 2;
      const cy = cssHeight / 2 + 8;
      const radius = Math.min(cssWidth, cssHeight) * 0.28;
      const angleStep = Math.PI * 2 / items.length;
      const pointAt = (index, valueRadius) => {
        const angle = -Math.PI / 2 + index * angleStep;
        return { x: cx + Math.cos(angle) * valueRadius, y: cy + Math.sin(angle) * valueRadius };
      };
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#d6e0ea";
      for (let step = 1; step <= 5; step += 1) {
        ctx.beginPath();
        items.forEach((_, index) => {
          const point = pointAt(index, radius * step / 5);
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.stroke();
      }
      items.forEach((item, index) => {
        const axis = pointAt(index, radius);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(axis.x, axis.y);
        ctx.stroke();
        const label = pointAt(index, radius + 30);
        ctx.fillStyle = "#3f4d5c";
        ctx.font = "12px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.label, label.x, label.y);
      });
      if (!items.some((item) => item.ratio > 0)) return;
      const maxRatio = Math.max(...items.map((item) => item.ratio), 0);
      const axisMax = maxRatio > 0 ? Math.max(0.2, Math.ceil(maxRatio * 10) / 10) : 1;
      ctx.beginPath();
      items.forEach((item, index) => {
        const normalizedRatio = Math.min(1, item.ratio / axisMax);
        const point = pointAt(index, radius * normalizedRatio);
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(80, 145, 199, .72)";
      ctx.strokeStyle = "#2f6fa7";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }
function initSkills() {
  $("resetSkillsBtn").addEventListener("click", () => {
    if (!confirm("确定清空技能加点页的内容吗？")) return;
    skillPointData = {};
    customSkillData = [];
    talentSkillIds = [];
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

  const autoAssignSkillsBtn = $("autoAssignSkillsBtn");
  if (autoAssignSkillsBtn) {
    autoAssignSkillsBtn.addEventListener("click", autoAssignSkillPoints);
  }

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
      renderSkillRadar();
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

  const skillRadarPanel = $("skillRadarPanel");
  if (skillRadarPanel) skillRadarPanel.addEventListener("toggle", () => renderSkillRadar());

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
    talentSkillIds = talentSkillIds.filter((id) => id !== skillId);
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
    if (event.target.classList.contains("skill-talent-checkbox")) {
      if (event.target.checked) {if (!talentSkillIds.includes(skillId)) talentSkillIds.push(skillId);
      } else {
        talentSkillIds = talentSkillIds.filter((id) => id !== skillId);
      }
      renderSkillList();
      persist();
    }
    if (event.target.dataset.skillInput === "specialty") {
      renderSkillList();
      persist();
    }
  });
}


























