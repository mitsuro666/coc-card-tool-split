function renderAttributeSheet() {
  const sheet = $("attributeSheet");
  sheet.innerHTML = attributes.map((attribute) => `
    <section class="attribute-cell${attribute.isLuck ? " luck-cell" : ""}">
      <div class="attr-main">
        <div class="attr-title">
          <div class="attr-name">
            <strong>${attribute.name}</strong>
            <span>${attribute.key}</span>
            <span class="info-dot attr-info-trigger" data-info-note data-info-type="attribute" data-info-key="${attribute.id}" aria-label="属性说明">i</span>
          </div>
          <p class="attr-level-note" id="${attribute.id}LevelNote"></p>
        </div>
        <div class="attr-value-wrap">
          <span class="age-adjustment-badge" id="${attribute.id}AgeAdjustment" hidden></span>
          ${attribute.isLuck ? `<button class="random-luck-btn secondary" type="button" id="randomLuckBtn">随机生成</button>` : ""}
          <input class="attr-input" id="${attribute.id}" type="text" inputmode="numeric" autocomplete="off" />
        </div>
      </div>
    </section>
  `).join("");
}
function parseAttributeValue(id) {
  const raw = $(id).value.trim();
  if (!raw) return null;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : null;
}

function getAttributeValueClass(value) {
  if (value === null) return "";
  if (value > 99) return "is-danger";
  if (value > 80) return "is-warning";
  return "";
}

function updateAttributeInputStates() {
  attributes.forEach((attribute) => {
    const input = $(attribute.id);
    const value = parseAttributeValue(attribute.id);
    input.classList.remove("is-warning", "is-danger");
    const valueClass = getAttributeValueClass(value);
    if (valueClass) input.classList.add(valueClass);
  });
}

function formatAttributeValue(id) {
  const value = parseAttributeValue(id);
  return value === null ? "未填写" : String(value);
}

function formatDerivedValue(value) {
  return value === null || value === undefined || value === "" ? "未计算" : String(value);
}

function getAttributeLevelNote(attribute) {
  const value = parseAttributeValue(attribute.id);
  if (value === null || value === 0) return "";
  const rules = attributeLevelNoteRules[attribute.id] || [];
  const matched = rules.find((rule) => {
    if (rule.lt !== undefined) return value < rule.lt;
    return value <= rule.max;
  });
  return matched ? matched.text : "";
}

function renderAttributeLevelNotes() {
  attributes.forEach((attribute) => {
    const el = $(attribute.id + "LevelNote");
    if (!el) return;
    el.textContent = getAttributeLevelNote(attribute);
  });
}

function getAgeMovePenalty() {
  const currentAge = String($("age") ? $("age").value : "").trim();
  return ageAdjustmentState && ageAdjustmentState.applied && ageAdjustmentState.age === currentAge ? Number(ageAdjustmentState.movePenalty || 0) : 0;
}

function resetAgeAdjustmentState() {
  ageAdjustmentState = { applied: false, age: "", adjustments: {}, movePenalty: 0, messages: [] };
  renderAgeAdjustmentBadges();
  updateAgeAdjustmentInfo();
}

function getAgeNumber() {
  const value = Number(String($("age") ? $("age").value : "").trim());
  return Number.isFinite(value) ? value : null;
}

function getAgeAdjustmentRule() {
  const age = getAgeNumber();
  if (age === null) return { text: "请先在基础信息页填写年龄。", physical: 0, app: 0, edu: 0, eduChecks: 0, movePenalty: 0, targets: [] };
  if (age < 15) return { text: "年龄低于常规调查员范围，请与 KP 确认是否使用年龄补正。", physical: 0, app: 0, edu: 0, eduChecks: 0, movePenalty: 0, targets: [] };
  if (age <= 19) return { text: "15-19岁：从力量和体型里随机合计 -5，教育 -5。幸运取高暂不自动处理。", physical: 5, app: 0, edu: 5, eduChecks: 0, movePenalty: 0, targets: ["attrSTR", "attrSIZ"] };
  if (age <= 39) return { text: "20-39岁：可进行 1 次教育进步检定。", physical: 0, app: 0, edu: 0, eduChecks: 1, movePenalty: 0, targets: [] };
  if (age <= 49) return { text: "40-49岁：从力量、体质、敏捷里随机合计 -5，外貌 -5，移动力 -1；可进行 2 次教育进步检定。", physical: 5, app: 5, edu: 0, eduChecks: 2, movePenalty: 1, targets: ["attrSTR", "attrCON", "attrDEX"] };
  if (age <= 59) return { text: "50-59岁：从力量、体质、敏捷里随机合计 -10，外貌 -10，移动力 -2；可进行 3 次教育进步检定。", physical: 10, app: 10, edu: 0, eduChecks: 3, movePenalty: 2, targets: ["attrSTR", "attrCON", "attrDEX"] };
  if (age <= 69) return { text: "60-69岁：从力量、体质、敏捷里随机合计 -20，外貌 -15，移动力 -3；可进行 4 次教育进步检定。", physical: 20, app: 15, edu: 0, eduChecks: 4, movePenalty: 3, targets: ["attrSTR", "attrCON", "attrDEX"] };
  return { text: "70岁及以上：从力量、体质、敏捷里随机合计 -40，外貌 -20，移动力 -4；可进行 4 次教育进步检定。", physical: 40, app: 20, edu: 0, eduChecks: 4, movePenalty: 4, targets: ["attrSTR", "attrCON", "attrDEX"] };
}

function renderAgeAdjustmentBadges() {
  attributes.forEach((attribute) => {
    const badge = $(attribute.id + "AgeAdjustment");
    if (!badge) return;
    const delta = Number(ageAdjustmentState && ageAdjustmentState.applied && ageAdjustmentState.adjustments ? ageAdjustmentState.adjustments[attribute.id] || 0 : 0);
    badge.textContent = delta ? `${delta > 0 ? "+" : ""}${delta}` : "";
    badge.hidden = !delta;
  });
}

function updateAgeAdjustmentInfo() {
  const rule = getAgeAdjustmentRule();
  const el = $("ageAdjustmentRule");
  if (el) el.textContent = rule.text;
  const applyBtn = $("applyAgeAdjustmentBtn");
  const cancelBtn = $("cancelAgeAdjustmentBtn");
  const applied = Boolean(ageAdjustmentState && ageAdjustmentState.applied);
  if (applyBtn) applyBtn.disabled = applied || getAgeNumber() === null;
  if (cancelBtn) cancelBtn.disabled = !applied;
  renderAgeAdjustmentBadges();
}

function reduceAttributeValue(id, amount) {
  const el = $(id);
  const value = parseAttributeValue(id);
  if (!el || value === null || amount <= 0) return 0;
  const deduction = Math.min(amount, Math.max(0, value));
  el.value = String(value - deduction);
  return deduction;
}

function applyAttributeDelta(id, delta) {
  const el = $(id);
  const value = parseAttributeValue(id);
  if (!el || value === null || !delta) return 0;
  const next = Math.max(0, value + delta);
  const actual = next - value;
  el.value = String(next);
  return actual;
}

function addAdjustment(adjustments, id, delta) {
  if (!delta) return;
  adjustments[id] = (adjustments[id] || 0) + delta;
}

function distributeRandomDeductions(ids, totalAmount) {
  const deltas = {};
  let remaining = totalAmount;
  while (remaining > 0 && ids.length) {
    const selected = ids[Math.floor(Math.random() * ids.length)];
    const amount = Math.min(5, remaining);
    deltas[selected] = (deltas[selected] || 0) - amount;
    remaining -= amount;
  }
  return deltas;
}

function rollD100() {
  return Math.floor(Math.random() * 100) + 1;
}

function rollD10() {
  return Math.floor(Math.random() * 10) + 1;
}

function getAttributeLabel(id) {
  const attribute = attributes.find((item) => item.id === id);
  return attribute ? attribute.name : id;
}

function setAgeAdjustmentModal(title, lines) {
  const titleEl = $("ageAdjustmentModalTitle");
  const body = $("ageAdjustmentResult");
  if (titleEl) titleEl.textContent = title;
  if (body) body.innerHTML = `<ul>${lines.map((line) => `<li>${escapeHTML(line)}</li>`).join("")}</ul>`;
  openModal("ageAdjustmentModal");
}

function applyAgeAdjustment() {
  if (ageAdjustmentState && ageAdjustmentState.applied) return;
  const rule = getAgeAdjustmentRule();
  const ageText = String($("age") ? $("age").value : "").trim();
  if (!ageText || getAgeNumber() === null) {
    showStatus("attributeStatus", "请先在基础信息页填写年龄。", true);
    return;
  }

  const requiredIds = Array.from(new Set([...rule.targets, rule.app ? "attrAPP" : "", rule.edu ? "attrEDU" : "", rule.eduChecks ? "attrEDU" : ""].filter(Boolean)));
  const missing = requiredIds.filter((id) => parseAttributeValue(id) === null).map(getAttributeLabel);
  if (missing.length) {
    showStatus("attributeStatus", `请先填写这些属性：${missing.join("、")}。`, true);
    return;
  }

  let adjustments = ageAdjustmentState && ageAdjustmentState.age === ageText && ageAdjustmentState.adjustments
    ? { ...ageAdjustmentState.adjustments }
    : null;
  let messages = ageAdjustmentState && ageAdjustmentState.age === ageText && Array.isArray(ageAdjustmentState.messages) && ageAdjustmentState.messages.length
    ? ageAdjustmentState.messages.slice()
    : null;
  let movePenalty = ageAdjustmentState && ageAdjustmentState.age === ageText ? Number(ageAdjustmentState.movePenalty || 0) : rule.movePenalty || 0;

  if (!adjustments || !messages) {
    const planned = distributeRandomDeductions(rule.targets, rule.physical);
    if (rule.app) planned.attrAPP = (planned.attrAPP || 0) - rule.app;
    if (rule.edu) planned.attrEDU = (planned.attrEDU || 0) - rule.edu;

    adjustments = {};
    messages = [];
    Object.entries(planned).forEach(([id, delta]) => {
      const actual = applyAttributeDelta(id, delta);
      addAdjustment(adjustments, id, actual);
      if (actual) messages.push(`${getAttributeLabel(id)} ${actual}`);
    });

    for (let i = 0; i < rule.eduChecks; i += 1) {
      const eduValue = parseAttributeValue("attrEDU");
      const checkRoll = rollD100();
      if (eduValue !== null && checkRoll > eduValue) {
        const gain = rollD10();
        const actual = applyAttributeDelta("attrEDU", gain);
        addAdjustment(adjustments, "attrEDU", actual);
        messages.push(`教育进步检定 ${i + 1}：D100=${checkRoll} > 教育${eduValue}，成功，教育 +${actual}`);
      } else {
        messages.push(`教育进步检定 ${i + 1}：D100=${checkRoll} <= 教育${eduValue}，未成功，教育不增加`);
      }
    }

    if (movePenalty) messages.push(`移动力 -${movePenalty}`);
    if (!messages.length) messages.push("当前年龄没有可自动应用的年龄补正。");
  } else {
    Object.entries(adjustments).forEach(([id, delta]) => applyAttributeDelta(id, Number(delta)));
  }

  ageAdjustmentState = { applied: true, age: ageText, adjustments, movePenalty, messages };
  updateAttributeCalculations();
  updateSkillCalculations();
  updateAgeAdjustmentInfo();
  persist();
  setAgeAdjustmentModal("已使用年龄补正", messages);
}

function revertAgeAdjustmentValues(options = {}) {
  const preserveRecord = Boolean(options.preserveRecord);
  const previousState = ageAdjustmentState || { age: "", adjustments: {}, movePenalty: 0, messages: [] };
  const messages = [];
  Object.entries(previousState.adjustments || {}).forEach(([id, delta]) => {
    const actual = applyAttributeDelta(id, -Number(delta));
    if (actual) messages.push(`${getAttributeLabel(id)} ${actual > 0 ? "+" : ""}${actual}`);
  });
  ageAdjustmentState = preserveRecord
    ? { applied: false, age: previousState.age || "", adjustments: { ...(previousState.adjustments || {}) }, movePenalty: Number(previousState.movePenalty || 0), messages: Array.isArray(previousState.messages) ? previousState.messages.slice() : [] }
    : { applied: false, age: "", adjustments: {}, movePenalty: 0, messages: [] };
  updateAttributeCalculations();
  updateSkillCalculations();
  updateAgeAdjustmentInfo();
  persist();
  return messages;
}

function handleAgeChangedAfterAdjustment() {
  if (!ageAdjustmentState || !ageAdjustmentState.applied) {
    resetAgeAdjustmentState();
    return;
  }
  revertAgeAdjustmentValues();
}

function cancelAgeAdjustment() {
  if (!ageAdjustmentState || !ageAdjustmentState.applied) return;
  const messages = revertAgeAdjustmentValues({ preserveRecord: true });
  setAgeAdjustmentModal("已取消年龄补正", messages.length ? messages : ["已取消年龄补正。"]);
}
function calculateDamageBonusAndBuild(str, siz) {
  if (str === null || siz === null) return { damageBonus: null, build: null };
  const total = str + siz;
  let build = 0;

  if (total <= 1) build = 0;
  else if (total <= 64) build = -2;
  else if (total <= 84) build = -1;
  else if (total <= 124) build = 0;
  else if (total <= 164) build = 1;
  else if (total <= 204) build = 2;
  else if (total <= 284) build = 3;
  else build = 4 + Math.floor((total - 285) / 80);

  let damageBonus = "0";
  if (build === -2) damageBonus = "-2";
  else if (build === -1) damageBonus = "-1";
  else if (build === 1) damageBonus = "+1D4";
  else if (build === 2) damageBonus = "+1D6";
  else if (build > 2) damageBonus = `+${build - 1}D6`;

  return { damageBonus, build };
}

function calculateMoveSpeed() {
  const penalty = getAgeMovePenalty();
  return penalty ? Math.max(0, 8 - penalty) : 8;
}

function calculateSecondaryAttributes() {
  const str = parseAttributeValue("attrSTR");
  const con = parseAttributeValue("attrCON");
  const siz = parseAttributeValue("attrSIZ");
  const dex = parseAttributeValue("attrDEX");
  const pow = parseAttributeValue("attrPOW");
  const dbBuild = calculateDamageBonusAndBuild(str, siz);

  return [
    { key: "hp", label: "耐久值 HP", value: con === null || siz === null ? null : Math.floor((con + siz) / 10) },
    { key: "san", label: "理智值 SAN", value: pow === null ? null : pow },
    { key: "mp", label: "魔法值 MP", value: pow === null ? null : Math.floor(pow / 5) },
    { key: "db", label: "伤害加值 DB", value: dbBuild.damageBonus },
    { key: "build", label: "体格 Build", value: dbBuild.build },
    { key: "mov", label: "移动速度 MOV", value: calculateMoveSpeed(str, dex, siz) }
  ];
}

function isMobileAttributeLayout() {
  return window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
}

function formatSecondaryAttributePanelValue(value) {
  if (value === null || value === undefined || value === "") return isMobileAttributeLayout() ? "空" : "未计算";
  return String(value);
}
function renderSecondaryAttributePanel() {
  const list = $("secondaryAttributeList");
  if (!list) return;
  list.innerHTML = calculateSecondaryAttributes().map((item) => {
    const info = secondaryAttributeNotes[item.key]
      ? `<span class="info-dot secondary-info-trigger" data-info-note data-info-type="secondary" data-info-key="${item.key}" aria-label="次要属性说明">i</span>`
      : "";
    const valueText = formatSecondaryAttributePanelValue(item.value);
    const valueClass = item.value === null || item.value === undefined || item.value === "" ? " class=\"is-empty-value\"" : "";
    return `<div class="secondary-attribute-item"><span>${item.label}${info}</span><strong${valueClass}>${valueText}</strong></div>`;
  }).join("");
}
function getRadarAttributes() {
  return [
    { id: "attrSTR", label: "力量", key: "STR" },
    { id: "attrCON", label: "体质", key: "CON" },
    { id: "attrSIZ", label: "体型", key: "SIZ" },
    { id: "attrDEX", label: "敏捷", key: "DEX" },
    { id: "attrAPP", label: "外貌", key: "APP" },
    { id: "attrINT", label: "智力\n灵感", key: "INT" },
    { id: "attrPOW", label: "意志", key: "POW" },
    { id: "attrEDU", label: "教育", key: "EDU" },
    { id: "attrLuck", label: "幸运", key: "Luck" }
  ];
}

function renderAttributeRadar() {
  const panel = $("attributeRadarPanel");
  const canvas = $("attributeRadarCanvas");
  if (!panel || !canvas || !panel.open) return;

  const cssWidth = Math.max(280, Math.round(canvas.getBoundingClientRect().width || 360));
  const cssHeight = Math.max(240, Math.round(canvas.getBoundingClientRect().height || 280));
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const radarItems = getRadarAttributes().map((item) => ({
    ...item,
    value: Math.max(0, Math.min(100, parseAttributeValue(item.id) || 0))
  }));
  const hasAnyValue = radarItems.some((item) => item.value > 0);
  const cx = cssWidth / 2;
  const cy = cssHeight / 2 + 8;
  const radius = Math.min(cssWidth, cssHeight) * 0.28;
  const maxValue = 100;
  const angleStep = Math.PI * 2 / radarItems.length;

  function pointAt(index, valueRadius) {
    const angle = -Math.PI / 2 + index * angleStep;
    return {
      x: cx + Math.cos(angle) * valueRadius,
      y: cy + Math.sin(angle) * valueRadius,
      angle
    };
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#d6e0ea";
  for (let step = 1; step <= 5; step += 1) {
    const ringRadius = radius * step / 5;
    ctx.beginPath();
    radarItems.forEach((_, index) => {
      const point = pointAt(index, ringRadius);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  radarItems.forEach((item, index) => {
    const axisEnd = pointAt(index, radius);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(axisEnd.x, axisEnd.y);
    ctx.stroke();

    const label = pointAt(index, radius + 36);
    const lines = item.label.split("\n");
    ctx.fillStyle = "#3f4d5c";
    ctx.font = "12px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, label.x, label.y + (lineIndex - (lines.length - 1) / 2) * 14);
    });
    ctx.fillStyle = "#6f7f90";
    ctx.font = "11px Arial, sans-serif";
    ctx.fillText(item.key, label.x, label.y + lines.length * 8 + 6);
  });

  ctx.fillStyle = "#708196";
  ctx.font = "11px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  [20, 40, 60, 80].forEach((value) => {
    const tick = pointAt(0, radius * value / maxValue);
    ctx.fillText(String(value), tick.x - 8, tick.y);
  });
  ctx.fillText("0", cx - 8, cy);

  if (!hasAnyValue) return;

  ctx.beginPath();
  radarItems.forEach((item, index) => {
    const point = pointAt(index, radius * item.value / maxValue);
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(47, 95, 143, .68)";
  ctx.strokeStyle = "#2f5f8f";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#2f5f8f";
  radarItems.forEach((item, index) => {
    const point = pointAt(index, radius * item.value / maxValue);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}
function updateAttributeCalculations() {
  const includeLuck = $("includeLuckInTotal").checked;
  const total = attributes.reduce((sum, attribute) => {
    if (attribute.isLuck && !includeLuck) return sum;
    const value = parseAttributeValue(attribute.id);
    return value === null ? sum : sum + value;
  }, 0);
  $("usedPoints").textContent = total;
  updateAttributeInputStates();
  renderAttributeLevelNotes();
  renderSecondaryAttributePanel();
  renderAttributeRadar();
  updateAgeAdjustmentInfo();
  markPreviewDirty("attributes");
  markPreviewDirty("secondary");
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollDice(count) {
  let total = 0;
  for (let i = 0; i < count; i += 1) total += rollD6();
  return total;
}

function rollAttribute(attribute) {
  if (attribute.roll === "2d6+6") return (rollDice(2) + 6) * 5;
  return rollDice(3) * 5;
}

function generateAttributeSet() {
  const values = {};
  attributes.forEach((attribute) => {
    if (!attribute.isLuck) values[attribute.key] = rollAttribute(attribute);
  });
  return values;
}

function getGeneratedTotal(values) {
  return Object.values(values).reduce((sum, value) => sum + value, 0);
}

function formatRollText(values) {
  const parts = attributes
    .filter((attribute) => !attribute.isLuck)
    .map((attribute) => `${attribute.name}${values[attribute.key]}`);
  return `${parts.join("，")}｜合计 ${getGeneratedTotal(values)}`;
}

function formatRollAttributeLine(values) {
  return attributes
    .filter((attribute) => !attribute.isLuck)
    .map((attribute) => `${attribute.name}${values[attribute.key]}`)
    .join("，");
}

function addRollRecord(count = 1) {
  const newRecords = [];
  for (let i = 0; i < count; i += 1) {
    const values = generateAttributeSet();
    newRecords.push({
      id: String(Date.now()) + "-" + Math.random().toString(16).slice(2),
      values,
      text: formatRollText(values)
    });
  }
  rollHistoryData = [...newRecords, ...rollHistoryData].slice(0, 5);
  renderRollHistory();
  persist();
  showStatus("attributeStatus", count === 1 ? "已生成 1 组随机属性。" : "已生成 5 组随机属性。");
}

function renderRollHistory() {
  const container = $("rollHistory");
  if (!rollHistoryData.length) {
    container.innerHTML = `<div class="roll-empty">暂无生成结果。</div>`;
    return;
  }

  container.innerHTML = rollHistoryData.map((record, index) => `
    <section class="roll-item" data-roll-id="${record.id}">
      <p class="roll-text"><strong class="roll-title">属性组 ${index + 1}</strong><span class="roll-attributes">${formatRollAttributeLine(record.values)}</span><span class="roll-total">合计：${getGeneratedTotal(record.values)}</span></p>
      <div class="roll-item-actions">
        <button class="small secondary" type="button" data-action="fill-empty">填入空项</button>
        <button class="small" type="button" data-action="overwrite">覆盖属性</button>
      </div>
    </section>
  `).join("");
}

function applyRollRecord(record, overwrite = false) {
  attributes.forEach((attribute) => {
    if (attribute.isLuck) return;
    const input = $(attribute.id);
    if (overwrite || !input.value.trim()) {
      input.value = record.values[attribute.key];
    }
  });
  updateAttributeCalculations();
  updateSkillCalculations();
  persist();
  showStatus("attributeStatus", overwrite ? "已覆盖当前属性。" : "已填入空项。");
}

function initAttributes() {
  renderAttributeSheet();

  $("randomLuckBtn").addEventListener("click", () => {
    $("attrLuck").value = rollAttribute(attributes.find((attribute) => attribute.isLuck));
    updateAttributeCalculations();
    persist();
    showStatus("attributeStatus", "已随机生成幸运。");
  });

  $("rollOneAttributes").addEventListener("click", () => addRollRecord(1));
  $("rollFiveAttributes").addEventListener("click", () => addRollRecord(5));

  $("clearRollHistory").addEventListener("click", () => {
    if (!rollHistoryData.length) return;
    if (!confirm("确定清空随机属性记录吗？")) return;
    rollHistoryData = [];
    renderRollHistory();
    persist();
    showStatus("attributeStatus", "已清空随机属性记录。");
  });

  $("rollHistory").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = button.closest(".roll-item");
    const record = rollHistoryData.find((entry) => entry.id === item.dataset.rollId);
    if (!record) return;
    applyRollRecord(record, button.dataset.action === "overwrite");
  });

  $("includeLuckInTotal").addEventListener("change", () => {
    updateAttributeCalculations();
    persist();
  });

  $("applyAgeAdjustmentBtn").addEventListener("click", applyAgeAdjustment);

  $("cancelAgeAdjustmentBtn").addEventListener("click", cancelAgeAdjustment);

  const radarPanel = $("attributeRadarPanel");
  if (radarPanel) {
    radarPanel.addEventListener("toggle", () => {
      if (radarPanel.open) renderAttributeRadar();
    });
  }

  attributeFieldIds.forEach((id) => {
    $(id).addEventListener("input", () => {
      if (id === "attrAPP") {
        const appValue = Number($(id).value);
        if (Number.isFinite(appValue) && appValue > 99) $(id).value = "99";
      }
      updateAttributeCalculations();
      updateSkillCalculations();
      persist();
    });
  });

  window.addEventListener("resize", renderSecondaryAttributePanel);

  $("resetAttributesBtn").addEventListener("click", () => {
    if (!confirm("确定清空属性购点页的内容吗？随机属性记录也会一起清空。")) return;
    attributeFieldIds.forEach((id) => {
      $(id).value = "";
    });
    $("includeLuckInTotal").checked = false;
    ageAdjustmentState = { applied: false, age: "", adjustments: {}, movePenalty: 0, messages: [] };
    rollHistoryData = [];
    renderRollHistory();
    updateAttributeCalculations();
    updateSkillCalculations();
    updateAssetCalculations();
    persist();
    showStatus("attributeStatus", "已清空本页内容。");
  });
}
























