function renderAttributeSheet() {
  const sheet = $("attributeSheet");
  sheet.innerHTML = attributes.map((attribute) => `
    <section class="attribute-cell${attribute.isLuck ? " luck-cell" : ""}">
      <div class="attr-main">
        <div class="attr-name">
          <strong>${attribute.name}</strong>
          <span>${attribute.key}</span>
        </div>
        <div class="attr-value-wrap">
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

function formatAttributeValue(id) {
  const value = parseAttributeValue(id);
  return value === null ? "未填写" : String(value);
}

function formatDerivedValue(value) {
  return value === null || value === undefined || value === "" ? "未计算" : String(value);
}

function getAgeMovePenalty() {
  if (!$("ageAdjustmentEnabled") || !$("ageAdjustmentEnabled").checked) return 0;
  const ageValue = Number(String($("age").value || "").trim());
  if (!Number.isFinite(ageValue) || ageValue < 40) return 0;
  return Math.max(0, Math.floor(ageValue / 10) - 3);
}


function getAgeNumber() {
  const value = Number(String($("age") ? $("age").value : "").trim());
  return Number.isFinite(value) ? value : null;
}

function getAgeAdjustmentRule() {
  const age = getAgeNumber();
  if (age === null) return { text: "请先在基础信息页填写年龄。", physical: 0, app: 0, edu: 0, eduChecks: 0, targets: [] };
  if (age < 15) return { text: "年龄低于常规调查员范围，请与 KP 确认是否使用年龄补正。", physical: 0, app: 0, edu: 0, eduChecks: 0, targets: [] };
  if (age <= 19) return { text: "15-19岁：从力量和体型里随机合计 -5，教育 -5。幸运取高暂不自动处理。", physical: 5, app: 0, edu: 5, eduChecks: 0, targets: ["attrSTR", "attrSIZ"] };
  if (age <= 39) return { text: "20-39岁：可进行 1 次教育进步检定。", physical: 0, app: 0, edu: 0, eduChecks: 1, targets: [] };
  if (age <= 49) return { text: "40-49岁：从力量、体质、敏捷里随机合计 -5，外貌 -5，移动力 -1；可进行 2 次教育进步检定。", physical: 5, app: 5, edu: 0, eduChecks: 2, targets: ["attrSTR", "attrCON", "attrDEX"] };
  if (age <= 59) return { text: "50-59岁：从力量、体质、敏捷里随机合计 -10，外貌 -10，移动力 -2；可进行 3 次教育进步检定。", physical: 10, app: 10, edu: 0, eduChecks: 3, targets: ["attrSTR", "attrCON", "attrDEX"] };
  if (age <= 69) return { text: "60-69岁：从力量、体质、敏捷里随机合计 -20，外貌 -15，移动力 -3；可进行 4 次教育进步检定。", physical: 20, app: 15, edu: 0, eduChecks: 4, targets: ["attrSTR", "attrCON", "attrDEX"] };
  return { text: "70岁及以上：从力量、体质、敏捷里随机合计 -40，外貌 -20，移动力 -4；可进行 4 次教育进步检定。", physical: 40, app: 20, edu: 0, eduChecks: 4, targets: ["attrSTR", "attrCON", "attrDEX"] };
}

function updateAgeAdjustmentInfo() {
  const rule = getAgeAdjustmentRule();
  const el = $("ageAdjustmentRule");
  if (el) el.textContent = rule.text;
}

function reduceAttributeValue(id, amount) {
  const el = $(id);
  const value = parseAttributeValue(id);
  if (!el || value === null || amount <= 0) return 0;
  const deduction = Math.min(amount, Math.max(0, value));
  el.value = String(value - deduction);
  return deduction;
}

function reduceRandomAttributes(ids, totalAmount) {
  let remaining = totalAmount;
  while (remaining > 0) {
    const available = ids.filter((id) => parseAttributeValue(id) !== null && parseAttributeValue(id) > 0);
    if (!available.length) break;
    const selected = available[Math.floor(Math.random() * available.length)];
    remaining -= reduceAttributeValue(selected, Math.min(5, remaining));
  }
  return totalAmount - remaining;
}


function applyAgeAdjustment() {
  const checkbox = $("ageAdjustmentEnabled");
  if (!checkbox || checkbox.dataset.applied === "true") return;
  const rule = getAgeAdjustmentRule();
  const changed = reduceRandomAttributes(rule.targets, rule.physical)
    + reduceAttributeValue("attrAPP", rule.app)
    + reduceAttributeValue("attrEDU", rule.edu);
  checkbox.dataset.applied = "true";
  updateAttributeCalculations();
  updateSkillCalculations();
  updateAgeAdjustmentInfo();
  showStatus("attributeStatus", changed ? "已按当前年龄扣减属性。教育进步和幸运请稍后手动处理。" : "当前年龄没有可自动扣减的属性。教育进步暂不处理。");
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

function calculateMoveSpeed(str, dex, siz) {
  if (str === null || dex === null || siz === null) return null;
  let base = 8;
  if (str > siz && dex > siz) base = 9;
  else if (str < siz && dex < siz) base = 7;
  return base - getAgeMovePenalty();
}

function calculateSecondaryAttributes() {
  const str = parseAttributeValue("attrSTR");
  const con = parseAttributeValue("attrCON");
  const siz = parseAttributeValue("attrSIZ");
  const dex = parseAttributeValue("attrDEX");
  const pow = parseAttributeValue("attrPOW");
  const dbBuild = calculateDamageBonusAndBuild(str, siz);

  return [
    { label: "耐久值 HP", value: con === null || siz === null ? null : Math.floor((con + siz) / 10) },
    { label: "理智值 SAN", value: pow === null ? null : pow },
    { label: "魔法值 MP", value: pow === null ? null : Math.floor(pow / 5) },
    { label: "伤害加值 DB", value: dbBuild.damageBonus },
    { label: "体格 Build", value: dbBuild.build },
    { label: "移动速度 MOV", value: calculateMoveSpeed(str, dex, siz) }
  ];
}

function updateAttributeCalculations() {
  const includeLuck = $("includeLuckInTotal").checked;
  const total = attributes.reduce((sum, attribute) => {
    if (attribute.isLuck && !includeLuck) return sum;
    const value = parseAttributeValue(attribute.id);
    return value === null ? sum : sum + value;
  }, 0);
  $("usedPoints").textContent = total;
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
      <p class="roll-text"><strong>属性组 ${index + 1}</strong>　${record.text}</p>
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

  $("ageAdjustmentEnabled").addEventListener("change", () => {
    if ($("ageAdjustmentEnabled").checked) applyAgeAdjustment();
    updateAttributeCalculations();
    persist();
    if (!$("ageAdjustmentEnabled").checked) showStatus("attributeStatus", "已取消年龄补正标记。已扣减的属性不会自动还原。");
  });

  attributeFieldIds.forEach((id) => {
    $(id).addEventListener("input", () => {
      updateAttributeCalculations();
      updateSkillCalculations();
      persist();
    });
  });

  $("resetAttributesBtn").addEventListener("click", () => {
    if (!confirm("确定清空属性购点页的内容吗？随机属性记录也会一起清空。")) return;
    attributeFieldIds.forEach((id) => {
      $(id).value = "";
    });
    $("includeLuckInTotal").checked = false;
    $("ageAdjustmentEnabled").checked = false;
    $("ageAdjustmentEnabled").dataset.applied = "";
    rollHistoryData = [];
    renderRollHistory();
    updateAttributeCalculations();
    updateSkillCalculations();
    updateAssetCalculations();
    persist();
    showStatus("attributeStatus", "已清空本页内容。");
  });
}


