// COC SECTION: Character data import/export
function buildCharacterDataFileName(data) {
  const rawName = data && data.profile && data.profile.investigatorName
    ? String(data.profile.investigatorName).trim()
    : "";
  const safeName = rawName.replace(/[\\/:*?"<>|]/g, "").trim() || "coc-card";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `${safeName}-${date}.json`;
}

function exportCharacterData() {
  flushPersist(true);
  const data = collectData();
  const payload = {
    app: "coc-card-tool",
    version: 1,
    exportedAt: new Date().toISOString(),
    data
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = buildCharacterDataFileName(data);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showStatus(currentStatusId(), "已导出角色数据。");
}

function readCharacterDataFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        resolve(parsed && parsed.data ? parsed.data : parsed);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsText(file);
  });
}

async function importCharacterData(fileInput) {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return;
  const confirmed = window.confirm("导入数据会覆盖目前已填写内容，是否导入数据？");
  if (!confirmed) {
    fileInput.value = "";
    return;
  }
  try {
    const pageBeforeImport = currentPage;
    const data = await readCharacterDataFile(file);
    if (!data || typeof data !== "object") throw new Error("文件内容不是有效的角色数据");
    flushPersist(true);
    window.clearTimeout(saveTimer);
    saveTimer = null;
    localStorage.setItem(storageKey, JSON.stringify(data));
    fileInput.value = "";
    restore();
    currentPage = stepDefinitions.some((step) => step.page === pageBeforeImport) ? pageBeforeImport : currentPage;
    initDetailsState();
    renderRollHistory();
    updatePreview({ force: true });
    updateAttributeCalculations();
    updateAssetCalculations();
    openPage(currentPage);
    window.alert("导入成功。");
  } catch (error) {
    console.warn("import failed", error);
    fileInput.value = "";
    const reason = error && error.message ? error.message : "未知错误";
    window.alert("导入失败。可能原因：文件不是本工具导出的 JSON、文件内容损坏、或浏览器本地存储写入失败。\n\n错误信息：" + reason);
    showStatus(currentStatusId(), "导入失败，请确认选择的是本工具导出的 JSON 文件。", true);
  }
}
function initDataTransfer() {
  const exportBtn = $("exportDataBtn");
  const importBtn = $("importDataBtn");
  const fileInput = $("importDataFile");
  if (exportBtn) exportBtn.addEventListener("click", exportCharacterData);
  if (importBtn && fileInput) importBtn.addEventListener("click", () => fileInput.click());
  if (fileInput) fileInput.addEventListener("change", () => importCharacterData(fileInput));
}
