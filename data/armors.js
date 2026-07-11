// 防具数据库：由 COC7 空白卡 Excel「防具表 载具表」B1:L76 转换。
// 仅作为本地原型的自动匹配数据源，不包含服务器或外部依赖。
const armorDatabase = [
  {
    "id": "armor_001_厚重皮夹克",
    "order": 1,
    "armorType": "厚重皮夹克",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "躯干",
    "species": "人类、人型生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "10/55",
    "category": "规\n则\n书\n内\n的\n防\n护\n物",
    "note": "在危险的情形下,米戈通常会披上这些由发着微光的绿色黏液所织成的网状物这种装甲在对抗钝击、火焰、电击等伤害时会提供 8 点装甲值。\n\n人类也能穿戴这种生化网状物，但会因毛发和肌肉被撕离而在每次脱下装甲时受到 1 点伤害。因为人类并不会分泌合适的、能够照料到这些装甲的营养液，一件生化网状装甲将会缓慢地分解。\n\n每被人类穿戴过一次，一件生化网状装甲将降低一点护甲值。当失去所有护甲值时，这件装甲将分崩离析，变成一池弥散着蒸汽的黏性物质。穿戴该装甲是否会带来明显的副作用，则仍未可知。",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 2
    }
  },
  {
    "id": "armor_002_一战标准钢盔",
    "order": 2,
    "armorType": "一战标准钢盔",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "头部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "1920s",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 3
    }
  },
  {
    "id": "armor_003_1英寸_2_5厘米_硬木",
    "order": 3,
    "armorType": "1英寸（2.5厘米）硬木",
    "armorValue": "3",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "——",
    "price": "0.5/10 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 4
    }
  },
  {
    "id": "armor_004_现代美军头盔",
    "order": 4,
    "armorType": "现代美军头盔",
    "armorValue": "5",
    "movPenalty": "0",
    "coverage": "头部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 5
    }
  },
  {
    "id": "armor_005_重型凯芙拉防弹背心",
    "order": 5,
    "armorType": "重型凯芙拉防弹背心",
    "armorValue": "8",
    "movPenalty": "0",
    "coverage": "躯干",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 6
    }
  },
  {
    "id": "armor_006_1_5_3_8厘米_英寸防弹玻璃",
    "order": 6,
    "armorType": "1.5 （3.8厘米）英寸防弹玻璃",
    "armorValue": "15",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "现代",
    "price": "100 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 7
    }
  },
  {
    "id": "armor_007_1_英寸钢板",
    "order": 7,
    "armorType": "1 英寸钢板",
    "armorValue": "19",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "——",
    "price": "1/10 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 8
    }
  },
  {
    "id": "armor_008_大号沙包",
    "order": 8,
    "armorType": "大号沙包",
    "armorValue": "20",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "0.01/3",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 9
    }
  },
  {
    "id": "armor_009_皮肤",
    "order": 9,
    "armorType": "皮肤",
    "armorValue": "视情况",
    "movPenalty": "——",
    "coverage": "全身",
    "species": "大象,深潜者,鳄鱼等",
    "pierceResistant": "?",
    "era": "——",
    "price": "——",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 10
    }
  },
  {
    "id": "armor_010_生化网状装甲",
    "order": 10,
    "armorType": "生化网状装甲",
    "armorValue": "8",
    "movPenalty": "？",
    "coverage": "全身",
    "species": "米戈、人型生物",
    "pierceResistant": "?",
    "era": "——",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 11
    }
  },
  {
    "id": "armor_011_砖墙",
    "order": 11,
    "armorType": "砖墙",
    "armorValue": "10",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "5/60 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 12
    }
  },
  {
    "id": "armor_012_一尺深的水",
    "order": 12,
    "armorType": "一尺深的水",
    "armorValue": "1D2+1/1D8+4",
    "movPenalty": "——",
    "coverage": "浸入部分",
    "species": "——",
    "pierceResistant": "×",
    "era": "43亿年前至今",
    "price": "——",
    "category": "非穿着物",
    "note": "这种情况是两种伤害：\n从水面上攻击水面下的目标/在水面下攻击水面下的目标\n并且火器的有效射程将在水中减少85%",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 13
    }
  },
  {
    "id": "armor_013_半米深的水",
    "order": 13,
    "armorType": "半米深的水",
    "armorValue": "1D4+2/1D8+4",
    "movPenalty": "——",
    "coverage": "浸入部分",
    "species": "——",
    "pierceResistant": "×",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 14
    }
  },
  {
    "id": "armor_014_一米深的水",
    "order": 14,
    "armorType": "一米深的水",
    "armorValue": "1D8+4",
    "movPenalty": "——",
    "coverage": "浸入部分",
    "species": "——",
    "pierceResistant": "×",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 15
    }
  },
  {
    "id": "armor_015_桌面板凳等_普通木质平面",
    "order": 15,
    "armorType": "桌面板凳等 普通木质平面",
    "armorValue": "2",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "×",
    "era": "新石器时代后",
    "price": "3/20 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 16
    }
  },
  {
    "id": "armor_016_弹簧床垫",
    "order": 16,
    "armorType": "弹簧床垫",
    "armorValue": "8",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "×",
    "era": "现代",
    "price": "40",
    "note": "注意：\n除“规则书内的防护物”的\n“注释”、“防具类型”、“护甲值”，\n\n“规则书内的载具”的“载具类型”、“技能”、“移动力”、“体格”、“乘客护甲”、“乘客数”、“注释”外\n\n均为非规则书内容，使用前需要和KP商议",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 17
    }
  },
  {
    "id": "armor_017_半米厚水泥墙",
    "order": 17,
    "armorType": "半米厚水泥墙",
    "armorValue": "12",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "7/45 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 18
    }
  },
  {
    "id": "armor_018_普通玻璃",
    "order": 18,
    "armorType": "普通玻璃",
    "armorValue": "1",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "5/10 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 19
    }
  },
  {
    "id": "armor_019_1立方米石块",
    "order": 19,
    "armorType": "1立方米石块",
    "armorValue": "20",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "古埃及之后",
    "price": "5/20 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 20
    }
  },
  {
    "id": "armor_020_粗钢筋网",
    "order": 20,
    "armorType": "粗钢筋网",
    "armorValue": "40 网状",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "?",
    "era": "现代",
    "price": "40 m²",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 21
    }
  },
  {
    "id": "armor_021_土堆",
    "order": 21,
    "armorType": "土堆",
    "armorValue": "15",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "0.01/3",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 22
    }
  },
  {
    "id": "armor_022_卷闸门_铁",
    "order": 22,
    "armorType": "卷闸门（铁）",
    "armorValue": "4",
    "movPenalty": "——",
    "coverage": "分隔整个空间",
    "species": "——",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "30/70",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 23
    }
  },
  {
    "id": "armor_023_500张a4纸",
    "order": 23,
    "armorType": "500张A4纸",
    "armorValue": "3",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "1/9",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 24
    }
  },
  {
    "id": "armor_024_书",
    "order": 24,
    "armorType": "书",
    "armorValue": "3",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "√",
    "era": "1500年前至今",
    "price": "10/15",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 25
    }
  },
  {
    "id": "armor_025_大型动物的部分肢体",
    "order": 25,
    "armorType": "大型动物的部分肢体",
    "armorValue": "2",
    "movPenalty": "——",
    "coverage": "——",
    "species": "——",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 26
    }
  },
  {
    "id": "armor_026_厚皮毡帽",
    "order": 26,
    "armorType": "厚皮毡帽",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "头部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "10/35",
    "category": "头部",
    "note": "工业防护眼镜无论是从任何方面来看都能很容易的被破坏，\n只有受到正面的飞溅物才能发挥其保护主人的效果。",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 27
    }
  },
  {
    "id": "armor_027_铁面具",
    "order": 27,
    "armorType": "铁面具",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "面部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "罕见",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 28
    }
  },
  {
    "id": "armor_028_击剑面具",
    "order": 28,
    "armorType": "击剑面具",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "头+面+颈",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "25/80",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 29
    }
  },
  {
    "id": "armor_029_冰球面罩",
    "order": 29,
    "armorType": "冰球面罩",
    "armorValue": "3 网状",
    "movPenalty": "0",
    "coverage": "头+眼部(网状)",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "30/110",
    "note": "在欧洲文艺复兴时期的盔甲都无比豪华亮丽，\n尤其是整体设计和花纹确实无与伦比\n很多产品看上去已经和工业革命时期没有什么区别了。",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 30
    }
  },
  {
    "id": "armor_030_工业防护眼镜",
    "order": 30,
    "armorType": "工业防护眼镜",
    "armorValue": "10*",
    "movPenalty": "0",
    "coverage": "眼部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "15",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 31
    }
  },
  {
    "id": "armor_031_电焊面罩",
    "order": 31,
    "armorType": "电焊面罩",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "面部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "1/10",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 32
    }
  },
  {
    "id": "armor_032_全防护级防毒面具",
    "order": 32,
    "armorType": "全防护级防毒面具",
    "armorValue": "耐毒性 2h",
    "movPenalty": "0",
    "coverage": "面部",
    "species": "人类、有明显口鼻的生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "35/150",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 33
    }
  },
  {
    "id": "armor_033_工地安全帽",
    "order": 33,
    "armorType": "工地安全帽",
    "armorValue": "1 耐冲击",
    "movPenalty": "0",
    "coverage": "头顶",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "1/10",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 34
    }
  },
  {
    "id": "armor_034_全防护摩托车帽",
    "order": 34,
    "armorType": "全防护摩托车帽",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "头部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "25/90",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 35
    }
  },
  {
    "id": "armor_035_维京头盔",
    "order": 35,
    "armorType": "维京头盔",
    "armorValue": "3",
    "movPenalty": "0",
    "coverage": "头顶+眼部(网状)",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "extraNote": "再来一遍！！！注意：\n除“规则书内的防护物”的\n“注释”、“防具类型”、“护甲值”，\n\n“规则书内的载具”的“载具类型”、“技能”、“移动力”、“体格”、“乘客护甲”、“乘客数”、“注释”外\n\n均为非规则书内容，使用前需要和KP商议",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 36
    }
  },
  {
    "id": "armor_036_古罗马头盔",
    "order": 36,
    "armorType": "古罗马头盔",
    "armorValue": "3",
    "movPenalty": "0",
    "coverage": "头顶+面颊",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 37
    }
  },
  {
    "id": "armor_037_藤条盔",
    "order": 37,
    "armorType": "藤条盔",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "头部",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 38
    }
  },
  {
    "id": "armor_038_中世纪全防护头盔",
    "order": 38,
    "armorType": "中世纪全防护头盔",
    "armorValue": "4",
    "movPenalty": "0",
    "coverage": "头+面+颈",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "中世纪",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 39
    }
  },
  {
    "id": "armor_039_文艺复兴头盔",
    "order": 39,
    "armorType": "文艺复兴头盔",
    "armorValue": "4",
    "movPenalty": "0",
    "coverage": "头+面+颈",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "√",
    "era": "文艺复兴",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 40
    }
  },
  {
    "id": "armor_040_金质镶钻王冠",
    "order": 40,
    "armorType": "金质镶钻王冠",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "头顶",
    "species": "人类、有明显头颅的生物",
    "pierceResistant": "×",
    "era": "工业革命结束前",
    "price": "老鼻子贵了",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 41
    }
  },
  {
    "id": "armor_041_击剑纤维服",
    "order": 41,
    "armorType": "击剑纤维服",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "四肢、躯干、颈",
    "species": "人类、人型生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "50/230",
    "category": "躯干或全身",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 42
    }
  },
  {
    "id": "armor_042_对练棉甲",
    "order": 42,
    "armorType": "对练棉甲",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "躯干、双臂、颈",
    "species": "人类、人型生物",
    "pierceResistant": "×",
    "era": "现代",
    "price": "160",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 43
    }
  },
  {
    "id": "armor_043_关节护具",
    "order": 43,
    "armorType": "关节护具",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "肘、膝、四肢、头",
    "species": "人类、有明显关节的生物",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "5/20",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 44
    }
  },
  {
    "id": "armor_044_护胸板",
    "order": 44,
    "armorType": "护胸板",
    "armorValue": "3",
    "movPenalty": "0",
    "coverage": "前胸",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "35",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 45
    }
  },
  {
    "id": "armor_045_锁子甲",
    "order": 45,
    "armorType": "锁子甲",
    "armorValue": "4",
    "movPenalty": "1",
    "coverage": "双臂、大腿、躯干、颈",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 46
    }
  },
  {
    "id": "armor_046_扎甲",
    "order": 46,
    "armorType": "扎甲",
    "armorValue": "4",
    "movPenalty": "1",
    "coverage": "双臂、大腿、躯干、颈",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 47
    }
  },
  {
    "id": "armor_047_鳞甲",
    "order": 47,
    "armorType": "鳞甲",
    "armorValue": "4",
    "movPenalty": "1",
    "coverage": "双臂、大腿、躯干、颈",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 48
    }
  },
  {
    "id": "armor_048_米兰盔甲",
    "order": 48,
    "armorType": "米兰盔甲",
    "armorValue": "5",
    "movPenalty": "1",
    "coverage": "除头部、全身",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 49
    }
  },
  {
    "id": "armor_049_藤甲",
    "order": 49,
    "armorType": "藤甲",
    "armorValue": "4",
    "movPenalty": "0",
    "coverage": "双臂、大腿、躯干、颈",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 50
    }
  },
  {
    "id": "armor_050_板甲",
    "order": 50,
    "armorType": "板甲",
    "armorValue": "5",
    "movPenalty": "1",
    "coverage": "除头部、全身",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 51
    }
  },
  {
    "id": "armor_051_胴丸",
    "order": 51,
    "armorType": "胴丸",
    "armorValue": "4",
    "movPenalty": "1",
    "coverage": "除头部、全身",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 52
    }
  },
  {
    "id": "armor_052_纸甲",
    "order": 52,
    "armorType": "纸甲",
    "armorValue": "3",
    "movPenalty": "0",
    "coverage": "双臂、大腿、躯干、颈",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 53
    }
  },
  {
    "id": "armor_053_防刺服",
    "order": 53,
    "armorType": "防刺服",
    "armorValue": "4",
    "movPenalty": "0",
    "coverage": "躯干",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "40",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 54
    }
  },
  {
    "id": "armor_054_常规防弹衣",
    "order": 54,
    "armorType": "常规防弹衣",
    "armorValue": "6",
    "movPenalty": "0",
    "coverage": "躯干",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 55
    }
  },
  {
    "id": "armor_055_防刺西服",
    "order": 55,
    "armorType": "防刺西服",
    "armorValue": "5",
    "movPenalty": "1",
    "coverage": "除头部、除手脚、全身",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "120",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 56
    }
  },
  {
    "id": "armor_056_军用防暴服",
    "order": 56,
    "armorType": "军用防暴服",
    "armorValue": "12",
    "movPenalty": "1",
    "coverage": "全身",
    "species": "人类、人型生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 57
    }
  },
  {
    "id": "armor_057_防化服",
    "order": 57,
    "armorType": "防化服",
    "armorValue": "耐毒性 氧气瓶",
    "movPenalty": "1",
    "coverage": "全身",
    "species": "人类、人型生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 58
    }
  },
  {
    "id": "armor_058_工作手套",
    "order": 58,
    "armorType": "工作手套",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "双手",
    "species": "拥有五指型手掌的生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "0.1/3",
    "category": "手脚四肢",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 59
    }
  },
  {
    "id": "armor_059_防刺手套",
    "order": 59,
    "armorType": "防刺手套",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "双手",
    "species": "拥有五指型手掌的生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "20",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 60
    }
  },
  {
    "id": "armor_060_冰球手套",
    "order": 60,
    "armorType": "冰球手套",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "双手",
    "species": "拥有五指型手掌的生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "5/20",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 61
    }
  },
  {
    "id": "armor_061_军用特种手套",
    "order": 61,
    "armorType": "军用特种手套",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "双手",
    "species": "拥有五指型手掌的生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 62
    }
  },
  {
    "id": "armor_062_电焊手套",
    "order": 62,
    "armorType": "电焊手套",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "双手",
    "species": "拥有五指型手掌的生物",
    "pierceResistant": "√",
    "era": "1920s,现代",
    "price": "5/20",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 63
    }
  },
  {
    "id": "armor_063_铁手甲",
    "order": 63,
    "armorType": "铁手甲",
    "armorValue": "2",
    "movPenalty": "0",
    "coverage": "双手",
    "species": "拥有五指型手掌的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 64
    }
  },
  {
    "id": "armor_064_雨靴",
    "order": 64,
    "armorType": "雨靴",
    "armorValue": "1",
    "movPenalty": "0",
    "coverage": "双脚",
    "species": "拥有站立功能的双腿的生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "0.5/10",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 65
    }
  },
  {
    "id": "armor_065_铁靴",
    "order": 65,
    "armorType": "铁靴",
    "armorValue": "2",
    "movPenalty": "1",
    "coverage": "双脚",
    "species": "拥有站立功能的双腿的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 66
    }
  },
  {
    "id": "armor_066_工业防护靴",
    "order": 66,
    "armorType": "工业防护靴",
    "armorValue": "2",
    "movPenalty": "1",
    "coverage": "双脚",
    "species": "拥有站立功能的双腿的生物",
    "pierceResistant": "×",
    "era": "1920s,现代",
    "price": "3/15",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 67
    }
  },
  {
    "id": "armor_067_pc防暴盾",
    "order": 67,
    "armorType": "PC防暴盾",
    "armorValue": "9",
    "movPenalty": "1",
    "coverage": "——",
    "species": "人类、可以拿起物品的生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "40",
    "category": "盾",
    "note": "用来阻止对方武器的进攻路线，以达到防护的目的",
    "extraNote": "这是一种非常小的盾牌，最小的种类半径不超过15厘米，与其说是让对方的武器打中盾牌以抵挡伤害，不如说是主动用盾牌去撞对方的武器。\n一般来说需要用【斗殴】判断有没有格挡下伤害。",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 68
    }
  },
  {
    "id": "armor_068_金属镇暴盾",
    "order": 68,
    "armorType": "金属镇暴盾",
    "armorValue": "25",
    "movPenalty": "1",
    "coverage": "——",
    "species": "人类、可以拿起物品的生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 69
    }
  },
  {
    "id": "armor_069_防弹钢盾",
    "order": 69,
    "armorType": "防弹钢盾",
    "armorValue": "30",
    "movPenalty": "2",
    "coverage": "——",
    "species": "人类、可以拿起物品的生物",
    "pierceResistant": "√",
    "era": "现代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 70
    }
  },
  {
    "id": "armor_070_格斗盾",
    "order": 70,
    "armorType": "格斗盾",
    "armorValue": "15",
    "movPenalty": "0",
    "coverage": "拳前",
    "species": "人类、有手的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 71
    }
  },
  {
    "id": "armor_071_圆木盾",
    "order": 71,
    "armorType": "圆木盾",
    "armorValue": "10",
    "movPenalty": "1",
    "coverage": "——",
    "species": "人类、可以拿起物品的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "extraNote": "剑柄与剑身间相隔的突出部分，欧洲剑通常拥有剑格，通常来说都是用来格挡攻击的，也有用于装饰的。\n虽然不是盾但是和盾的作用类似所以归在盾类型内。",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 72
    }
  },
  {
    "id": "armor_072_筝形盾",
    "order": 72,
    "armorType": "筝形盾",
    "armorValue": "15",
    "movPenalty": "1",
    "coverage": "——",
    "species": "人类、可以拿起物品的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 73
    }
  },
  {
    "id": "armor_073_圆铁盾",
    "order": 73,
    "armorType": "圆铁盾",
    "armorValue": "20",
    "movPenalty": "2",
    "coverage": "——",
    "species": "人类、可以拿起物品的生物",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 74
    }
  },
  {
    "id": "armor_074_剑格_护手",
    "order": 74,
    "armorType": "剑格、护手",
    "armorValue": "2",
    "movPenalty": "——",
    "coverage": "——",
    "species": "剑",
    "pierceResistant": "√",
    "era": "古代",
    "price": "N/A",
    "source": {
      "sheet": "防具表 载具表",
      "range": "B1:L76",
      "row": 75
    }
  }
];
