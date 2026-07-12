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
      <div>${src ? `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${escapeHTML(label)}" /></a>` : `<span>${escapeHTML(label)}未上传</span>`}</div>
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
function getFinalTemplateValue(value) {
  const text = String(value ?? "").trim();
  return text ? text : "0";
}

function getSkillTemplateName(skill) {
  const displayName = String(getSkillDisplayName(skill) || skill.name || "").trim();
  const specializedName = displayName.includes("：") ? displayName.split("：").pop() : displayName.split(":").pop();
  return String(specializedName || displayName)
    .replace(/\s+/g, "")
    .replace(/[：:]/g, "");
}

function generateSkillInputTemplate() {
  const attributeAliases = [
    { id: "attrSTR", name: "力量", alias: "str" },
    { id: "attrDEX", name: "敏捷", alias: "dex" },
    { id: "attrPOW", name: "意志", alias: "pow" },
    { id: "attrCON", name: "体质", alias: "con" },
    { id: "attrAPP", name: "外貌", alias: "app" },
    { id: "attrEDU", name: "教育", alias: "edu" },
    { id: "attrSIZ", name: "体型", alias: "siz" },
    { id: "attrINT", name: "智力", alias: "int" },
    { id: "attrLuck", name: "幸运", alias: "luck" }
  ];
  const secondaryItems = calculateSecondaryAttributes();
  const getSecondaryValue = (key) => {
    const item = secondaryItems.find((entry) => entry.key === key);
    return item ? formatDerivedValue(item.value) : "0";
  };
  const parts = [".st "];
  attributeAliases.forEach((attribute) => {
    const value = getFinalTemplateValue(parseAttributeValue(attribute.id));
    parts.push(`${attribute.name}${value}${attribute.alias}${value}`);
  });
  const san = getFinalTemplateValue(getSecondaryValue("san"));
  const mp = getFinalTemplateValue(getSecondaryValue("mp"));
  const hp = getFinalTemplateValue(getSecondaryValue("hp"));
  parts.push(`理智${san}san${san}`);
  parts.push(`魔法${mp}mp${mp}`);
  parts.push(`体力${hp}hp${hp}`);
  parts.push(`信用评级${getFinalTemplateValue(getCreditRatingNumber())}`);
  getFinalSkillItems().forEach((skill) => {
    const name = getSkillTemplateName(skill);
    if (!name || name === "信用评级") return;
    parts.push(`${name}${getSkillTotal(skill)}`);
  });
  return parts.join("");
}

function renderSkillInputTemplate() {
  const template = generateSkillInputTemplate();
  return renderFinalSection("技能录入模板", `
    <div class="final-template-box">
      <textarea id="skillInputTemplateText" readonly>${escapeHTML(template)}</textarea>
      <button class="secondary" type="button" id="copySkillInputTemplate">复制</button>
    </div>
  `);
}

function copySkillInputTemplate() {
  const field = $("skillInputTemplateText");
  if (!field) return;
  const text = field.value;
  const done = () => showStatus("finalStatus", "技能录入模板已复制。");
  const fail = () => {
    field.focus();
    field.select();
    showStatus("finalStatus", "无法自动复制，请手动复制文本。", true);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fail);
    return;
  }
  try {
    field.focus();
    field.select();
    document.execCommand("copy") ? done() : fail();
  } catch (error) {
    fail();
  }
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
    ${renderSkillInputTemplate()}
    ${renderFinalRadarCharts()}
    ${renderFinalSection("资产情况", `<div class="final-readonly-grid assets">${renderFinalPairs(assetItems)}</div><div class="final-note-item wide"><strong>生活评价</strong><p>${escapeHTML(lifestyle.note)}</p></div>`)}
    ${renderFinalSection("背景故事", renderFinalBackground())}
    ${renderFinalSection("随身物品", `
      <div class="final-inventory-grid">
        <section><h4>武器防具</h4>${renderFinalEquipmentList()}</section>
        <section><h4>其他物品</h4>${renderFinalInventoryList(inventoryData.others || [], "暂未添加其他物品。", (item) => item.name, (item) => item.quantity || "1")}</section>
      </div>
    `)}
  `;
  renderFinalRadarCanvases();
  const copyTemplateButton = $("copySkillInputTemplate");
  if (copyTemplateButton) copyTemplateButton.addEventListener("click", copySkillInputTemplate);
}
function convertFinalCanvasesForExport(clone) {
  clone.querySelectorAll("canvas").forEach((canvas) => {
    const source = canvas.id ? $(canvas.id) : null;
    if (!source || !source.toDataURL) return;
    const image = document.createElement("img");
    image.src = source.toDataURL("image/png");
    image.alt = canvas.getAttribute("aria-label") || "图表";
    image.className = "export-radar-image";
    canvas.replaceWith(image);
  });
}

function buildFinalExportHtml(content) {
  const title = finalText($("investigatorName").value, "调查员角色卡");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>${escapeHTML(title)} - COC角色卡</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; color: #082b4f; background: #eef3f8; font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif; }
  .export-shell { max-width: 960px; margin: 0 auto; }
  .export-toolbar { position: sticky; top: 0; z-index: 5; display: flex; gap: 10px; justify-content: flex-end; padding: 10px 0 16px; background: #eef3f8; }
  .export-toolbar button { border: 0; border-radius: 10px; padding: 9px 14px; background: #2f5f8f; color: #fff; font-weight: 800; cursor: pointer; }
  .export-toolbar button.secondary { background: #dfeaf4; color: #082b4f; }
  h1 { margin: 0 0 14px; font-size: 24px; }
  .export-card { display: grid; gap: 14px; padding: 20px; border: 1px solid #cfdceb; border-radius: 16px; background: #fff; }
  .final-profile-hero, .final-main-images, .final-readonly-grid, .final-skill-grid, .final-note-grid, .final-inventory-grid, .final-custom-images, .final-radar-grid, .final-template-box { display: grid; gap: 10px; }
  .final-profile-hero { grid-template-columns: 300px minmax(0, 1fr); align-items: stretch; }
  .final-main-images, .final-note-grid, .final-inventory-grid, .final-radar-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .final-main-images { align-self: stretch; margin-top: 10px; }
  .final-custom-images { grid-template-columns: repeat(auto-fill, minmax(120px, 160px)); }
  .final-readonly-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .final-skill-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .final-section, .final-main-images, .final-note-item, .final-inventory-grid section, .final-radar-card, .final-image { border: 1px solid #d6e0ea; border-radius: 12px; background: #fbfdff; overflow: hidden; }
  .final-section h3, .final-radar-card h4 { margin: 0; padding: 9px 11px; border-bottom: 1px solid #d6e0ea; font-size: 15px; }
  .final-readonly-cell, .final-skill-item, .final-item-list div { padding: 9px 10px; border: 1px solid #d6e0ea; border-radius: 10px; background: #fff; }
  .final-readonly-cell span, .final-skill-item span, .final-item-list span { color: #66788a; font-size: 13px; }
  .final-readonly-cell strong, .final-skill-item strong, .final-item-list strong { display: block; margin-top: 3px; color: #082b4f; font-size: 14px; }
  .final-skill-item, .final-item-list div { display: flex; justify-content: space-between; align-items: center; gap: 14px; }
  .final-note-grid, .final-inventory-grid, .final-custom-images, .final-radar-grid, .final-template-box, .final-readonly-grid, .final-skill-grid { padding: 14px; }
  .final-note-item { padding: 12px 14px; }
  .final-note-item.wide { grid-column: 1 / -1; }
  .final-section > .final-note-item.wide { border: 0; border-top: 1px solid #d6e0ea; border-radius: 0; margin: 0; background: transparent; }
  .final-note-item strong, .final-inventory-grid h4 { display: block; margin: 0 0 8px; color: #082b4f; font-size: 13px; font-weight: 800; }
  .final-note-item p { margin: 0; white-space: pre-wrap; line-height: 1.7; color: #52677c; font-size: 13px; }
  .final-item-list { display: grid; gap: 8px; }
  .final-inventory-grid section { padding: 14px; }
  .final-inventory-grid .final-item-list div { min-height: 42px; padding: 9px 12px; }
  .final-item-list span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .final-item-list strong { flex: 0 0 auto; white-space: nowrap; }
  .final-image { display: grid; grid-template-rows: minmax(220px, 1fr) auto; margin: 0; }
  .final-image div, .final-image a { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #f4f8fc; }
  .final-image img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .final-image figcaption { padding: 7px 9px; border-top: 1px solid #d6e0ea; text-align: center; font-size: 12px; color: #66788a; }
  .export-radar-image { display: block; width: 100%; max-height: 240px; object-fit: contain; background: #fff; }
  .final-template-box { grid-template-columns: minmax(0, 1fr); }
  .final-template-box textarea { width: 100%; min-height: 96px; border: 1px solid #d6e0ea; border-radius: 10px; padding: 10px; color: #082b4f; font: 13px/1.55 "Microsoft YaHei", Arial, sans-serif; }
  .final-template-box button { display: none; }
  .final-empty { padding: 12px; color: #66788a; }
  @media print { body { padding: 0; background: #fff; } .export-toolbar { display: none; } .export-card { border: 0; border-radius: 0; padding: 0; } .final-section, .final-main-images, .final-note-item, .final-inventory-grid section, .final-radar-card, .final-image { break-inside: avoid; } }
  @media (max-width: 720px) { body { padding: 12px; } .final-profile-hero, .final-main-images, .final-note-grid, .final-inventory-grid, .final-radar-grid { grid-template-columns: 1fr; } .final-readonly-grid, .final-skill-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
</head>
<body>
  <div class="export-shell">
    <div class="export-toolbar">
      <button class="secondary" type="button" onclick="document.querySelector('.export-card').focus(); document.execCommand('selectAll');">全选</button>
      <button type="button" onclick="window.print();">打印 / 另存为PDF</button>
    </div>
    <h1>${escapeHTML(title)} · COC角色卡</h1>
    <main class="export-card" contenteditable="true">${content}</main>
  </div>
</body>
</html>`;
}

function openFinalExportPreview() {
  renderFinalSummary();
  const summary = $("finalSummary");
  if (!summary) return;
  const clone = summary.cloneNode(true);
  convertFinalCanvasesForExport(clone);
  const exportWindow = window.open("", "_blank");
  if (!exportWindow) {
    showStatus("finalStatus", "浏览器阻止了新窗口，请允许弹窗后重试。", true);
    return;
  }
  exportWindow.document.open();
  exportWindow.document.write(buildFinalExportHtml(clone.innerHTML));
  exportWindow.document.close();
  showStatus("finalStatus", "已生成保存版预览，可打印为PDF或复制到Word。 ");
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

  const exportFinalDocBtn = $("exportFinalDocBtn");
  if (exportFinalDocBtn) exportFinalDocBtn.addEventListener("click", openFinalExportPreview);

  $("resetImagesBtn").addEventListener("click", () => {
    if (!confirm("确定清空头像立绘页的内容吗？")) return;
    imageData = { avatar: "", portrait: "", custom: [] };
    renderImagePage();
    persist();
    showStatus("imageStatus", "已清空本页内容。");
  });
}