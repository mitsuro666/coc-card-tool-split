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
