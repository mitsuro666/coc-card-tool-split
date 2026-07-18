let customSkillData = [];
let customProfessionData = null;

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
        occupation.creditRange ? "信用评级:" + occupation.creditRange : "",
        occupation.attributeFormulaText ? "职业属性:" + occupation.attributeFormulaText : "",
        occupation.occupationSkillsText ? "本职技能:" + truncateText(occupation.occupationSkillsText) : ""
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


    const attributeLevelNoteRules = window.attributeLevelNoteRules || {};
    const attributeNotes = {
      attrSTR: "衡量了你的调查员能发挥出的纯粹的身体力量,影响伤害加值和体格",
      attrCON: "用于衡量你的调查员的健康与强韧程度",
      attrPOW: "包括了意志力、灵魂与精神的强韧度",
      attrDEX: "用于衡量你的调查员身体的灵活性与速度",
      attrAPP: "衡量了你的角色外在的长相",
      attrSIZ: "反映了你的调查员的身高与体重",
      attrINT: "大致地衡量了你的调查员的聪明程度,以及逻辑与直觉的思维能力",
      attrEDU: "用于衡量你的调查员通过正规教育或“社会磨练”所积累的知识",
      attrLuck: "通过投掷3D6并将其结果乘5来计算幸运值。幸运检定通常用于确定现在的状况是否在向对你有利的方向发展"
    };

    const secondaryAttributeNotes = {
      hp: "该数值等同于体型与体质相加后除以十,小数点向下取整。当你的调查员在战斗或其他事件中受到伤害,你的耐久值就会降低",
      san: "起始值等同于调查员的意志值。这一数值代表你的调查员在恐惧面前保持镇定的能力。当你遭遇克苏鲁神话中的怪物时,你的理智值就会发生变动",
      mp: "等同于意志的五分之一值,魔法值被用于施放法术与为神秘装置或魔法效果供能。被消耗的魔法值会自然恢复",
      db: "伤害加值决定了你的调查员在一次成功的近战攻击(肉搏)能额外造成多少伤害。体格则是由体型和力量共同决定的,用于“战技”的数值",
      build: "伤害加值决定了你的调查员在一次成功的近战攻击(肉搏)能额外造成多少伤害。体格则是由体型和力量共同决定的,用于“战技”的数值"
    };

    const skillNotes = {
      "信用评级": "角色的信用评级代表了其财产与阶级。在信用评级上分配的点数越多，就代表这个角色越富裕。依据你在这项技能上分配的职业点数的数量。\n信用评级0：身无分文，露宿街头。\n信用评级1-9：贫困，只有最低限度的财产。\n信用评级10-49：普通，舒适的生活水平。\n信用评级50-89：小康，略为奢侈的生活水平。\n信用评级90-98：富裕，十分奢侈的生活。\n信用评级99：豪富，钱财已经毫无意义。",
      "闪避": "允许调查员本能地闪躲击打与投掷物等。一个角色可以在一个战斗轮内闪避任意次数（但只能针对每一次攻击闪避一次）。只要一次攻击能被看见，该角色就可以试图闪避它，因此子弹无法被闪避，因为它在飞行过程中几乎无法被看见，某一角色对其能做出的最佳的反应即是进行规避以使其更难被击中。闪避技能的初始值等于该角色敏捷常规值的一半。",
      "母语": "某一角色的母语。这项技能应当代表你的调查员最为熟悉的语言，例如英语。这项技能的起始值等同于角色的常规教育值。",
      "会计": "理解会计工作的程序，揭示个人或某一笔交易的财务运作状况。",
      "人类学": "通过观察来辨识或理解某人（或某一文化）的生活方式。",
      "估价": "判断某一特定物品的价值，包括其质量、用材与工艺。",
      "考古学": "允许使用者鉴别来自过去文明的文物并判断其年代，同时还可用于辨别文物的真赝。",
      "取悦": "该技能有许多形式，包括以外貌吸引、诱惑、奉承或仅仅是依靠个人魅力。取悦技能可用于迫使某人以某种方式行事，但不可能使其做出完全与平日作风相反的行为。这项技能可被取悦或心理学对抗。",
      "攀爬": "借助或不借助绳索与攀爬工具攀登树木、墙壁或其他垂直平面。",
      "克苏鲁神话": "反映了该角色对非人的克苏鲁神话的理解。该技能并非像学术技能那样的知识积累。而是象征着人类的思维逐渐向克苏鲁神话开启并向其转变的过程。因此克苏鲁神话技能是通过与神话（怪物或珍贵书籍中的知识）接触获得的。克苏鲁神话与人类的理解能力是相对立的，因此接触它会使人类的理智瓦解。调查员不能在创建角色时为克苏鲁神话技能分配点数（除非获得了守秘人的同意）。",
      "乔装": "当你想让自己看起来像是另一人的时候，使用这项技能。",
      "汽车驾驶": "驾驶轿车或轻型卡车、进行常规机动或修理常见的载具问题。如果调查员想要甩开追逐者或追踪某人，那么他可能将需要进行一个汽车驾驶技能。",
      "电气维修": "修理或重设电气设备，诸如自动点火器、电动机、保险丝盒与防盗警报。",
      "话术": "本技能的范围限于语言诡计、欺诈和误导，例如通过欺骗的方式让某个保镖允许你进入俱乐部、让某人在一份他还未读过的表单上签字、让警察去监看另一个方向等等。这项技能可被话术技能或心理学技能对抗。",
      "格斗": "该角色用于近战的技能。你可以将技能点分配到任何技能专业中，包括斗殴（囊括了小刀与棍棒，还有拳击和武术）、剑、斧、矛与鞭子。",
      "斗殴": "该角色用于近战的技能。你可以将技能点分配到任何技能专业中，包括斗殴（囊括了小刀与棍棒，还有拳击和武术）、剑、斧、矛与鞭子。",
      "射击": "包括了所有形式的火器，此外还囊括了弓和弩。你可以将技能点分配到任何技能专业中，包括手枪、步枪/霰弹枪、弓或弩。",
      "急救": "紧急医疗救助，这项技能不能用于治疗疾病（这需要医学技能）。要使急救发挥作用，必须在受伤一小时后使用这项技能，它可以使伤者恢复1点耐久值，并能唤醒昏迷的人。",
      "历史": "回忆一处历史细节或事件，以及与国家、城市、地区或个人的重要情报。",
      "法律": "代表了知晓相关法律、先前判例、法律辨术与法庭程序的可能性。当与警方、律师或法庭打交道时，这项技能十分有用。",
      "图书馆使用": "用于找到某一段信息，例如一份特定的书籍、报纸、图书馆中的参考文献或整理过的文档（假如这份文档的确可以在那里被找到）。使用这项技能代表进行了数个小时的持续检索。",
      "聆听": "理解声响，包括无意中听见的对话、门后的轻声交谈与餐厅里的低声私语。",
      "锁匠": "可用于打开车门、依靠短路打火偷车、撬开图书馆窗户、破解机关盒（原文为中国谜题盒，需要进一步确认）或越过普通的警报系统。同时还可用于修复锁具、配钥匙或在万能钥匙或其他工具的帮助下开锁。",
      "机械维修": "修复一台破损的机械或制作一台新机械。同样也可用于进行基础的木工与管道工工作，以及构建（例如滑轮系统）与修复（例如蒸汽泵）物品。这项技能也可被用于打开普通的家庭用锁，但更为复杂的锁需要锁匠技能才能开启。",
      "医学": "诊断并处理事故、伤口、疾病、毒素等等。医学救助需要花费至少一个小时的时间，并且可以在受到伤害后的任意时间进行，但如果没有在受伤后一天内进行，那么检定的难度等级将上升（需要一个困难成功）。 使用医学技能成功救助目标能使其恢复1D3点耐久值（与其曾通过急救恢复的耐久值叠加），但濒死的角色除外，他们必须要先通过一个成功的急救检定稳定其状况，其后才能对其使用医学技能。",
      "博物学": "代表了来自农夫、渔民以及业余爱好者们的传统（而非科学）知识与个人观察的结果。这项技能可用于大略地辨识植物以及动物的种类、习性、栖息地、踪迹与叫声。",
      "导航": "用于在前往某一方向的过程中选择正确的路径，无论正身处陌生城市还是荒野中。同样也用于读图并判断距离与地形。",
      "神秘学": "辨识神秘学用具、词汇与概念，以及民俗传统。还可用于辨认魔法书与神秘学记号。以及回忆从书籍、教学与经验中学到的神秘知识。",
      "操作重型机械": "用于驾驶与操作火车、蒸汽机、推土机或其他大型陆用机械。",
      "说服": "通过合理的争论、论辩与讨论使某人相信某一想法、概念或信念。说服的实行并不一定要牵扯到事实真相。成功的说服需要花费时间：至少半个小时。如果你想要快速地说服某人，你应当使用话术技能。这项技能可被说服或心理学技能对抗。",
      "驾驶": "选取一项专业，例如船只、飞行器或飞艇，每一项专业都需要单独支付技能点。这项技能允许对这些载具安全地进行操作，并将它们用作交通工具。",
      "精神分析": "包括一系列情绪疗法。精神分析可以帮助调查员恢复理智：游戏中每月一次，为确定治疗效果，心理咨询师或医生可进行一次精神分析检定。如果检定成功，病人可恢复1D3点理智值；如果失败，则无法恢复理智值；如果大失败，则病人会失去1D6点理智值，并且当前的心理咨询师进行的治疗会就此终止。在游戏中，仅使用精神分析并不能加速从不定性疯狂中恢复的过程，那需要1D6个月系统（或类似条件）的看护，但精神分析可能会作为其中的一部分出现。成功地使用这项技能可以使目标在短期内克服恐惧症或躁狂症，或是看穿幻觉。",
      "骑术": "用于骑乘马、驴和骡子，并给予其使用者基础的护理坐骑、骑乘用具与如何使坐骑疾驰或越过困难地形的知识。如果坐骑突然意外地抬起了身子或被绊到，那么骑手保持继续骑行的几率等同于其骑术技能值。",
      "科学": "针对某一科学专业的理论与实践能力，这项技能通常都是通过正式的教育与训练获得的，但也可能为学识渊博的业余科学家所拥有。对科学的理解与其范围被游戏中的时代所限制。技能点可被分配给任意该技能下的专业，例如：天文学，生物学，植物学，化学，密码学，地质学，药学，物理学，动物学，等等。如果某一角色并没有明显与当前状况对应的专业科学技能，他可以依照守秘人的判断，以一项与之相关联的专业进行检定，但难度等级将会上升（或需要承受一枚惩罚骰）。",
      "潜行": "用于避开视线、悄声行进或在不惊动其他可能听或看见的人的情况下躲藏起来。",
      "生存": "在沙漠、极地、海洋或荒野等极端环境下生存所需的专业技能。其中包括了狩猎、建造避难所、识别环境危害（例如避开有毒植物）等等。 技能点可被分配给任意该技能下的专业，并从荒野、极地、沙漠、海洋等环境中选取对应的类型。如果某一角色没有明显与当前状况对应的专业生存技能，他可以依照守秘人的判断，以一项与之相关联的专业进行检定，但难度等级将会上升（或需要承受一枚惩罚骰）。",
      "妙手": "允许使用者从视觉角度遮盖或掩藏某件或某些物体，或许是将其藏匿在残骸、衣物或其他易让人分神的物件中。这项技能同样还用于对物体的灵敏而精巧的操作。",
      "心理学": "通过观察人类的共性来分析另一人的动机与性格，或是识别某人是否正在说谎。守秘人可以选择代替玩家进行隐蔽的心理学技能检定，并仅仅告知玩家信息，无论这些信息是真还是假。",
      "侦查": "发现密门或隔间，注意到隐蔽的闯入者，发现不明显的线索，辨认被重新上过漆的汽车，意识到伏击者，注意到鼓起的钱包，等等——对于调查员来说这是一项十分重要的技能。当调查员搜寻某个躲藏起来的角色的时候，其对手的潜行技能需要被用来决定这次检定的难度。",
      "侦察": "发现密门或隔间，注意到隐蔽的闯入者，发现不明显的线索，辨认被重新上过漆的汽车，意识到伏击者，注意到鼓起的钱包，等等——对于调查员来说这是一项十分重要的技能。当调查员搜寻某个躲藏起来的角色的时候，其对手的潜行技能需要被用来决定这次检定的难度。",
      "游泳": "用于在水或其他液体中浮起并行进的技能。只有当在危机或险境中游泳的时候才需要进行检定。 在游泳的孤注一掷中失败可能会引致损失耐久值。这也可能导致这名角色被冲向下游、部分或完全地窒息。",
      "投掷": "使用一个物体击中目标。一件手掌大小的物体最多可被掷出相当于力量值五分之一码那么远。如果投掷技能失败，该物体可能落在离目标随机距离处，这由守秘人决定。在战斗中，当投掷石块、长矛、手雷或回力镖时应使用这项技能。",
      "追踪": "通过地面或植物上的痕迹跟踪某一人物、载具或动物。诸如痕迹被留下后经过的时间、雨水与地面的类型等因素可能会影响到检定的难度等级。"
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
      { id: "phobiasManias", label: "恐惧症和躁狂症" },
      { id: "backgroundExtra", label: "补充内容" }
    ];
    const weaponArmorOptions = ["手枪", "步枪/霰弹枪", "匕首", "防弹衣", "盾牌", "自定义"];
    const commonSkillGroups = {
      explore: { label: "探索", className: "common-explore", names: ["侦查", "聆听", "图书馆使用", "计算机使用"] },
      social: { label: "交涉", className: "common-social", names: ["取悦", "话术", "说服", "恐吓"] },
      combat: { label: "战斗", className: "common-combat", names: ["闪避", "斗殴", "格斗:斗殴", "射击", "急救"] },
      psychology: { label: "心理", className: "common-psychology", names: ["心理学", "精神分析"] }
    };

    const skillCategoryGroups = {
      investigate: { label: "调查", className: "category-investigate", names: ["会计", "人类学", "估价", "考古学", "计算机使用", "克苏鲁神话", "外语", "图书馆使用", "聆听", "博物学", "神秘学", "精神分析", "心理学", "侦查", "追踪", "读唇"] },
      social: { label: "交涉", className: "category-social", names: ["人类学", "估价", "取悦", "信用评级", "乔装", "话术", "恐吓", "外语", "母语", "法律", "说服", "精神分析", "心理学", "侦查", "追踪", "读唇"] },
      combat: { label: "战斗", className: "category-combat", names: ["闪避", "格斗", "射击", "恐吓", "跳跃", "聆听", "操作重型机械", "心理学", "骑术", "侦查", "潜行", "投掷", "动物驯养", "爆破", "催眠", "炮术"] },
      stunt: { label: "特技", className: "category-stunt", names: ["敏捷", "考古学", "技艺", "攀爬", "乔装", "汽车驾驶", "电气维修", "跳跃", "锁匠", "机械维修", "医学", "导航", "操作重型机械", "驾驶", "骑术", "妙手", "潜行", "生存", "游泳", "投掷", "追踪", "动物驯养", "潜水", "爆破", "催眠", "炮术"] },
      support: { label: "支援", className: "category-support", names: ["急救", "医学", "精神分析", "汽车驾驶", "驾驶", "骑术", "导航", "信用评级", "人类学", "动物驯养", "催眠", "炮术"] },
      knowledge: { label: "学问", className: "category-knowledge", names: ["教育", "智力", "会计", "人类学", "计算机使用", "克苏鲁神话", "电子学", "历史", "外语", "母语", "法律", "图书馆使用", "医学", "博物学", "神秘学", "精神分析", "心理学", "科学", "读唇"] }
    };

    const stepDefinitions = [
      { page: "profile", label: "基础信息" },
      { page: "attributes", label: "属性购点" },
      { page: "skills", label: "技能加点" },
      { page: "items", label: "背景物品" },
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
    let talentSkillIds = [];
    let currentSkillFilter = "all";
    let detailsState = {};
    let inventoryData = { weapons: [], armors: [], vehicles: [], others: [] };
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
      if (type === "skill") return skillNotes[key] || "";
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


