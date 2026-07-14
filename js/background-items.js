function renderBackgroundGrid() {
  const grid = $("backgroundGrid");
  if (!grid) return;
  grid.innerHTML = backgroundFields.map((field) => `
    <section class="background-card${field.id === "backgroundExtra" ? " is-wide" : ""}">
      <div class="background-card-head">
        <strong>${field.label}</strong>
        <label for="${field.id}Key"><input id="${field.id}Key" type="checkbox" data-background-key="${field.id}" /> 关键</label>
      </div>
      <textarea id="${field.id}" data-background-field="${field.id}" rows="2"></textarea>
    </section>
  `).join("");
}

function itemCustomFlag(item) {
  return Boolean(item && (item.isCustom === true || item.isCustom === "true"));
}

function normalizeInventoryItem(item, fallbackType) {
  const type = fallbackType || (item && item.type) || "others";
  const base = {
    id: item && item.id ? String(item.id) : String(Date.now()) + "-" + Math.random().toString(16).slice(2),
    type,
    matchedId: item && item.matchedId ? String(item.matchedId) : "",
    isCustom: itemCustomFlag(item)
  };
  if (type === "weapons") {
    return {
      ...base,
      name: String((item && (item.name || item.weaponName || item.preset)) || ""),
      weaponType: String((item && (item.weaponType || item.preset)) || ""),
      skill: String((item && item.skill) || ""),
      success: String((item && item.success) || ""),
      hard: String((item && item.hard) || ""),
      extreme: String((item && item.extreme) || ""),
      damage: String((item && item.damage) || ""),
      range: String((item && item.range) || ""),
      penetrate: String((item && item.penetrate) || ""),
      attacks: String((item && item.attacks) || ""),
      ammo: String((item && item.ammo) || ""),
      malfunction: String((item && item.malfunction) || "")
    };
  }
  if (type === "armors") {
    return {
      ...base,
      name: String((item && item.name) || ""),
      armorType: String((item && (item.armorType || item.preset)) || ""),
      armorValue: String((item && item.armorValue) || ""),
      movPenalty: String((item && item.movPenalty) || ""),
      coverage: String((item && item.coverage) || ""),
      species: String((item && item.species) || ""),
      special: String((item && item.special) || ""),
      era: String((item && item.era) || ""),
      price: String((item && item.price) || "")
    };
  }
  if (type === "vehicles") {
    return {
      ...base,
      name: String((item && item.name) || ""),
      vehicleType: String((item && (item.vehicleType || item.preset)) || ""),
      skill: String((item && item.skill) || ""),
      mov: String((item && item.mov) || ""),
      build: String((item && item.build) || ""),
      passengerArmor: String((item && item.passengerArmor) || ""),
      passengers: String((item && item.passengers) || ""),
      drivableBuild: String((item && item.drivableBuild) || ""),
      rideableBuild: String((item && item.rideableBuild) || ""),
      era: String((item && item.era) || "")
    };
  }
  return {
    ...base,
    isCustom: true,
    name: item && item.name ? String(item.name) : "",
    quantity: item && item.quantity ? String(item.quantity) : "1",
    location: item && item.location ? String(item.location) : "其他",
    status: item && item.status ? String(item.status) : "显露"
  };
}

function createDefaultInventoryExamples() {
  const weapon = normalizeInventoryItem({ name: "手枪", weaponType: ".22(5.6mm)小型自动手枪" }, "weapons");
  applyInventoryMatch(weapon, "weapons", findInventoryMatch("weapons", weapon.weaponType));
  const armor = normalizeInventoryItem({ name: "防弹衣", armorType: "常规防弹衣" }, "armors");
  applyInventoryMatch(armor, "armors", findInventoryMatch("armors", armor.armorType));
  const other = normalizeInventoryItem({ name: "手电筒", quantity: "1", location: "背包", status: "隐藏" }, "others");
  return { weapons: [weapon], armors: [armor], vehicles: [], others: [other] };
}

function ensureInitialInventoryExamples() {
  if ((inventoryData.weapons && inventoryData.weapons.length) || (inventoryData.armors && inventoryData.armors.length) || (inventoryData.others && inventoryData.others.length)) return;
  inventoryData = createDefaultInventoryExamples();
}
function createInventoryItem(type) {
  return normalizeInventoryItem({ quantity: "1" }, type);
}

function getInventoryDatabase(type) {
  if (type === "weapons") return typeof weaponDatabase !== "undefined" ? weaponDatabase : [];
  if (type === "armors") return typeof armorDatabase !== "undefined" ? armorDatabase : [];
  if (type === "vehicles") return typeof vehicleDatabase !== "undefined" ? vehicleDatabase : [];
  return [];
}

function getInventoryNameField(type) {
  if (type === "weapons") return "weaponType";
  if (type === "armors") return "armorType";
  if (type === "vehicles") return "vehicleType";
  return "name";
}

function findInventoryMatch(type, value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const nameField = getInventoryNameField(type);
  return getInventoryDatabase(type).find((entry) => String(entry[nameField] || entry.name || "").trim() === text) || null;
}

function clearInventoryDetails(item, type) {
  const nameField = getInventoryNameField(type);
  Object.keys(item).forEach((key) => {
    if (["id", "type", "isCustom", "matchedId", "name", nameField].includes(key)) return;
    item[key] = "";
  });
  item.matchedId = "";
}

function applyInventoryMatch(item, type, match) {
  if (!match) {
    clearInventoryDetails(item, type);
    return;
  }
  item.isCustom = false;
  item.matchedId = match.id || "";
  if (type === "weapons") {
    item.weaponType = match.weaponType || match.name || "";
    item.skill = match.skill || "";
    item.damage = match.damage || "";
    item.range = match.range || "";
    item.penetrate = match.penetrate || "";
    item.attacks = match.attacks || "";
    item.ammo = match.ammo || "";
    item.malfunction = match.malfunction || "";
    item.success = "";
    item.hard = "";
    item.extreme = "";
  }
  if (type === "armors") {
    item.armorType = match.armorType || "";
    item.armorValue = match.armorValue || "";
    item.movPenalty = match.movPenalty || "";
    item.coverage = match.coverage || "";
    item.species = match.species || "";
    item.special = match.pierceResistant || match.special || "";
    item.era = match.era || "";
    item.price = match.price || "";
  }
  if (type === "vehicles") {
    item.vehicleType = match.vehicleType || "";
    item.skill = match.skill || "";
    item.mov = match.mov || "";
    item.build = match.build || "";
    item.passengerArmor = match.passengerArmor || "";
    item.passengers = match.passengers || "";
    item.drivableBuild = match.drivableBuild || "";
    item.rideableBuild = match.rideableBuild || "";
    item.era = match.era || "";
  }
}
function syncInventoryMatch(item, type) {
  if (!item || type === "others") return;
  const value = item[getInventoryNameField(type)] || item.name || "";
  const match = findInventoryMatch(type, value);
  if (!match) {
    item.matchedId = "";
    return;
  }
  if (item.matchedId !== match.id) applyInventoryMatch(item, type, match);
}

function isInventoryItemValid(item, type) {
  if (!item) return false;
  if (type === "others") return Boolean(String(item.name || "").trim());
  if (["weapons", "armors", "vehicles"].includes(type)) return Boolean(String(item.name || item[getInventoryNameField(type)] || "").trim());
  if (itemCustomFlag(item)) return Boolean(String(item[getInventoryNameField(type)] || item.name || "").trim());
  return Boolean(item.matchedId && findInventoryMatch(type, item[getInventoryNameField(type)] || item.name));
}

function inventoryInput(field, value, placeholder, options = {}) {
  const inputType = options.inputType || "text";
  const mode = inputType === "number" ? ' type="number" inputmode="numeric" min="0"' : ' type="text"';
  const readonly = options.readonly ? ' readonly aria-readonly="true"' : "";
  const list = options.list ? ` list="${options.list}"` : "";
  const className = options.className ? ` class="${options.className}"` : "";
  return `<input data-item-field="${field}"${mode}${list}${className}${readonly} value="${escapeHTML(value || "")}" autocomplete="off" />`;
}

function isInventoryDetailReadonly(item, type) {
  if (["weapons", "armors", "vehicles"].includes(type)) return Boolean(item && item.matchedId && findInventoryMatch(type, item[getInventoryNameField(type)]));
  return !itemCustomFlag(item);
}

function inventoryDetail(label, field, value, item, type, inputType = "text") {
  return `<label class="inventory-field"><span>${escapeHTML(label)}</span>${inventoryInput(field, value, label, {
    inputType,
    readonly: isInventoryDetailReadonly(item, type)
  })}</label>`;
}

function inventoryNameField(label, field, value, listId, className = "inventory-name-input") {
  return `<label class="inventory-field inventory-name-cell"><span>${escapeHTML(label)}</span>${inventoryInput(field, value, label, {
    list: listId,
    className
  })}</label>`;
}

function inventoryTypeOptionValues(field, currentValue) {
  const type = field === "weaponType" ? "weapons" : field === "armorType" ? "armors" : "vehicles";
  const database = type === "armors" ? getInventoryDatabase(type).filter(isHumanUsableArmor) : getInventoryDatabase(type);
  const values = database.map((item) => item[field] || item.name || "").filter(Boolean);
  const unique = [...new Set(values)];
  const current = String(currentValue || "").trim();
  if (current && !unique.includes(current)) unique.unshift(current);
  return unique;
}

function inventoryTypeField(item, field) {
  const readonly = itemCustomFlag(item) ? "" : "readonly";
  return `<label class="inventory-field inventory-type-cell"><span>类型</span><div class="inventory-type-control"><input class="inventory-name-input inventory-type-input" data-item-field="${field}" type="text" autocomplete="off" value="${escapeHTML(item[field] || "")}" ${readonly} /><button class="inventory-type-picker-btn" type="button" data-open-type-picker aria-label="选择类型">\u25BE</button></div></label>`;
}

function inventorySelect(field, value, options) {
  return `<select data-item-field="${field}">${options.map((option) => `<option value="${escapeHTML(option)}" ${String(value || "") === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}</select>`;
}
function inventorySelectField(label, field, value, options) {
  return `<label class="inventory-field"><span>${escapeHTML(label)}</span>${inventorySelect(field, value, options)}</label>`;
}
function inventoryCustomToggle(item) {
  return `<label class="inventory-field inventory-custom-toggle"><span>自定义</span><input type="checkbox" data-item-custom ${itemCustomFlag(item) ? "checked" : ""} /></label>`;
}

function inventoryMatchHint(item, type) {
  if (type === "others" || itemCustomFlag(item)) return `<div class="inventory-field inventory-hint-cell"><span>注释</span><strong>自定义项目</strong></div>`;
  const value = item[getInventoryNameField(type)] || item.name || "";
  if (!String(value).trim()) return `<div class="inventory-field inventory-hint-cell"><span>注释</span><strong>请输入名称并选择精确匹配项</strong></div>`;
  if (!isInventoryItemValid(item, type)) return `<div class="inventory-field inventory-hint-cell is-warning"><span>注释</span><strong>未匹配，请勾选自定义</strong></div>`;
  return `<div class="inventory-field inventory-hint-cell is-valid"><span>注释</span><strong>已匹配规则库</strong></div>`;
}

function inventoryTableHeader(rowClass, labels) {
  return `<div class="inventory-table-head ${rowClass}">${labels.map((label) => `<span>${escapeHTML(label)}</span>`).join("")}</div>`;
}

function renderInventoryLists() {
  renderWeaponList();
  renderArmorList();
  renderOtherItemList();
}

function renderWeaponList() {
  const list = $("weaponArmorList");
  if (!list) return;
  if (!inventoryData.weapons.length) {
    list.innerHTML = `<div class="inventory-empty">暂未添加武器。</div>`;
    return;
  }
  inventoryData.weapons.forEach((item) => syncInventoryMatch(item, "weapons"));
  const rows = inventoryData.weapons.map((item) => `
    <section class="inventory-row weapon-row ${isInventoryItemValid(item, "weapons") ? "is-valid" : "is-unmatched"}${itemCustomFlag(item) ? " is-custom" : ""}" data-inventory-type="weapons" data-item-id="${item.id}">
      ${inventoryNameField("武器名称", "name", item.name)}
      ${inventoryTypeField(item, "weaponType")}
      ${inventoryDetail("使用技能", "skill", item.skill, item, "weapons")}
      ${inventoryDetail("伤害", "damage", item.damage, item, "weapons")}
      ${inventoryDetail("基础射程", "range", item.range, item, "weapons")}
      ${inventoryDetail("贯穿", "penetrate", item.penetrate, item, "weapons")}
      ${inventoryDetail("次数", "attacks", item.attacks, item, "weapons")}
      ${inventoryDetail("装弹量", "ammo", item.ammo, item, "weapons")}
      ${inventoryDetail("故障值", "malfunction", item.malfunction, item, "weapons")}
      <button class="inventory-delete" type="button" data-delete-item>删除</button>
    </section>
  `).join("");
  list.innerHTML = `
    <div class="inventory-table item-table weapon-table">
      ${inventoryTableHeader("weapon-row", ["武器名称", "类型", "使用技能", "伤害", "基础射程", "贯穿", "次数", "装弹量", "故障值", ""])}
      ${rows}
    </div>
  `;
}
function renderArmorList() {
  const list = $("armorList");
  if (!list) return;
  if (!inventoryData.armors.length) {
    list.innerHTML = `<div class="inventory-empty">暂未添加防具。</div>`;
    return;
  }
  inventoryData.armors.forEach((item) => syncInventoryMatch(item, "armors"));
  const rows = inventoryData.armors.map((item) => `
    <section class="inventory-row armor-row ${isInventoryItemValid(item, "armors") ? "is-valid" : "is-unmatched"}${itemCustomFlag(item) ? " is-custom" : ""}" data-inventory-type="armors" data-item-id="${item.id}">
      ${inventoryNameField("防具名称", "name", item.name)}
      ${inventoryTypeField(item, "armorType")}
      ${inventoryDetail("护甲值", "armorValue", item.armorValue, item, "armors", "number")}
      ${inventoryDetail("MOV惩罚", "movPenalty", item.movPenalty, item, "armors")}
      ${inventoryDetail("覆盖位置", "coverage", item.coverage, item, "armors")}
      ${inventoryDetail("防刺器", "special", item.special, item, "armors")}
      ${inventoryDetail("常见时代", "era", item.era, item, "armors")}
      ${inventoryDetail("价格20s/现代", "price", item.price, item, "armors")}
      <button class="inventory-delete" type="button" data-delete-item>删除</button>
    </section>
  `).join("");
  list.innerHTML = `
    <div class="inventory-table item-table armor-table">
      ${inventoryTableHeader("armor-row", ["防具名称", "类型", "护甲值", "MOV惩罚", "覆盖位置", "防刺器", "常见时代", "价格20s/现代", ""])}
      ${rows}
    </div>
  `;
}
function renderOtherItemList() {
  const list = $("otherItemList");
  if (!list) return;
  if (!inventoryData.others.length) {
    list.innerHTML = `<div class="inventory-empty">暂未添加其他物品。</div>`;
    return;
  }
  const rows = inventoryData.others.map((item) => `
    <section class="inventory-row other-item-row" data-inventory-type="others" data-item-id="${item.id}">
      ${inventoryNameField("物品名称", "name", item.name)}
      ${inventoryDetail("数量", "quantity", item.quantity, item, "others", "number")}
      ${inventorySelectField("部位", "location", item.location, ["颅", "躯", "服", "上肢", "下肢", "背包", "其他"])}
      ${inventorySelectField("状态", "status", item.status, ["显露", "隐藏", "自定义"])}
      <button class="inventory-delete" type="button" data-delete-item>删除</button>
    </section>
  `).join("");
  list.innerHTML = `
    <div class="inventory-table item-table other-table">
      ${inventoryTableHeader("other-item-row", ["物品名称", "数量", "部位", "状态", ""])}
      ${rows}
    </div>
  `;
}

function isHumanUsableArmor(item) {
  const species = String(item && item.species || "").trim();
  if (!species || species === "——") return false;
  if (species.includes("大象") || species.includes("深潜者") || species.includes("鳄鱼") || species === "剑") return false;
  return /人类|五指|双腿|有手/.test(species);
}

function ensureInventoryDatalists() {
  const armorOptions = getInventoryDatabase("armors").filter(isHumanUsableArmor);
  const configs = [
    ["weaponDatabaseOptions", getInventoryDatabase("weapons"), "weaponType"],
    ["armorDatabaseOptions", armorOptions, "armorType"],
    ["vehicleDatabaseOptions", getInventoryDatabase("vehicles"), "vehicleType"]
  ];
  configs.forEach(([id, database, field]) => {
    let el = $(id);
    if (!el) {
      el = document.createElement("datalist");
      el.id = id;
      document.body.appendChild(el);
    }
    el.innerHTML = database.map((item) => `<option value="${escapeHTML(item[field] || item.name || "")}"></option>`).join("");
  });
}

function getCreditRatingNumber() {
  const value = creditRatingValue ? Number(String(creditRatingValue.value || "").trim()) : 0;
  return Number.isFinite(value) ? Math.max(0, Math.min(99, value)) : 0;
}

function getEraAssetMode() {
  const value = getEraText();
  if (value.includes("现代")) return "modern";
  if (value.includes("1920")) return "1920s";
  return "other";
}

function getCurrencyUnit() {
  return "美元";
}

function getLifestyleInfo(cr) {
  if (cr <= 0) return {
    level: "身无分文",
    note: "连贫穷都够不上的人才能够叫做身无分文。住所：大概只有睡大街。旅行：步行，扒车或逃票上火车轮船。"
  };
  if (cr <= 9) return {
    level: "贫穷",
    note: "刚好买得起最廉价的屋顶，每天能够吃到一餐廉价食物。住所：最廉价的出租屋或睡袋旅馆。旅行：最便宜的公众运输方式。"
  };
  if (cr <= 49) return {
    level: "标准",
    note: "舒适的生活水平，一日三餐，偶尔下馆子。住所：普通的家或公寓。旅行：会使用普通的旅行方式。"
  };
  if (cr <= 89) return {
    level: "小康",
    note: "小康级别已经可以享受奢侈品的舒适了。住所：真材实料的住地，也许会有一些仆人。旅行：头等舱。"
  };
  if (cr <= 98) return {
    level: "富裕",
    note: "富裕级别就是享受超级奢侈品的时候了。住所：豪华住所和有着大量仆人的庭院。旅行：头等舱。"
  };
  return {
    level: "富豪",
    note: "与富裕差不多，但钱已经只是一个代号了。你将是世界上最富有的人。"
  };
}

function calculateAssetMoney(cr) {
  const mode = getEraAssetMode();
  if (mode === "other") return { spending: "——", cash: "——", otherAssets: "——" };
  if (mode === "modern") {
    if (cr <= 0) return { spending: 10, cash: 10, otherAssets: "没有" };
    if (cr <= 9) return { spending: 40, cash: cr * 20, otherAssets: cr * 200 };
    if (cr <= 49) return { spending: 200, cash: cr * 40, otherAssets: cr * 1000 };
    if (cr <= 89) return { spending: 1000, cash: cr * 100, otherAssets: cr * 10000 };
    if (cr <= 98) return { spending: 5000, cash: cr * 400, otherAssets: cr * 40000 };
    return { spending: 100000, cash: 1000000, otherAssets: 100000000 };
  }
  if (cr <= 0) return { spending: 0.5, cash: 0.5, otherAssets: "没有" };
  if (cr <= 9) return { spending: 2, cash: cr, otherAssets: cr * 10 };
  if (cr <= 49) return { spending: 10, cash: cr * 2, otherAssets: cr * 50 };
  if (cr <= 89) return { spending: 50, cash: cr * 5, otherAssets: cr * 500 };
  if (cr <= 98) return { spending: 250, cash: cr * 20, otherAssets: cr * 2000 };
  return { spending: 5000, cash: 50000, otherAssets: 5000000 };
}

function trimNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function formatAssetAmount(value) {
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 100000000) return trimNumber(value / 100000000) + "亿";
  if (Math.abs(value) >= 10000) return trimNumber(value / 10000) + "万";
  return trimNumber(value);
}

function getOtherAssetManualTotal() {
  return ["assetVehicleValue", "assetResidenceValue", "assetLuxuryValue", "assetStockValue", "assetOtherValue"]
    .reduce((sum, id) => sum + parsePointValue($(id) ? $(id).value : ""), 0);
}

function updateAssetCalculations() {
  if (!$("assetCreditDisplay")) return;
  const cr = getCreditRatingNumber();
  const lifestyle = getLifestyleInfo(cr);
  const money = calculateAssetMoney(cr);
  const otherAssetsValue = typeof money.otherAssets === "number" ? money.otherAssets : 0;
  const manualTotal = getOtherAssetManualTotal();
  const remaining = otherAssetsValue - manualTotal;
  $("assetCreditDisplay").textContent = String(cr);
  $("assetLifestyleDisplay").textContent = lifestyle.level;
  $("assetSpendingDisplay").textContent = formatAssetAmount(money.spending);
  $("assetOtherDisplay").textContent = formatAssetAmount(money.otherAssets);
  $("assetCashDisplay").textContent = formatAssetAmount(money.cash);
  $("assetUnitDisplay").textContent = getCurrencyUnit();
  $("assetLifestyleNote").textContent = lifestyle.note;
  $("assetTotalHint").textContent = `资产总和：${formatAssetAmount(manualTotal)}　剩余资产值：${formatAssetAmount(remaining)}`;
}

function collectFields(ids) {
  const result = {};
  ids.forEach((id) => {
    const el = $(id);
    if (el) result[id] = el.value;
  });
  return result;
}

function restoreFields(values) {
  Object.entries(values || {}).forEach(([id, value]) => {
    const el = $(id);
    if (el) el.value = value;
  });
}

function collectBackgroundData() {
  const result = {};
  backgroundFields.forEach((field) => {
    result[field.id] = {
      text: $(field.id) ? $(field.id).value : "",
      key: $(field.id + "Key") ? $(field.id + "Key").checked : false
    };
  });
  return result;
}

function restoreBackgroundData(values) {
  backgroundFields.forEach((field) => {
    const data = values && values[field.id] ? values[field.id] : {};
    if ($(field.id)) $(field.id).value = data.text || "";
    if ($(field.id + "Key")) $(field.id + "Key").checked = Boolean(data.key);
  });
}

function getInventoryTypePicker() {
  let picker = $("inventoryTypePicker");
  if (picker) return picker;
  picker = document.createElement("div");
  picker.id = "inventoryTypePicker";
  picker.className = "inventory-type-picker";
  picker.hidden = true;
  document.body.appendChild(picker);
  return picker;
}

function closeInventoryTypePicker() {
  const picker = $("inventoryTypePicker");
  if (picker) picker.hidden = true;
}

function openInventoryTypePicker(row) {
  if (!row) return;
  const type = row.dataset.inventoryType;
  if (!["weapons", "armors"].includes(type)) return;
  const collection = inventoryData[type];
  const item = collection && collection.find((entry) => entry.id === row.dataset.itemId);
  if (!item) return;
  const field = getInventoryNameField(type);
  const picker = getInventoryTypePicker();
  const options = inventoryTypeOptionValues(field, item[field]);
  picker.dataset.inventoryType = type;
  picker.dataset.itemId = item.id;
  picker.innerHTML = `
    <div class="inventory-type-picker-card" role="dialog" aria-label="选择类型">
      <div class="inventory-type-picker-head"><strong>选择类型</strong><button type="button" data-close-type-picker>关闭</button></div>
      <div class="inventory-type-picker-search"><input type="search" data-type-picker-search placeholder="搜索类型" autocomplete="off" /></div>
      <div class="inventory-type-picker-list">
        <button type="button" data-type-option="__custom__" data-type-label="自定义">自定义</button>
        ${options.map((option) => `<button type="button" data-type-option="${escapeHTML(option)}" data-type-label="${escapeHTML(option)}">${escapeHTML(option)}</button>`).join("")}
      </div>
    </div>
  `;
  picker.hidden = false;
}

function applyInventoryTypeChoice(type, itemId, value) {
  const collection = inventoryData[type];
  const item = collection && collection.find((entry) => entry.id === itemId);
  if (!item) return;
  const field = getInventoryNameField(type);
  if (value === "__custom__") {
    item.isCustom = true;
    item.matchedId = "";
    item[field] = "";
    clearInventoryDetails(item, type);
  } else {
    item.isCustom = false;
    item[field] = value;
    applyInventoryMatch(item, type, findInventoryMatch(type, value));
  }
  closeInventoryTypePicker();
  renderInventoryLists();
  persist();
}

function handleInventoryTypePickerSearch(event) {
  const input = event.target.closest("[data-type-picker-search]");
  if (!input) return;
  const keyword = input.value.trim().toLowerCase();
  const picker = input.closest(".inventory-type-picker");
  picker.querySelectorAll("[data-type-option]").forEach((button) => {
    if (button.dataset.typeOption === "__custom__") {
      button.hidden = false;
      return;
    }
    const text = String(button.dataset.typeLabel || button.textContent || "").toLowerCase();
    button.hidden = Boolean(keyword && !text.includes(keyword));
  });
}
function handleInventoryTypePickerClick(event) {
  handleInventoryTypePickerSearch(event);
  const openButton = event.target.closest("[data-open-type-picker]");
  if (openButton) {
    openInventoryTypePicker(openButton.closest(".inventory-row"));
    return;
  }
  const closeButton = event.target.closest("[data-close-type-picker]");
  if (closeButton || event.target.id === "inventoryTypePicker") {
    closeInventoryTypePicker();
    return;
  }
  const optionButton = event.target.closest("[data-type-option]");
  if (!optionButton) return;
  const picker = $("inventoryTypePicker");
  applyInventoryTypeChoice(picker.dataset.inventoryType, picker.dataset.itemId, optionButton.dataset.typeOption);
}
function handleInventoryTypeFocus(event) {
  const input = event.target.closest(".inventory-type-input");
  if (!input || input.readOnly || Object.prototype.hasOwnProperty.call(input.dataset, "restoreValue")) return;
  const value = input.value;
  if (!value.trim()) return;
  input.dataset.restoreValue = value;
  input.value = "";
}

function handleInventoryTypeBlur(event) {
  const input = event.target.closest(".inventory-type-input");
  if (!input || !Object.prototype.hasOwnProperty.call(input.dataset, "restoreValue")) return;
  if (!input.value.trim()) input.value = input.dataset.restoreValue;
  delete input.dataset.restoreValue;
}

function handleInventoryInput(event) {
  const row = event.target.closest(".inventory-row");
  if (!row) return;
  const type = row.dataset.inventoryType;
  const collection = inventoryData[type];
  const item = collection && collection.find((entry) => entry.id === row.dataset.itemId);
  if (!item) return;
  const field = event.target.dataset.itemField;
  if (!field) return;
  const isTypeField = type !== "others" && field === getInventoryNameField(type);
  item[field] = event.target.value;
  if (isTypeField && itemCustomFlag(item)) {
    item.matchedId = "";
    persist();
    return;
  }

  if (isTypeField) {
    item.isCustom = false;
    const match = findInventoryMatch(type, event.target.value);
    if (match) {
      applyInventoryMatch(item, type, match);
      renderInventoryLists();
    } else if (event.type === "change") {
      clearInventoryDetails(item, type);
      renderInventoryLists();
    } else {
      item.matchedId = "";
    }
  }
  persist();
}

function handleInventoryCustomChange(event) {
  const checkbox = event.target.closest("[data-item-custom]");
  if (!checkbox) return;
  const row = checkbox.closest(".inventory-row");
  if (!row) return;
  const type = row.dataset.inventoryType;
  const collection = inventoryData[type];
  const item = collection && collection.find((entry) => entry.id === row.dataset.itemId);
  if (!item) return;
  item.isCustom = checkbox.checked;
  if (item.isCustom) {
    item.matchedId = "";
  } else {
    applyInventoryMatch(item, type, findInventoryMatch(type, item[getInventoryNameField(type)] || item.name));
  }
  renderInventoryLists();
  persist();
}

function handleInventoryDelete(event) {
  const button = event.target.closest("[data-delete-item]");
  if (!button) return;
  const row = button.closest(".inventory-row");
  if (!row) return;
  const type = row.dataset.inventoryType;
  inventoryData[type] = inventoryData[type].filter((entry) => entry.id !== row.dataset.itemId);
  renderInventoryLists();
  persist();
}

function initBackgroundItems() {
  renderBackgroundGrid();
  ensureInventoryDatalists();

  $("resetItemsBtn").addEventListener("click", () => {
    if (!confirm("确定清空背景物品页的内容吗？")) return;
    assetFieldIds.forEach((id) => {
      const el = $(id);
      if (el) el.value = "";
    });
    backgroundFields.forEach((field) => {
      if ($(field.id)) $(field.id).value = "";
      if ($(field.id + "Key")) $(field.id + "Key").checked = false;
    });
    inventoryData = { weapons: [], armors: [], vehicles: [], others: [] };
    renderInventoryLists();
    updateAssetCalculations();
    persist();
    showStatus("itemsStatus", "已清空本页内容。");
  });

  assetFieldIds.forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", () => {
      updateAssetCalculations();
      persist();
    });
  });

  $("backgroundGrid").addEventListener("input", () => persist());
  $("backgroundGrid").addEventListener("change", () => persist());

  $("addWeaponItem").addEventListener("click", () => {
    inventoryData.weapons.push(createInventoryItem("weapons"));
    renderWeaponList();
    persist();
  });

  $("addArmorItem").addEventListener("click", () => {
    inventoryData.armors.push(createInventoryItem("armors"));
    renderArmorList();
    persist();
  });


  $("addOtherItem").addEventListener("click", () => {
    inventoryData.others.push(createInventoryItem("others"));
    renderOtherItemList();
    persist();
  });

  ["weaponArmorList", "armorList", "otherItemList"].forEach((id) => {
    const list = $(id);
    if (!list) return;
    list.addEventListener("input", handleInventoryInput);
    list.addEventListener("change", handleInventoryInput);
    list.addEventListener("change", handleInventoryCustomChange);
    list.addEventListener("click", handleInventoryDelete);
  });
  document.addEventListener("click", handleInventoryTypePickerClick);
  document.addEventListener("input", handleInventoryTypePickerSearch);
}
