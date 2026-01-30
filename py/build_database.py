import requests
import json
import os

# ==========================================
# 設定
# ==========================================
OUTPUT_DIR = "data_src"
WORKSHOP_DATA_URL = "https://raw.githubusercontent.com/James-Yu/LaTeX-Workshop/master/data/commands.json"

FILE_MAPPING_SRC = os.path.join(OUTPUT_DIR, "command_to_category.json") # マニュアル由来
FILE_DB_FULL = os.path.join(OUTPUT_DIR, "command_database_full.json")   # 完成DB
FILE_CAT_TO_CMD = os.path.join(OUTPUT_DIR, "category_to_commands.json")  # 逆引き

def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def fetch_workshop_data():
    print(f"Downloading LaTeX Workshop data...")
    try:
        res = requests.get(WORKSHOP_DATA_URL)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"Error downloading data: {e}")
        return {}

def normalize_cmd(name):
    """コマンド名を正規化する（先頭に \ をつける）"""
    if name.startswith('\\'):
        return name
    return '\\' + name

def main():
    # 1. データ読み込み
    manual_mapping = load_json(FILE_MAPPING_SRC) # キーは "\alpha" 形式
    workshop_data = fetch_workshop_data()        # キーは "alpha" 形式が多い
    
    if not manual_mapping or not workshop_data:
        print("Error: Missing data sources.")
        return

    master_db = {}
    category_index = {}

    # ---------------------------------------------------------
    # Phase 1: LaTeX Workshop のデータをベースに構築
    # ---------------------------------------------------------
    print("Phase 1: Processing LaTeX Workshop data...")
    
    for raw_key, ws_info in workshop_data.items():
        # キーを正規化 (alpha -> \alpha)
        cmd_key = normalize_cmd(raw_key)

        entry = {
            "command": cmd_key,
            "snippet": ws_info.get("snippet", ""),
            "description": ws_info.get("detail", ws_info.get("documentation", "")),
            "package": ws_info.get("package", ""),
            "category_path": ["Uncategorized"],
            "source_url": "",
            "tags": []
        }

        # マニュアルとの照合
        if cmd_key in manual_mapping:
            mapping = manual_mapping[cmd_key]
            path = [mapping["category_root"]]
            if mapping["category_sub"]: path.append(mapping["category_sub"])
            if mapping.get("category_subsub"): path.append(mapping["category_subsub"])
            
            entry["category_path"] = path
            entry["source_url"] = mapping["source_url"]
            entry["source_type"] = "manual+workshop"
        
        # パッケージ情報による分類
        elif entry["package"]:
            entry["category_path"] = ["Packages", entry["package"]]
            entry["tags"].append(entry["package"])
            entry["source_type"] = "workshop_package"
        
        else:
            entry["source_type"] = "workshop_only"

        master_db[cmd_key] = entry

    # ---------------------------------------------------------
    # Phase 2: マニュアルにしかないコマンドを追加 (不足分の補完)
    # ---------------------------------------------------------
    print("Phase 2: Merging missing commands from Unofficial Manual...")
    
    added_count = 0
    for manual_cmd, map_info in manual_mapping.items():
        # すでにPhase 1で登録済みならスキップ
        if manual_cmd in master_db:
            continue

        # 新規作成
        path = [map_info["category_root"]]
        if map_info["category_sub"]: path.append(map_info["category_sub"])
        if map_info.get("category_subsub"): path.append(map_info["category_subsub"])

        entry = {
            "command": manual_cmd,
            "snippet": manual_cmd, # スニペット情報は無いのでコマンド名で代用
            "description": "See reference manual.", # 説明文も無い
            "package": "",
            "category_path": path,
            "source_url": map_info["source_url"],
            "tags": [],
            "source_type": "manual_only" # マニュアルのみに存在
        }
        
        master_db[manual_cmd] = entry
        added_count += 1

    print(f"  -> Added {added_count} commands from Manual.")

    # ---------------------------------------------------------
    # Phase 3: 逆引きインデックスの再構築
    # ---------------------------------------------------------
    print("Phase 3: Building Category Index...")
    
    for cmd_key, entry in master_db.items():
        # パスを文字列化
        path_str = " / ".join(entry["category_path"])
        
        if path_str not in category_index:
            category_index[path_str] = []
        category_index[path_str].append(cmd_key)

    # ---------------------------------------------------------
    # 保存
    # ---------------------------------------------------------
    with open(FILE_DB_FULL, 'w', encoding='utf-8') as f:
        json.dump(master_db, f, indent=4, ensure_ascii=False)
    
    with open(FILE_CAT_TO_CMD, 'w', encoding='utf-8') as f:
        json.dump(category_index, f, indent=4, ensure_ascii=False)

    print("-" * 30)
    print("Database Build Complete!")
    print(f"Total Commands: {len(master_db)}")
    print(f"Total Categories: {len(category_index)}")
    print(f"Saved to {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()