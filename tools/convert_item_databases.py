from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

SRC_DIR = Path('.tmp_excel_extract/item_tables')
DATA_DIR = Path('data')


def as_text(value: Any) -> str:
    if value is None:
        return ''
    if isinstance(value, str):
        return value.replace('\r\n', '\n').replace('\r', '\n').strip()
    return str(value).strip()


def slugify(text: str, fallback: str) -> str:
    value = re.sub(r'[^0-9A-Za-z\u4e00-\u9fff]+', '_', text).strip('_').lower()
    return value or fallback


def read_exports() -> dict[str, dict[str, Any]]:
    exports: dict[str, dict[str, Any]] = {}
    for path in SRC_DIR.glob('*.json'):
        payload = json.loads(path.read_text(encoding='utf-8'))
        sheet = payload.get('sheet', '')
        range_ref = payload.get('range', '')
        if sheet == '武器列表 战斗':
            exports['weapons'] = payload
        elif sheet == '防具表 载具表' and range_ref == 'B1:L76':
            exports['armors'] = payload
        elif sheet == '防具表 载具表' and range_ref == 'Q1:AA64':
            exports['vehicles'] = payload
    missing = {'weapons', 'armors', 'vehicles'} - set(exports)
    if missing:
        raise SystemExit('missing exports: ' + ', '.join(sorted(missing)))
    return exports


def compact_item(item: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in item.items() if value not in ('', None)}


def convert_weapons(payload: dict[str, Any]) -> list[dict[str, Any]]:
    rows = payload['rows']
    items = []
    for index, row in enumerate(rows[1:], start=2):
        values = [as_text(value) for value in row]
        name = values[1] if len(values) > 1 else ''
        if not name or name.startswith('术语解释'):
            continue
        item = {
            'id': f"weapon_{len(items)+1:03d}_{slugify(name, 'item')}",
            'order': len(items) + 1,
            'name': name,
            'weaponType': name,
            'skill': values[2] if len(values) > 2 else '',
            'damage': values[3] if len(values) > 3 else '',
            'range': values[4] if len(values) > 4 else '',
            'penetrate': values[5] if len(values) > 5 else '',
            'attacks': values[6] if len(values) > 6 else '',
            'ammo': values[7] if len(values) > 7 else '',
            'malfunction': values[8] if len(values) > 8 else '',
            'era': values[9] if len(values) > 9 else '',
            'price': values[10] if len(values) > 10 else '',
            'invention': values[11] if len(values) > 11 else '',
            'source': {'sheet': payload['sheet'], 'range': payload['range'], 'row': index}
        }
        items.append(compact_item(item))
    return items


def convert_armors(payload: dict[str, Any]) -> list[dict[str, Any]]:
    rows = payload['rows']
    items = []
    excluded = {'请看【防具表】'}
    for index, row in enumerate(rows[1:], start=2):
        values = [as_text(value) for value in row]
        name = values[0] if values else ''
        if not name or name in excluded or name.startswith('术语解释'):
            continue
        item = {
            'id': f"armor_{len(items)+1:03d}_{slugify(name, 'item')}",
            'order': len(items) + 1,
            'armorType': name,
            'armorValue': values[1] if len(values) > 1 else '',
            'movPenalty': values[2] if len(values) > 2 else '',
            'coverage': values[3] if len(values) > 3 else '',
            'species': values[4] if len(values) > 4 else '',
            'pierceResistant': values[5] if len(values) > 5 else '',
            'era': values[6] if len(values) > 6 else '',
            'price': values[7] if len(values) > 7 else '',
            'category': values[8] if len(values) > 8 else '',
            'note': values[9] if len(values) > 9 else '',
            'extraNote': values[10] if len(values) > 10 else '',
            'source': {'sheet': payload['sheet'], 'range': payload['range'], 'row': index}
        }
        items.append(compact_item(item))
    return items


def convert_vehicles(payload: dict[str, Any]) -> list[dict[str, Any]]:
    rows = payload['rows']
    items = []
    for index, row in enumerate(rows[1:], start=2):
        values = [as_text(value) for value in row]
        name = values[0] if values else ''
        if not name or name.startswith('术语解释'):
            continue
        item = {
            'id': f"vehicle_{len(items)+1:03d}_{slugify(name, 'item')}",
            'order': len(items) + 1,
            'vehicleType': name,
            'skill': values[1] if len(values) > 1 else '',
            'mov': values[2] if len(values) > 2 else '',
            'build': values[3] if len(values) > 3 else '',
            'passengerArmor': values[4] if len(values) > 4 else '',
            'passengers': values[5] if len(values) > 5 else '',
            'drivableBuild': values[6] if len(values) > 6 else '',
            'rideableBuild': values[7] if len(values) > 7 else '',
            'era': values[8] if len(values) > 8 else '',
            'category': values[9] if len(values) > 9 else '',
            'note': values[10] if len(values) > 10 else '',
            'source': {'sheet': payload['sheet'], 'range': payload['range'], 'row': index}
        }
        items.append(compact_item(item))
    return items


def write_js(path: Path, const_name: str, items: list[dict[str, Any]], source: dict[str, str]) -> None:
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    header = [
        f"// {source['label']}数据库：由 COC7 空白卡 Excel「{source['sheet']}」{source['range']} 转换。",
        '// 仅作为本地原型的自动匹配数据源，不包含服务器或外部依赖。',
        f'const {const_name} = {payload};',
        ''
    ]
    path.write_text('\n'.join(header), encoding='utf-8')


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    exports = read_exports()
    weapons = convert_weapons(exports['weapons'])
    armors = convert_armors(exports['armors'])
    vehicles = convert_vehicles(exports['vehicles'])
    write_js(DATA_DIR / 'weapons.js', 'weaponDatabase', weapons, {'label': '武器', 'sheet': exports['weapons']['sheet'], 'range': exports['weapons']['range']})
    write_js(DATA_DIR / 'armors.js', 'armorDatabase', armors, {'label': '防具', 'sheet': exports['armors']['sheet'], 'range': exports['armors']['range']})
    write_js(DATA_DIR / 'vehicles.js', 'vehicleDatabase', vehicles, {'label': '载具', 'sheet': exports['vehicles']['sheet'], 'range': exports['vehicles']['range']})
    print(json.dumps({
        'weapons': len(weapons),
        'armors': len(armors),
        'vehicles': len(vehicles),
        'sampleWeapon': weapons[0] if weapons else None,
        'sampleArmor': armors[0] if armors else None,
        'sampleVehicle': vehicles[0] if vehicles else None,
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
