function renderBackgroundGrid() {
  const grid = $("backgroundGrid");
  if (!grid) return;
  grid.innerHTML = backgroundFields.map((field) => `
    <section class="background-card">
      <div class="background-card-head">
        <strong>${field.label}</strong>
        <label for="${field.id}Key"><input id="${field.id}Key" type="checkbox" data-background-key="${field.id}" /> 关键</label>
      </div>
      <textarea id="${field.id}" data-background-field="${field.id}"></textarea>
    </section>
  `).join("");
}

function normalizeInventoryItem(item, fallbackType) {
  return {
    id: item && item.id ? String(item.id) : String(Date.now()) + "-" + Math.random().toString(16).slice(2),
    preset: item && item.preset ? String(item.preset) : "",
    name: item && item.name ? String(item.name) : "",
    quantity: item && item.quantity ? String(item.quantity) : "1",
    type: fallbackType
  };
}

function createInventoryItem(type) {
  return normalizeInventoryItem({ quantity: "1" }, type);
}

function renderInventoryLists() {
  renderWeaponArmorList();
  renderOtherItemList();
}

function renderWeaponArmorList() {
  const list = $("weaponArmorList");
  if (!list) return;
  if (!inventoryData.weapons.length) {
    list.innerHTML = `<div class="inventory-empty">暂未添加武器防具。</div>`;
    return;
  }
  list.innerHTML = inventoryData.weapons.map((item) => `
    <section class="inventory-row weapon-row" data-inventory-type="weapons" data-item-id="${item.id}">
      <select data-item-field="preset" aria-label="武器防具类型">
        <option value="">选择类型</option>
        ${weaponArmorOptions.map((option) => `<option value="${escapeHTML(option)}" ${item.preset === option ? "selected" : ""}>${escapeHTML(option)}</option>`).join("")}
      </select>
      <input data-item-field="name" type="text" value="${escapeHTML(item.name)}" placeholder="名称" autocomplete="off" />
      <input data-item-field="quantity" type="number" inputmode="numeric" min="0" value="${escapeHTML(item.quantity)}" placeholder="数量" />
      <button class="inventory-delete" type="button" data-delete-item>删除</button>
    </section>
  `).join("");
}

function renderOtherItemList() {
  const list = $("otherItemList");
  if (!list) return;
  if (!inventoryData.others.length) {
    list.innerHTML = `<div class="inventory-empty">暂未添加其他物品。</div>`;
    return;
  }
  list.innerHTML = inventoryData.others.map((item) => `
    <section class="inventory-row" data-inventory-type="others" data-item-id="${item.id}">
      <input data-item-field="name" type="text" value="${escapeHTML(item.name)}" placeholder="物品名称" autocomplete="off" />
      <input data-item-field="quantity" type="number" inputmode="numeric" min="0" value="${escapeHTML(item.quantity)}" placeholder="数量" />
      <button class="inventory-delete" type="button" data-delete-item>删除</button>
    </section>
  `).join("");
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
  $("assetCreditDisplay").textContent = `${cr}%/${Math.floor(cr / 2)}%/${Math.floor(cr / 5)}%`;
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

function handleInventoryInput(event) {
  const row = event.target.closest(".inventory-row");
  if (!row) return;
  const collection = inventoryData[row.dataset.inventoryType];
  const item = collection && collection.find((entry) => entry.id === row.dataset.itemId);
  if (!item) return;
  const field = event.target.dataset.itemField;
  if (!field) return;
  item[field] = event.target.value;
  if (field === "preset" && event.target.value && event.target.value !== "自定义") {
    item.name = event.target.value;
    renderInventoryLists();
  }
  if (field === "preset" && event.target.value === "自定义" && item.name === item.preset) {
    item.name = "";
    renderInventoryLists();
  }
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

  $("resetItemsBtn").addEventListener("click", () => {
    if (!confirm("确定清空背景&物品页的内容吗？")) return;
    assetFieldIds.forEach((id) => {
      const el = $(id);
      if (el) el.value = "";
    });
    backgroundFields.forEach((field) => {
      if ($(field.id)) $(field.id).value = "";
      if ($(field.id + "Key")) $(field.id + "Key").checked = false;
    });
    inventoryData = { weapons: [], others: [] };
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
    renderWeaponArmorList();
    persist();
  });

  $("addOtherItem").addEventListener("click", () => {
    inventoryData.others.push(createInventoryItem("others"));
    renderOtherItemList();
    persist();
  });

  $("weaponArmorList").addEventListener("input", handleInventoryInput);
  $("weaponArmorList").addEventListener("change", handleInventoryInput);
  $("weaponArmorList").addEventListener("click", handleInventoryDelete);
  $("otherItemList").addEventListener("input", handleInventoryInput);
  $("otherItemList").addEventListener("click", handleInventoryDelete);
}

