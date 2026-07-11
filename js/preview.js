const previewDirty = {
  basic: true,
  attributes: true,
  secondary: true,
  skills: true
};
let previewFrame = null;

function valueOrDefault(value, fallback) {
  return value && value.trim() ? value.trim() : fallback;
}

function getEraText() {
  if (era.value === "自定义") return valueOrDefault(customEra.value, "未选择");
  return valueOrDefault(era.value, "未选择");
}

function getCurrentTimeText() {
  const year = $("currentYear") ? $("currentYear").value.trim() : "";
  const month = $("currentMonth") ? $("currentMonth").value.trim() : "";
  const day = $("currentDay") ? $("currentDay").value.trim() : "";
  const minute = $("currentMinute") ? $("currentMinute").value.trim() : "";
  const second = $("currentSecond") ? $("currentSecond").value.trim() : "";
  if (!year && !month && !day && !minute && !second) return "未填写";
  return [year ? `${year}年` : "", month ? `${month}月` : "", day ? `${day}日` : "", minute ? `${minute}分` : "", second ? `${second}秒` : ""].filter(Boolean).join(" ");
}

function isPreviewOpen() {
  return floatingPreview && floatingPreview.classList.contains("show");
}

function isPreviewSectionOpen(listId) {
  const list = $(listId);
  const section = list ? list.closest("details") : null;
  return Boolean(section && section.open);
}

function markPreviewDirty(section = "all") {
  if (section === "all") {
    Object.keys(previewDirty).forEach((key) => {
      previewDirty[key] = true;
    });
  } else if (previewDirty[section] !== undefined) {
    previewDirty[section] = true;
  }

  if (!isPreviewOpen() || previewFrame) return;
  previewFrame = requestAnimationFrame(() => {
    previewFrame = null;
    updatePreview();
  });
}

function getPreviewSkillSortRank(skill) {
  return skillDefaultSortRank(skill);
}

function sortPreviewSkills(a, b) {
  const rankDiff = getPreviewSkillSortRank(a) - getPreviewSkillSortRank(b);
  if (rankDiff) return rankDiff;
  const totalDiff = getSkillTotal(b) - getSkillTotal(a);
  if (totalDiff) return totalDiff;
  return sortByDefaultPriority(a, b);
}

function renderPreviewSkillTags(skill) {
  const occupationTag = getOccupationTagType(skill);
  const tags = [];
  if (occupationTag === "occupation") tags.push(`<span class="skill-tag occupation">本职</span>`);
  if (occupationTag === "candidate") tags.push(`<span class="skill-tag candidate">可选</span>`);
  const commonGroup = getCommonSkillGroup(skill);
  if (commonGroup) tags.push(`<span class="skill-tag ${commonGroup.className}">${commonGroup.label}</span>`);
  const categoryGroup = getCategorySkillGroup(skill);
  if (categoryGroup) {
    const socialOption = categoryGroup.key === "social" && typeof isSocialOptionSkill === "function" && isSocialOptionSkill(skill);
    const label = socialOption ? "社交" : categoryGroup.label;
    const className = socialOption ? `${categoryGroup.className} social-option` : categoryGroup.className;
    tags.push(`<span class="skill-tag ${className}">${label}</span>`);
  }
  if (skill.isCustom) tags.push(`<span class="skill-tag custom">自定义</span>`);
  return tags.join("");
}

function renderBasicPreview() {
  $("pvName").textContent = valueOrDefault($("investigatorName").value, "未填写");
  $("pvPlayer").textContent = valueOrDefault($("playerName").value, "未填写");
  $("pvEra").textContent = getEraText();
  $("pvOccupation").textContent = valueOrDefault($("occupation").value, "未填写");
  $("pvAge").textContent = valueOrDefault($("age").value, "未填写");
  $("pvGender").textContent = valueOrDefault($("gender").value, "未填写");
  $("pvResidence").textContent = valueOrDefault($("residence").value, "未填写");
  $("pvBirthplace").textContent = valueOrDefault($("birthplace").value, "未填写");
  if ($("pvStoryLocation")) $("pvStoryLocation").textContent = valueOrDefault($("storyLocation").value, "未填写");
  if ($("pvCurrentTime")) $("pvCurrentTime").textContent = getCurrentTimeText();
  previewDirty.basic = false;
}

function renderAttributePreview() {
  const list = $("attributePreviewList");
  if (!list) return;
  list.innerHTML = attributes.map((attribute) => {
    return `<div><span>${attribute.name} ${attribute.key}</span><strong>${formatAttributeValue(attribute.id)}</strong></div>`;
  }).join("");
  previewDirty.attributes = false;
}

function getSecondaryInfoKey(label) {
  if (label.includes("耐久值")) return "hp";
  if (label.includes("理智值")) return "san";
  if (label.includes("魔法值")) return "mp";
  if (label.includes("伤害加值")) return "db";
  if (label.includes("体格")) return "build";
  return "";
}

function renderSecondaryPreview() {
  const list = $("secondaryPreviewList");
  if (!list) return;
  list.innerHTML = calculateSecondaryAttributes().map((item) => {
    const infoKey = getSecondaryInfoKey(item.label);
    const info = infoKey ? `<span class="info-dot secondary-info-trigger" data-info-note data-info-type="secondary" data-info-key="${infoKey}" aria-label="次要属性说明">i</span>` : "";
    return `<div><span>${item.label}${info}</span><strong>${formatDerivedValue(item.value)}</strong></div>`;
  }).join("");
  previewDirty.secondary = false;
}

function renderSkillPreview() {
  const list = $("skillPreviewList");
  if (!list) return;
  const visible = getAllSkills()
    .filter((skill) => getSkillTotal(skill) >= 30)
    .sort(sortPreviewSkills);
  if (!visible.length) {
    list.innerHTML = `<div class="preview-empty">完成技能加点后，达到 30 的技能会显示在这里。</div>`;
    previewDirty.skills = false;
    return;
  }
  list.innerHTML = visible.map((skill) => `
    <div class="preview-skill-item">
      <div class="preview-skill-main">
        <div class="preview-skill-name-line">
          <span>${escapeHTML(getSkillDisplayName(skill) || skill.name)}</span>
          <div class="skill-tags">${renderPreviewSkillTags(skill)}</div>
        </div>
        <strong>${getSkillTotal(skill)}</strong>
      </div>
    </div>
  `).join("");
  previewDirty.skills = false;
}

function updatePreview(options = {}) {
  const force = Boolean(options.force);
  if (force || previewDirty.basic) renderBasicPreview();
  if ((force || previewDirty.attributes) && isPreviewSectionOpen("attributePreviewList")) renderAttributePreview();
  if ((force || previewDirty.secondary) && isPreviewSectionOpen("secondaryPreviewList")) renderSecondaryPreview();
  if ((force || previewDirty.skills) && isPreviewSectionOpen("skillPreviewList")) renderSkillPreview();
}

function initPreview() {
  previewToggle.addEventListener("click", () => {
    floatingPreview.classList.toggle("show");
    floatingNotes.classList.remove("show");
    if (isPreviewOpen()) updatePreview({ force: true });
  });

  closePreview.addEventListener("click", () => {
    floatingPreview.classList.remove("show");
  });

  document.querySelectorAll(".floating-preview .preview-section").forEach((section) => {
    section.addEventListener("toggle", () => {
      if (!section.open) return;
      const list = section.querySelector(".preview-list, .preview-skill-list");
      if (!list) return;
      if (list.id === "attributePreviewList") renderAttributePreview();
      if (list.id === "secondaryPreviewList") renderSecondaryPreview();
      if (list.id === "skillPreviewList") renderSkillPreview();
    });
  });
}


