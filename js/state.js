let customSkillData = [];

    function getAllSkills() {
      return [...skillDatabase, ...customSkillData];
    }


    function truncateText(text, maxLength = 92) {
      const value = String(text || "");
      return value.length > maxLength ? value.slice(0, maxLength) + "……" : value;
    }

    const professions = occupationDatabase.map((occupation) => ({
      name: occupation.name,
      tags: [occupation.name, occupation.occupationSkillsText, occupation.attributeFormulaText].filter(Boolean),
      meta: [
        occupation.creditRange ? "信用评级：" + occupation.creditRange : "",
        occupation.attributeFormulaText ? "职业属性：" + occupation.attributeFormulaText : "",
        occupation.occupationSkillsText ? "本职技能：" + truncateText(occupation.occupationSkillsText) : ""
      ].filter(Boolean).join("　"),
      occupationId: occupation.id
    }));

    const attributes = [
      { key: "STR", name: "力量", id: "attrSTR", roll: "3d6" },
      { key: "DEX", name: "敏捷", id: "attrDEX", roll: "3d6" },
      { key: "POW", name: "意志", id: "attrPOW", roll: "3d6" },
      { key: "CON", name: "体质", id: "attrCON", roll: "3d6" },
      { key: "APP", name: "外貌", id: "attrAPP", roll: "3d6" },
      { key: "EDU", name: "教育", id: "attrEDU", roll: "2d6+6" },
      { key: "SIZ", name: "体型", id: "attrSIZ", roll: "2d6+6" },
      { key: "INT", name: "智力", id: "attrINT", roll: "2d6+6" },
      { key: "Luck", name: "幸运", id: "attrLuck", roll: "3d6", isLuck: true }
    ];


    const attributeNotes = {
      attrSTR: "衡量了你的调查员能发挥出的纯粹的身体力量，影响伤害加值和体格。",
      attrCON: "用于衡量你的调查员的健康与强韧程度。",
      attrPOW: "包括了意志力、灵魂与精神的强韧度。",
      attrDEX: "用于衡量你的调查员身体的灵活性与速度。",
      attrAPP: "衡量了你的角色外在的长相。",
      attrSIZ: "反映了你的调查员的身高与体重。",
      attrINT: "大致地衡量了你的调查员的聪明程度，以及逻辑与直觉的思维能力。",
      attrEDU: "用于衡量你的调查员通过正规教育或“社会磨练”所积累的知识。",
      attrLuck: "通过投掷3D6并将其结果乘5来计算幸运值。幸运检定通常用于确定现在的状况是否在向对你有利的方向发展。"
    };

    const secondaryAttributeNotes = {
      hp: "该数值等同于体型与体质相加后除以十，小数点向下取整。当你的调查员在战斗或其他事件中受到伤害，你的耐久值就会降低。",
      san: "起始值等同于调查员的意志值。这一数值代表你的调查员在恐惧面前保持镇定的能力。当你遭遇克苏鲁神话中的怪物时，你的理智值就会发生变动。",
      mp: "等同于意志的五分之一值，魔法值被用于施放法术与为神秘装置或魔法效果供能。被消耗的魔法值会自然恢复。",
      db: "伤害加值决定了你的调查员在一次成功的近战攻击（肉搏）能额外造成多少伤害。体格则是由体型和力量共同决定的，用于“战技”的数值。",
      build: "伤害加值决定了你的调查员在一次成功的近战攻击（肉搏）能额外造成多少伤害。体格则是由体型和力量共同决定的，用于“战技”的数值。"
    };
    const profileFields = [
      "investigatorName", "playerName", "era", "customEra", "occupation", "occupationId",
      "age", "gender", "residence", "birthplace", "storyLocation", "currentYear", "currentMonth", "currentDay", "currentMinute", "currentSecond", "notesArea"
    ];
    const attributeFieldIds = attributes.map((attribute) => attribute.id);

    const assetFieldIds = [
      "assetDetailNote", "assetVehicle", "assetVehicleValue", "assetResidence", "assetResidenceValue",
      "assetLuxury", "assetLuxuryValue", "assetStock", "assetStockValue", "assetOtherNote", "assetOtherValue"
    ];
    const backgroundFields = [
      { id: "appearanceDesc", label: "形象描述" },
      { id: "ideologyBeliefs", label: "思想与信念" },
      { id: "importantPeople", label: "重要之人" },
      { id: "meaningfulPlaces", label: "意义非凡之地" },
      { id: "treasuredPossessions", label: "宝贵之物" },
      { id: "traits", label: "特质" },
      { id: "scars", label: "伤口和疤痕" },
      { id: "phobiasManias", label: "恐惧症和躁狂症" }
    ];
    const weaponArmorOptions = ["手枪", "步枪/霰弹枪", "匕首", "防弹衣", "盾牌", "自定义"];
    const commonSkillGroups = {
      explore: { label: "探索", className: "common-explore", names: ["侦查", "聆听", "图书馆使用", "计算机使用"] },
      social: { label: "交涉", className: "common-social", names: ["取悦", "话术", "说服", "恐吓"] },
      combat: { label: "战斗", className: "common-combat", names: ["闪避", "斗殴", "格斗：斗殴", "射击", "急救"] },
      psychology: { label: "心理", className: "common-psychology", names: ["心理学", "精神分析"] }
    };

    const skillCategoryGroups = {
      knowledge: { label: "知识", className: "category-knowledge", names: ["会计", "人类学", "考古学", "电子学", "历史", "法律", "医学", "博物学", "神秘学"] },
      technique: { label: "技能", className: "category-technique", names: ["估价", "乔装", "汽车驾驶", "电气维修", "机械维修", "锁匠", "导航", "操作重型机械", "驾驶", "妙手", "追踪", "动物驯养", "爆破", "读唇", "催眠", "炮术", "骑术"] },
      action: { label: "行动", className: "category-action", names: ["攀爬", "跳跃", "潜行", "游泳", "投掷", "潜水"] }
    };

    const stepDefinitions = [
      { page: "profile", label: "基础信息" },
      { page: "attributes", label: "属性购点" },
      { page: "skills", label: "技能加点" },
      { page: "items", label: "背景&物品" },
      { page: "images", label: "头像立绘" },
      { page: "final", label: "角色生成" }
    ];

    function getStepIndex(page) {
      return stepDefinitions.findIndex((step) => step.page === page);
    }
    const $ = (id) => document.getElementById(id);
    const storageKey = "coc-profile-prototype";
    let currentPage = "profile";
    let maxUnlockedStep = 0;
    let rollHistoryData = [];
    let skillPointData = {};
    let currentSkillFilter = "all";
    let inventoryData = { weapons: [], others: [] };
    let imageData = { avatar: "", portrait: "", custom: [] };
let ageAdjustmentState = { applied: false, age: "", adjustments: {}, movePenalty: 0, messages: [] };

    const notesToggle = $("notesToggle");
    const previewToggle = $("previewToggle");
    const floatingNotes = $("floatingNotes");
    const floatingPreview = $("floatingPreview");
    const notesArea = $("notesArea");
    const clearNotes = $("clearNotes");
    const closePreview = $("closePreview");
    const era = $("era");
    const customEra = $("customEra");
    const occupation = $("occupation");
    const occupationIdInput = $("occupationId");
    const professionResults = $("professionResults");
    const occupationHint = $("occupationHint");
    const creditRatingValue = $("creditRatingValue");


    function getInfoNoteText(type, key) {
      if (type === "attribute") return attributeNotes[key] || "";
      if (type === "secondary") return secondaryAttributeNotes[key] || "";
      return "";
    }

    function hideInfoNote() {
      const note = $("infoNoteBubble");
      if (note) note.hidden = true;
    }

    function showInfoNote(target, text) {
      if (!target || !text) return;
      let note = $("infoNoteBubble");
      if (!note) {
        note = document.createElement("div");
        note.id = "infoNoteBubble";
        note.className = "info-note-bubble";
        note.hidden = true;
        document.body.appendChild(note);
      }
      note.textContent = text;
      note.hidden = false;
      const rect = target.getBoundingClientRect();
      const width = Math.min(300, window.innerWidth - 24);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
      note.style.width = `${width}px`;
      note.style.left = `${left}px`;
      note.style.top = `${rect.bottom + 8}px`;
    }

    function initInfoNotes() {
      document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-info-note]");
        if (!trigger) {
          if (!event.target.closest("#infoNoteBubble")) hideInfoNote();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        const text = getInfoNoteText(trigger.dataset.infoType, trigger.dataset.infoKey);
        showInfoNote(trigger, text);
      });
      window.addEventListener("scroll", hideInfoNote, true);
      window.addEventListener("resize", hideInfoNote);
    }
    function showStatus(id, message, isError = false) {
      const status = $(id);
      if (!status) return;
      if (isError) {
        status.innerHTML = `<span class="error">${message}</span>`;
      } else {
        status.textContent = message;
      }
    }

    function currentStatusId() {
      if (currentPage === "final") return "finalStatus";
      if (currentPage === "images") return "imageStatus";
      if (currentPage === "items") return "itemsStatus";
      if (currentPage === "skills") return "skillStatus";
      return currentPage === "attributes" ? "attributeStatus" : "saveStatus";
    }
    function escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    }


