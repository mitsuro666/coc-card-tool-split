function normalizeImageData(data) {
  return {
    avatar: data && typeof data.avatar === "string" ? data.avatar : "",
    portrait: data && typeof data.portrait === "string" ? data.portrait : "",
    custom: Array.isArray(data && data.custom)
      ? data.custom.map(normalizeCustomImage).filter(Boolean)
      : []
  };
}

function normalizeCustomImage(item) {
  if (!item || typeof item !== "object") return null;
  return {
    id: item.id ? String(item.id) : createImageId(),
    name: item.name ? String(item.name) : "",
    dataUrl: item.dataUrl && typeof item.dataUrl === "string" ? item.dataUrl : ""
  };
}

function createImageId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}

function getImagePlaceholder(text) {
  return `<div class="image-placeholder">${escapeHTML(text)}</div>`;
}

function renderFixedImage(slot) {
  const previewId = slot === "avatar" ? "avatarPreview" : "portraitPreview";
  const preview = $(previewId);
  if (!preview) return;
  const label = slot === "avatar" ? "未上传头像" : "未上传立绘";
  preview.innerHTML = imageData[slot]
    ? `<img src="${imageData[slot]}" alt="${slot === "avatar" ? "头像" : "立绘"}" />`
    : getImagePlaceholder(label);
}

function renderCustomImages() {
  const list = $("customImageList");
  if (!list) return;
  if (!imageData.custom.length) {
    list.innerHTML = `<div class="inventory-empty">暂未添加自定义图片。</div>`;
    return;
  }

  list.innerHTML = imageData.custom.map((item) => `
    <section class="custom-image-row" data-custom-image-id="${escapeHTML(item.id)}">
      <div class="custom-image-preview">
        ${item.dataUrl ? `<img src="${item.dataUrl}" alt="${escapeHTML(item.name || "自定义图片")}" />` : getImagePlaceholder("未上传")}
      </div>
      <div class="custom-image-fields">
        <label>
          <span>名称</span>
          <input data-custom-image-name type="text" value="${escapeHTML(item.name)}" autocomplete="off" />
        </label>
        <div class="image-actions">
          <label class="image-file-button">
            选择图片
            <input class="image-file-input" type="file" accept="image/*" data-custom-image-file />
          </label>
          <button class="ghost small" type="button" data-clear-custom-image>移除图片</button>
          <button class="inventory-delete" type="button" data-delete-custom-image>删除</button>
        </div>
      </div>
    </section>
  `).join("");
}

function renderImagePage() {
  imageData = normalizeImageData(imageData);
  renderFixedImage("avatar");
  renderFixedImage("portrait");
  renderCustomImages();
}

function resizeImage(dataUrl, fileType) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const maxSide = 1100;
      const ratio = Math.min(1, maxSide / Math.max(image.width, image.height));
      if (ratio >= 1 && dataUrl.length < 650000) {
        resolve(dataUrl);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * ratio));
      canvas.height = Math.max(1, Math.round(image.height * ratio));
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const outputType = fileType === "image/png" && dataUrl.length < 900000 ? "image/png" : "image/jpeg";
      resolve(canvas.toDataURL(outputType, 0.84));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      reject(new Error("请选择图片文件。"));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        resolve(await resizeImage(String(reader.result || ""), file.type));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("图片读取失败。"));
    reader.readAsDataURL(file);
  });
}

async function handleImageFile(file, onReady) {
  try {
    const dataUrl = await readImageFile(file);
    onReady(dataUrl);
    renderImagePage();
    persist();
    showStatus("imageStatus", "图片已保存。");
  } catch (error) {
    showStatus("imageStatus", error.message || "图片读取失败。", true);
  }
}

function findCustomImage(row) {
  if (!row) return null;
  return imageData.custom.find((item) => item.id === row.dataset.customImageId) || null;
}

function getFinalSkillItems() {
  if (typeof getAllSkills !== "function" || typeof getSkillTotal !== "function") return [];
  return getAllSkills().slice().sort((a, b) => {
    const totalDiff = getSkillTotal(b) - getSkillTotal(a);
    return totalDiff || sortPreviewSkills(a, b);
  });
}

function finalText(value, fallback = "未填写") {
  const text = String(value ?? "").trim();
  return text ? text : fallback;
}

function renderFinalImage(src, label, className = "") {
  return `
    <figure class="final-image ${className}">
      <div>${src ? `<img src="${src}" alt="${escapeHTML(label)}" />` : `<span>${escapeHTML(label)}未上传</span>`}</div>
      <figcaption>${escapeHTML(label)}</figcaption>
    </figure>
  `;
}

function renderFinalPairs(items) {
  return items.map((item) => `
    <div class="final-readonly-cell">
      <span>${escapeHTML(item.label)}</span>
      <strong>${escapeHTML(item.value)}</strong>
    </div>
  `).join("");
}

function renderFinalSection(title, body, extraClass = "") {
  return `
    <section class="final-section ${extraClass}">
      <h3>${escapeHTML(title)}</h3>
      ${body}
    </section>
  `;
}


function drawFinalRadar(canvas, items, options = {}) {
  if (!canvas || !items.length) return;
  const cssWidth = Math.max(260, Math.round(canvas.getBoundingClientRect().width || 320));
  const cssHeight = Math.max(220, Math.round(canvas.getBoundingClientRect().height || 240));
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  const cx = cssWidth / 2;
  const cy = cssHeight / 2 + 8;
  const radius = Math.min(cssWidth, cssHeight) * 0.3;
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
    String(item.label).split("\n").forEach((line, lineIndex, lines) => {
      ctx.fillText(line, label.x, label.y + (lineIndex - (lines.length - 1) / 2) * 14);
    });
  });
  if (!items.some((item) => item.value > 0)) return;
  ctx.beginPath();
  items.forEach((item, index) => {
    const point = pointAt(index, radius * Math.max(0, Math.min(1, item.value)));
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = options.fill || "rgba(47, 95, 143, .68)";
  ctx.strokeStyle = options.stroke || "#2f5f8f";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

function renderFinalRadarCharts() {
  return renderFinalSection("能力图表", `
    <div class="final-radar-grid">
      <div class="final-radar-card"><h4>九宫格属性</h4><canvas id="finalAttributeRadarCanvas" width="320" height="240"></canvas></div>
      <div class="final-radar-card"><h4>技能倾向</h4><canvas id="finalSkillRadarCanvas" width="320" height="240"></canvas></div>
    </div>
  `);
}

function renderFinalRadarCanvases() {
  const attributeItems = getRadarAttributes().map((item) => ({ label: item.label, value: Math.max(0, Math.min(1, (parseAttributeValue(item.id) || 0) / 100)) }));
  const skillRadarValues = typeof calculateSkillRadarValues === "function" ? calculateSkillRadarValues() : [];
  const maxSkillRatio = Math.max(...skillRadarValues.map((entry) => entry.ratio), 0);
  const skillAxisMax = maxSkillRatio > 0 ? Math.max(0.2, Math.ceil(maxSkillRatio * 10) / 10) : 1;
  const skillItems = skillRadarValues.map((item) => ({ label: item.label, value: Math.min(1, item.ratio / skillAxisMax) }));
  drawFinalRadar($("finalAttributeRadarCanvas"), attributeItems, { fill: "rgba(47, 95, 143, .68)", stroke: "#2f5f8f" });
  drawFinalRadar($("finalSkillRadarCanvas"), skillItems, { fill: "rgba(80, 145, 199, .72)", stroke: "#2f6fa7" });
}
function getSkillPointSummary() {
  const selectedOccupation = findSelectedOccupation();
  const creditUsed = creditRatingValue ? parsePointValue(creditRatingValue.value) : 0;
  const careerUsed = getAllSkills().reduce((sum, skill) => sum + parsePointValue(getSkillState(skill.id).career), 0) + creditUsed;
  const interestUsed = getAllSkills().reduce((sum, skill) => sum + parsePointValue(getSkillState(skill.id).interest), 0);
  const careerTarget = selectedOccupation ? evaluateOccupationPointFormula(selectedOccupation.skillPointFormulaExcel) : null;
  const interestTarget = (parseAttributeValue("attrINT") || 0) * 2;
  return [
    { label: "职业点数", value: `${careerUsed} / ${careerTarget === null ? "未计算" : careerTarget}` },
    { label: "兴趣点数", value: `${interestUsed} / ${interestTarget || "未计算"}` },
    { label: "信用评级", value: String(getCreditRatingNumber()) }
  ];
}

function renderFinalSkills() {
  const skills = getFinalSkillItems();
  if (!skills.length) return `<div class="final-empty">暂无技能。</div>`;
  return `<div class="final-skill-grid">${skills.map((skill) => `
    <div class="final-skill-item">
      <span>${escapeHTML(getSkillDisplayName(skill) || skill.name)}</span>
      <strong>${getSkillTotal(skill)}</strong>
    </div>
  `).join("")}</div>`;
}

function renderFinalBackground() {
  const items = backgroundFields.map((field) => {
    const text = finalText($(field.id) ? $(field.id).value : "", "未填写");
    const key = $(field.id + "Key") && $(field.id + "Key").checked ? "关键" : "";
    return `
      <div class="final-note-item${field.id === "backgroundExtra" ? " wide" : ""}">
        <strong>${escapeHTML(field.label)}${key ? `<em>${key}</em>` : ""}</strong>
        <p>${escapeHTML(text)}</p>
      </div>
    `;
  }).join("");
  return `<div class="final-note-grid">${items}</div>`;
}

function renderFinalInventoryList(items, emptyText, labelGetter, valueGetter, type = "others") {
  const visibleItems = type === "others" ? items : items.filter((item) => isInventoryItemValid(item, type));
  if (!visibleItems.length) return `<div class="final-empty">${escapeHTML(emptyText)}</div>`;
  return `<div class="final-item-list">${visibleItems.map((item) => `
    <div><span>${escapeHTML(finalText(labelGetter(item), "未命名"))}</span><strong>${escapeHTML(finalText(valueGetter(item), "—"))}</strong></div>
  `).join("")}</div>`;
}

function renderFinalEquipmentList() {
  const weapons = (inventoryData.weapons || [])
    .filter((item) => isInventoryItemValid(item, "weapons"))
    .map((item) => ({ name: item.name, value: item.damage || item.skill || item.attacks }));
  const armors = (inventoryData.armors || [])
    .filter((item) => isInventoryItemValid(item, "armors"))
    .map((item) => ({ name: item.name, value: item.armorValue ? `护甲值 ${item.armorValue}` : item.coverage }));
  const items = [...weapons, ...armors];
  if (!items.length) return `<div class="final-empty">暂未添加武器防具。</div>`;
  return `<div class="final-item-list">${items.map((item) => `
    <div><span>${escapeHTML(finalText(item.name, "未命名"))}</span><strong>${escapeHTML(finalText(item.value, "—"))}</strong></div>
  `).join("")}</div>`;
}
function renderFinalCustomImages() {
  const customImages = imageData.custom.filter((item) => item.dataUrl || item.name.trim());
  if (!customImages.length) return "";
  return renderFinalSection("自定义图片", `<div class="final-custom-images">${customImages.map((item) => renderFinalImage(item.dataUrl, finalText(item.name, "自定义图片"), "custom")).join("")}</div>`);
}

function renderFinalSummary() {
  const summary = $("finalSummary");
  if (!summary) return;
  updateAssetCalculations();
  const cr = getCreditRatingNumber();
  const lifestyle = getLifestyleInfo(cr);
  const money = calculateAssetMoney(cr);
  const otherAssetsValue = typeof money.otherAssets === "number" ? money.otherAssets : 0;
  const manualTotal = getOtherAssetManualTotal();
  const remaining = otherAssetsValue - manualTotal;

  const basicItems = [
    { label: "姓名", value: finalText($("investigatorName").value) },
    { label: "玩家", value: finalText($("playerName").value) },
    { label: "职业", value: finalText($("occupation").value) },
    { label: "年龄", value: finalText($("age").value) },
    { label: "性别", value: finalText($("gender").value) },
    { label: "住地", value: finalText($("residence").value) },
    { label: "时代", value: getEraText() },
    { label: "故乡", value: finalText($("birthplace").value) },
    { label: "发生地", value: finalText($("storyLocation") ? $("storyLocation").value : "") },
    { label: "现时间", value: getCurrentTimeText() }
  ];

  const attributeItems = attributes.map((attribute) => ({
    label: `${attribute.name} ${attribute.key}`,
    value: formatAttributeValue(attribute.id)
  }));
  const secondaryItems = calculateSecondaryAttributes().map((item) => ({
    label: item.label,
    value: formatDerivedValue(item.value)
  }));
  const assetItems = [
    { label: "信用评级", value: `${cr}%/${Math.floor(cr / 2)}%/${Math.floor(cr / 5)}%` },
    { label: "生活水平", value: lifestyle.level },
    { label: "消费水平", value: formatAssetAmount(money.spending) },
    { label: "当前现金", value: formatAssetAmount(money.cash) },
    { label: "其他资产", value: formatAssetAmount(money.otherAssets) },
    { label: "剩余资产值", value: formatAssetAmount(remaining) },
    { label: "单位", value: getCurrencyUnit() },
    { label: "资产详情", value: finalText($("assetDetailNote").value, "未填写") }
  ];

  summary.innerHTML = `
    <div class="final-profile-hero">
      <div class="final-main-images">
        ${renderFinalImage(imageData.avatar, "头像", "avatar")}
        ${renderFinalImage(imageData.portrait, "立绘", "portrait")}
      </div>
      <div class="final-readonly-grid basic">${renderFinalPairs(basicItems)}</div>
    </div>
    ${renderFinalCustomImages()}
    ${renderFinalSection("属性", `<div class="final-readonly-grid attributes">${renderFinalPairs(attributeItems)}</div>`)}
    ${renderFinalSection("次要属性", `<div class="final-readonly-grid secondary-values">${renderFinalPairs(secondaryItems)}</div>`)}
    ${renderFinalSection("技能点数", `<div class="final-readonly-grid skill-points">${renderFinalPairs(getSkillPointSummary())}</div>${renderFinalSkills()}`)}
    ${renderFinalRadarCharts()}
    ${renderFinalSection("资产情况", `<div class="final-readonly-grid assets">${renderFinalPairs(assetItems)}</div><div class="final-note-item wide"><strong>生活评价</strong><p>${escapeHTML(lifestyle.note)}</p></div>`)}
    ${renderFinalSection("背景故事", renderFinalBackground())}
    ${renderFinalSection("随身物品", `
      <div class="final-inventory-grid">
        <section><h4>武器防具</h4>${renderFinalEquipmentList()}</section>
        <section><h4>随身物品</h4>${renderFinalInventoryList(inventoryData.others || [], "暂未添加随身物品。", (item) => item.name, (item) => item.quantity || "1")}</section>
      </div>
    `)}
  `;
  renderFinalRadarCanvases();
}
function initImages() {
  imageData = normalizeImageData(imageData);
  renderImagePage();

  $("imagePage").addEventListener("change", (event) => {
    const fixedSlot = event.target.dataset.imageInput;
    if (fixedSlot) {
      const file = event.target.files && event.target.files[0];
      handleImageFile(file, (dataUrl) => {
        imageData[fixedSlot] = dataUrl;
      });
      event.target.value = "";
      return;
    }

    if (event.target.matches("[data-custom-image-file]")) {
      const item = findCustomImage(event.target.closest(".custom-image-row"));
      const file = event.target.files && event.target.files[0];
      if (!item) return;
      handleImageFile(file, (dataUrl) => {
        item.dataUrl = dataUrl;
      });
      event.target.value = "";
    }
  });

  $("customImageList").addEventListener("input", (event) => {
    if (!event.target.matches("[data-custom-image-name]")) return;
    const item = findCustomImage(event.target.closest(".custom-image-row"));
    if (!item) return;
    item.name = event.target.value;
    persist();
  });

  $("imagePage").addEventListener("click", (event) => {
    const clearSlot = event.target.closest("[data-clear-image]");
    if (clearSlot) {
      imageData[clearSlot.dataset.clearImage] = "";
      renderImagePage();
      persist();
      return;
    }

    const clearCustom = event.target.closest("[data-clear-custom-image]");
    if (clearCustom) {
      const item = findCustomImage(clearCustom.closest(".custom-image-row"));
      if (!item) return;
      item.dataUrl = "";
      renderImagePage();
      persist();
      return;
    }

    const deleteCustom = event.target.closest("[data-delete-custom-image]");
    if (deleteCustom) {
      const row = deleteCustom.closest(".custom-image-row");
      imageData.custom = imageData.custom.filter((item) => item.id !== row.dataset.customImageId);
      renderCustomImages();
      persist();
    }
  });

  $("addCustomImageBtn").addEventListener("click", () => {
    imageData.custom.push({ id: createImageId(), name: "", dataUrl: "" });
    renderCustomImages();
    persist();
    showStatus("imageStatus", "已添加自定义图片。填写名称后可上传图片。");
  });

  $("resetImagesBtn").addEventListener("click", () => {
    if (!confirm("确定清空头像立绘页的内容吗？")) return;
    imageData = { avatar: "", portrait: "", custom: [] };
    renderImagePage();
    persist();
    showStatus("imageStatus", "已清空本页内容。");
  });
}