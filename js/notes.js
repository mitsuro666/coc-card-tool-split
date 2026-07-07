function initNotes() {
  notesToggle.addEventListener("click", () => {
    floatingNotes.classList.toggle("show");
    floatingPreview.classList.remove("show");
  });

  clearNotes.addEventListener("click", () => {
    if (confirm("确定清空备忘笔记里的内容吗？")) {
      notesArea.value = "";
      persist();
    }
  });
}
