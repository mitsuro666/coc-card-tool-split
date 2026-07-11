// 载具数据库：由 COC7 空白卡 Excel「防具表 载具表」Q1:AA64 转换。
// 仅作为本地原型的自动匹配数据源，不包含服务器或外部依赖。
const vehicleDatabase = [
  {
    "id": "vehicle_001_经济车",
    "order": 1,
    "vehicleType": "经济车",
    "skill": "汽车驾驶",
    "mov": "13",
    "build": "4",
    "passengerArmor": "1",
    "passengers": "3或4",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "≤2",
    "era": "现代",
    "category": "机动车",
    "note": "规则书内的载具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 2
    }
  },
  {
    "id": "vehicle_002_标准车",
    "order": 2,
    "vehicleType": "标准车",
    "skill": "汽车驾驶",
    "mov": "14",
    "build": "5",
    "passengerArmor": "2",
    "passengers": "4",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 3
    }
  },
  {
    "id": "vehicle_003_豪华车",
    "order": 3,
    "vehicleType": "豪华车",
    "skill": "汽车驾驶",
    "mov": "15",
    "build": "6",
    "passengerArmor": "2",
    "passengers": "4",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 4
    }
  },
  {
    "id": "vehicle_004_跑车",
    "order": 4,
    "vehicleType": "跑车",
    "skill": "汽车驾驶",
    "mov": "16",
    "build": "5",
    "passengerArmor": "2",
    "passengers": "1",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "——",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 5
    }
  },
  {
    "id": "vehicle_005_敞篷小卡车",
    "order": 5,
    "vehicleType": "敞篷小卡车",
    "skill": "汽车驾驶",
    "mov": "14",
    "build": "6",
    "passengerArmor": "2",
    "passengers": "2+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3/后斗≤4",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 6
    }
  },
  {
    "id": "vehicle_006_6吨卡车",
    "order": 6,
    "vehicleType": "6吨卡车",
    "skill": "汽车驾驶",
    "mov": "13",
    "build": "7",
    "passengerArmor": "2",
    "passengers": "2+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3/后斗≤4",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 7
    }
  },
  {
    "id": "vehicle_007_半拖车",
    "order": 7,
    "vehicleType": "半拖车",
    "skill": "汽车驾驶",
    "mov": "13",
    "build": "9",
    "passengerArmor": "2",
    "passengers": "3+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3/后斗≤6",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 8
    }
  },
  {
    "id": "vehicle_008_轻摩托",
    "order": 8,
    "vehicleType": "轻摩托",
    "skill": "汽车驾驶",
    "mov": "13",
    "build": "1",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 9
    }
  },
  {
    "id": "vehicle_009_重摩托",
    "order": 9,
    "vehicleType": "重摩托",
    "skill": "汽车驾驶",
    "mov": "16",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 10
    }
  },
  {
    "id": "vehicle_010_坦克",
    "order": 10,
    "vehicleType": "坦克",
    "skill": "重型机械 或 专业训练",
    "mov": "11",
    "build": "20",
    "passengerArmor": "24",
    "passengers": "4",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "-1至2",
    "era": "1920s,现代",
    "category": "重型载具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 11
    }
  },
  {
    "id": "vehicle_011_蒸汽列车",
    "order": 11,
    "vehicleType": "蒸汽列车",
    "skill": "重型机械 或 专业训练",
    "mov": "12",
    "build": "12",
    "passengerArmor": "1",
    "passengers": "400+",
    "drivableBuild": "-1至3",
    "rideableBuild": "≤3，露天车厢≤4",
    "era": "1920s",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 12
    }
  },
  {
    "id": "vehicle_012_现代列车",
    "order": 12,
    "vehicleType": "现代列车",
    "skill": "重型机械 或 专业训练",
    "mov": "15",
    "build": "14",
    "passengerArmor": "2",
    "passengers": "400+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 13
    }
  },
  {
    "id": "vehicle_013_马_有骑手",
    "order": 13,
    "vehicleType": "马（有骑手）",
    "skill": "骑乘",
    "mov": "11",
    "build": "4",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "自从人类存在",
    "category": "其他载具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 14
    }
  },
  {
    "id": "vehicle_014_四马马车",
    "order": 14,
    "vehicleType": "四马马车",
    "skill": "马车驾驶",
    "mov": "10",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "6+",
    "drivableBuild": "≤3",
    "rideableBuild": "≤3/后斗≤4",
    "era": "1920s",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 15
    }
  },
  {
    "id": "vehicle_015_自行车",
    "order": 15,
    "vehicleType": "自行车",
    "skill": "骑乘",
    "mov": "10",
    "build": "0.5",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 16
    }
  },
  {
    "id": "vehicle_016_划艇",
    "order": 16,
    "vehicleType": "划艇",
    "skill": "驾驶：船",
    "mov": "4",
    "build": "2",
    "passengerArmor": "0",
    "passengers": "3",
    "drivableBuild": "-2至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "category": "水\n上\n载\n具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 17
    }
  },
  {
    "id": "vehicle_017_气垫船",
    "order": 17,
    "vehicleType": "气垫船",
    "skill": "驾驶：船",
    "mov": "12",
    "build": "4",
    "passengerArmor": "0",
    "passengers": "22",
    "drivableBuild": "-2至3",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 18
    }
  },
  {
    "id": "vehicle_018_摩托艇",
    "order": 18,
    "vehicleType": "摩托艇",
    "skill": "驾驶：快艇",
    "mov": "14",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "6",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 19
    }
  },
  {
    "id": "vehicle_019_游轮",
    "order": 19,
    "vehicleType": "游轮",
    "skill": "驾驶：船",
    "mov": "11",
    "build": "32",
    "passengerArmor": "0（甲板上）",
    "passengers": "至少2200",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤4",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 20
    }
  },
  {
    "id": "vehicle_020_战列舰",
    "order": 20,
    "vehicleType": "战列舰",
    "skill": "驾驶：轮船",
    "mov": "11",
    "build": "65",
    "passengerArmor": "0（甲板上）",
    "passengers": "至少1800",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤4",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 21
    }
  },
  {
    "id": "vehicle_021_航空母舰",
    "order": 21,
    "vehicleType": "航空母舰",
    "skill": "驾驶：战舰",
    "mov": "11",
    "build": "75",
    "passengerArmor": "0（甲板上）",
    "passengers": "至少3200",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤6",
    "era": "罕见/现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 22
    }
  },
  {
    "id": "vehicle_022_潜水艇",
    "order": 22,
    "vehicleType": "潜水艇",
    "skill": "驾驶：战舰",
    "mov": "12",
    "build": "24",
    "passengerArmor": "0（甲板上）",
    "passengers": "至少120",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤4",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 23
    }
  },
  {
    "id": "vehicle_023_公共汽车",
    "order": 23,
    "vehicleType": "公共汽车",
    "skill": "汽车驾驶",
    "mov": "12",
    "build": "6",
    "passengerArmor": "2",
    "passengers": "80",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "category": "地面载具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 24
    }
  },
  {
    "id": "vehicle_024_双层公交车",
    "order": 24,
    "vehicleType": "双层公交车",
    "skill": "汽车驾驶",
    "mov": "12",
    "build": "7",
    "passengerArmor": "2",
    "passengers": "200",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 25
    }
  },
  {
    "id": "vehicle_025_大客车",
    "order": 25,
    "vehicleType": "大客车",
    "skill": "汽车驾驶",
    "mov": "12",
    "build": "6",
    "passengerArmor": "2",
    "passengers": "50",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 26
    }
  },
  {
    "id": "vehicle_026_纯电动汽车",
    "order": 26,
    "vehicleType": "纯电动汽车",
    "skill": "汽车驾驶",
    "mov": "14",
    "build": "5",
    "passengerArmor": "2",
    "passengers": "3或4",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "≤2",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 27
    }
  },
  {
    "id": "vehicle_027_电动摩托",
    "order": 27,
    "vehicleType": "电动摩托",
    "skill": "汽车驾驶",
    "mov": "11",
    "build": "1",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 28
    }
  },
  {
    "id": "vehicle_028_全地形车",
    "order": 28,
    "vehicleType": "全地形车",
    "skill": "汽车驾驶",
    "mov": "14",
    "build": "4",
    "passengerArmor": "0",
    "passengers": "2",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 29
    }
  },
  {
    "id": "vehicle_029_吉普车",
    "order": 29,
    "vehicleType": "吉普车",
    "skill": "汽车驾驶",
    "mov": "14",
    "build": "6",
    "passengerArmor": "2",
    "passengers": "5",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 30
    }
  },
  {
    "id": "vehicle_030_平衡车",
    "order": 30,
    "vehicleType": "平衡车",
    "skill": "敏捷",
    "mov": "MOV+1",
    "build": "-1",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 31
    }
  },
  {
    "id": "vehicle_031_冰刀_滑板_旱冰鞋等",
    "order": 31,
    "vehicleType": "冰刀、滑板、旱冰鞋等",
    "skill": "敏捷",
    "mov": "MOV+1",
    "build": "-1",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 32
    }
  },
  {
    "id": "vehicle_032_驴",
    "order": 32,
    "vehicleType": "驴",
    "skill": "骑术",
    "mov": "8",
    "build": "4",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 33
    }
  },
  {
    "id": "vehicle_033_拖拉机",
    "order": 33,
    "vehicleType": "拖拉机",
    "skill": "汽车驾驶",
    "mov": "10",
    "build": "-2",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 34
    }
  },
  {
    "id": "vehicle_034_工业用车_挖掘机_打桩机等",
    "order": 34,
    "vehicleType": "工业用车（挖掘机、打桩机等）",
    "skill": "重型机械操作、专业训练",
    "mov": "10",
    "build": "4",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 35
    }
  },
  {
    "id": "vehicle_035_非马畜力车_雪橇",
    "order": 35,
    "vehicleType": "非马畜力车、雪橇",
    "skill": "骑乘或马车驾驶",
    "mov": "9",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "2",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 36
    }
  },
  {
    "id": "vehicle_036_民用航空",
    "order": 36,
    "vehicleType": "民用航空",
    "skill": "重型机械 或 专业训练",
    "mov": "19",
    "build": "65",
    "passengerArmor": "10",
    "passengers": "300",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "category": "空中载具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 37
    }
  },
  {
    "id": "vehicle_037_战斗机",
    "order": 37,
    "vehicleType": "战斗机",
    "skill": "专业训练",
    "mov": "20",
    "build": "45",
    "passengerArmor": "15",
    "passengers": "1",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "≤1",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 38
    }
  },
  {
    "id": "vehicle_038_轰炸机",
    "order": 38,
    "vehicleType": "轰炸机",
    "skill": "专业训练",
    "mov": "19",
    "build": "53",
    "passengerArmor": "20",
    "passengers": "2",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "≤1",
    "era": "1920s,现代",
    "note": "无人机并不是载具，但是很常见所以写在这里。",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 39
    }
  },
  {
    "id": "vehicle_039_私人飞机",
    "order": 39,
    "vehicleType": "私人飞机",
    "skill": "重型机械 或 专业训练",
    "mov": "18",
    "build": "35",
    "passengerArmor": "7",
    "passengers": "4人以上",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 40
    }
  },
  {
    "id": "vehicle_040_涡轮喷气机",
    "order": 40,
    "vehicleType": "涡轮喷气机",
    "skill": "重型机械 或 专业训练",
    "mov": "18",
    "build": "60",
    "passengerArmor": "15",
    "passengers": "2",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "≤1",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 41
    }
  },
  {
    "id": "vehicle_041_货机",
    "order": 41,
    "vehicleType": "货机",
    "skill": "重型机械 或 专业训练",
    "mov": "16",
    "build": "64",
    "passengerArmor": "10",
    "passengers": "2",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "note": "热气球几乎不具备任何动力系统\n通常依靠释放一定的热气、或者靠风力移动",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 42
    }
  },
  {
    "id": "vehicle_042_超音速飞机",
    "order": 42,
    "vehicleType": "超音速飞机",
    "skill": "专业训练",
    "mov": "20+",
    "build": "35",
    "passengerArmor": "20",
    "passengers": "1",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "——",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 43
    }
  },
  {
    "id": "vehicle_043_直升机",
    "order": 43,
    "vehicleType": "直升机",
    "skill": "重型机械 或 专业训练",
    "mov": "15",
    "build": "20",
    "passengerArmor": "4",
    "passengers": "8",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 44
    }
  },
  {
    "id": "vehicle_044_无人机",
    "order": 44,
    "vehicleType": "无人机",
    "skill": "智力",
    "mov": "14",
    "build": "-2",
    "passengerArmor": "0",
    "passengers": "——",
    "drivableBuild": "——",
    "rideableBuild": "——",
    "era": "现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 45
    }
  },
  {
    "id": "vehicle_045_热气球",
    "order": 45,
    "vehicleType": "热气球",
    "skill": "重型机械 或 专业训练",
    "mov": "——",
    "build": "6",
    "passengerArmor": "0",
    "passengers": "9",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 46
    }
  },
  {
    "id": "vehicle_046_双翼机",
    "order": 46,
    "vehicleType": "双翼机",
    "skill": "重型机械 或 专业训练",
    "mov": "12",
    "build": "20",
    "passengerArmor": "2",
    "passengers": "1或2",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "≤1",
    "era": "1920s",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 47
    }
  },
  {
    "id": "vehicle_047_滑翔翼",
    "order": 47,
    "vehicleType": "滑翔翼",
    "skill": "专业训练",
    "mov": "12",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "1或2",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "≤1",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 48
    }
  },
  {
    "id": "vehicle_048_独木舟",
    "order": 48,
    "vehicleType": "独木舟",
    "skill": "驾驶：船",
    "mov": "9",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "1或2",
    "drivableBuild": "-1,0,1",
    "rideableBuild": "-1,0,1",
    "era": "古代",
    "category": "水上载具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 49
    }
  },
  {
    "id": "vehicle_049_木筏",
    "order": 49,
    "vehicleType": "木筏",
    "skill": "驾驶：船",
    "mov": "9",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "最多4",
    "drivableBuild": "-2至3",
    "rideableBuild": "≤3",
    "era": "古代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 50
    }
  },
  {
    "id": "vehicle_050_现代帆船",
    "order": 50,
    "vehicleType": "现代帆船",
    "skill": "驾驶：帆船",
    "mov": "12",
    "build": "4",
    "passengerArmor": "0",
    "passengers": "13",
    "drivableBuild": "-2至3",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 51
    }
  },
  {
    "id": "vehicle_051_比赛帆船",
    "order": 51,
    "vehicleType": "比赛帆船",
    "skill": "驾驶：帆船",
    "mov": "取决于风速",
    "build": "3",
    "passengerArmor": "0",
    "passengers": "1",
    "drivableBuild": "-1至2",
    "rideableBuild": "——",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 52
    }
  },
  {
    "id": "vehicle_052_渡河小船",
    "order": 52,
    "vehicleType": "渡河小船",
    "skill": "驾驶：船",
    "mov": "8",
    "build": "5",
    "passengerArmor": "0",
    "passengers": "12",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "古代至今",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 53
    }
  },
  {
    "id": "vehicle_053_快艇",
    "order": 53,
    "vehicleType": "快艇",
    "skill": "驾驶：快艇",
    "mov": "13",
    "build": "5",
    "passengerArmor": "0",
    "passengers": "9",
    "drivableBuild": "-2至2",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 54
    }
  },
  {
    "id": "vehicle_054_货轮",
    "order": 54,
    "vehicleType": "货轮",
    "skill": "驾驶：轮船",
    "mov": "10",
    "build": "12",
    "passengerArmor": "0（甲板上）",
    "passengers": "15+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤6",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 55
    }
  },
  {
    "id": "vehicle_055_客船",
    "order": 55,
    "vehicleType": "客船",
    "skill": "驾驶：轮船",
    "mov": "10",
    "build": "11",
    "passengerArmor": "0（甲板上）",
    "passengers": "600+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 56
    }
  },
  {
    "id": "vehicle_056_海上移动钻井平台",
    "order": 56,
    "vehicleType": "海上移动钻井平台",
    "skill": "重型机械操作",
    "mov": "7",
    "build": "90",
    "passengerArmor": "0（甲板上）",
    "passengers": "50左右",
    "drivableBuild": "-1至3",
    "rideableBuild": "≤5",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 57
    }
  },
  {
    "id": "vehicle_057_地铁",
    "order": 57,
    "vehicleType": "地铁",
    "skill": "重型机械操作、专业训练",
    "mov": "13",
    "build": "16",
    "passengerArmor": "6",
    "passengers": "1800+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "现代",
    "category": "固定路线载具",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 58
    }
  },
  {
    "id": "vehicle_058_有轨电车",
    "order": 58,
    "vehicleType": "有轨电车",
    "skill": "重型机械操作、专业训练",
    "mov": "11",
    "build": "8",
    "passengerArmor": "4",
    "passengers": "400+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "1920s,现代",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 59
    }
  },
  {
    "id": "vehicle_059_空中轨道列车",
    "order": 59,
    "vehicleType": "空中轨道列车",
    "skill": "重型机械操作、专业训练",
    "mov": "11",
    "build": "6",
    "passengerArmor": "2",
    "passengers": "300+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "现代",
    "note": "MOV与速度对照值",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 60
    }
  },
  {
    "id": "vehicle_060_观光缆车",
    "order": 60,
    "vehicleType": "观光缆车",
    "skill": "计算机使用",
    "mov": "8",
    "build": "4",
    "passengerArmor": "2",
    "passengers": "2或4",
    "drivableBuild": "——",
    "rideableBuild": "≤2",
    "era": "1920s,现代",
    "note": "MOV",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 61
    }
  },
  {
    "id": "vehicle_061_高速铁路",
    "order": 61,
    "vehicleType": "高速铁路",
    "skill": "重型机械操作、专业训练",
    "mov": "15",
    "build": "35",
    "passengerArmor": "3",
    "passengers": "600+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "现代",
    "note": "MPH",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 62
    }
  },
  {
    "id": "vehicle_062_磁悬浮列车",
    "order": 62,
    "vehicleType": "磁悬浮列车",
    "skill": "重型机械操作、专业训练",
    "mov": "16",
    "build": "30",
    "passengerArmor": "3",
    "passengers": "500+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤3",
    "era": "现代",
    "note": "MOV",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 63
    }
  },
  {
    "id": "vehicle_063_轨道公交车",
    "order": 63,
    "vehicleType": "轨道公交车",
    "skill": "重型机械操作、专业训练",
    "mov": "13",
    "build": "16",
    "passengerArmor": "2",
    "passengers": "200+",
    "drivableBuild": "-1至2",
    "rideableBuild": "≤2",
    "era": "现代",
    "note": "MPH",
    "source": {
      "sheet": "防具表 载具表",
      "range": "Q1:AA64",
      "row": 64
    }
  }
];
