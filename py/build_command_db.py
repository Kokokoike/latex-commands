# category_structureへWorkshopのコマンドを追加
# コマンドごとにカテゴリやタグなどをまとめ

import requests
import json
import os

# ==========================================
# 設定
# ==========================================
OUTPUT_DIR = "data"
FILE_STRUCTURE = os.path.join(OUTPUT_DIR, "category_structure.json")
FILE_DB_OUT = os.path.join(OUTPUT_DIR, "command_database.json")

# 詳細情報のソース (LaTeX Workshop)
WORKSHOP_DATA_URL = "https://raw.githubusercontent.com/James-Yu/LaTeX-Workshop/master/data/commands.json"

# ==========================================
# ヘルパー関数
# ==========================================
def fetch_workshop_data():
    print(f"Downloading LaTeX Workshop data...")
    try:
        res = requests.get(WORKSHOP_DATA_URL)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"Error downloading data: {e}")
        return {}

def ensure_backslash(name):
    """ alpha -> \\alpha, \\beta -> \\beta """
    if name.startswith('\\'):
        return name
    return '\\' + name

def normalize_key_for_ws(name):
    """ \\alpha -> alpha (Workshop検索用) """
    return name.lstrip('\\')

# ==========================================
# メイン処理
# ==========================================
def main():
    if not os.path.exists(FILE_STRUCTURE):
        print(f"Error: {FILE_STRUCTURE} not found.")
        return

    # 1. データの準備
    with open(FILE_STRUCTURE, 'r', encoding='utf-8') as f:
        structure_data = json.load(f)

    workshop_data = fetch_workshop_data()
    if not workshop_data: return

    # 2. 現在構造データにあるコマンドを全把握
    existing_commands = set()

    def collect_existing(nodes):
        for node in nodes:
            if node.get("type") == "command":
                existing_commands.add(node["title"])
            
            if "items" in node and node["items"]:
                # 再帰 (type: command 以外)
                if node.get("type") != "command":
                    collect_existing(node["items"])

    collect_existing(structure_data)
    print(f"Currently classified commands: {len(existing_commands)}")

    # 3. 未分類 (Workshopにあるが構造にない) コマンドを抽出
    uncategorized_items = []
    
    for ws_key, ws_info in workshop_data.items():
        # コマンド名を正規化 (\付きにする)
        cmd_name = ensure_backslash(ws_key)
        
        if cmd_name not in existing_commands:
            # 新しいコマンドノードを作成
            new_node = {
                "title": cmd_name,
                "description": ws_info.get("detail") or ws_info.get("documentation") or "",
                "tag": [],
                "keywords": [],
                "type": "command"
            }
            uncategorized_items.append(new_node)
            existing_commands.add(cmd_name) # 重複追加防止

    print(f"Found {len(uncategorized_items)} uncategorized commands from Workshop.")

    # 4. category_structure.json を更新 (Uncategorizedを追加)
    if uncategorized_items:
        # 既に Uncategorized カテゴリがあるか確認
        uncat_node = next((n for n in structure_data if n["title"] == "Uncategorized"), None)
        
        if uncat_node:
            print("Updating existing 'Uncategorized' category...")
            # 既存のUncategorizedがあればマージする（重複しないように）
            current_titles = {item["title"] for item in uncat_node["items"]}
            for item in uncategorized_items:
                if item["title"] not in current_titles:
                    uncat_node["items"].append(item)
        else:
            print("Creating new 'Uncategorized' category...")
            structure_data.append({
                "title": "Uncategorized",
                "description": "Commands from LaTeX Workshop not found in the reference manual.",
                "tag": [],
                "keywords": [],
                "items": uncategorized_items
            })

        # 構造ファイルを上書き保存
        with open(FILE_STRUCTURE, 'w', encoding='utf-8') as f:
            json.dump(structure_data, f, indent=4, ensure_ascii=False)
        print(f"Updated structure saved to: {FILE_STRUCTURE}")

    # 5. データベース構築 (全コマンド対象)
    #    構造データを再トラバースしてパス情報を取得
    final_db = {}
    
    def build_db_recursive(nodes, current_path):
        for node in nodes:
            title = node.get("title", "")
            
            if node.get("type") == "command":
                cmd_name = title
                
                # DBエントリ作成
                entry = {
                    "command": cmd_name,
                    "description": node.get("description", ""),
                    "snippet": cmd_name,
                    "category_path": list(current_path),
                    "package": "",
                    "tags": [],
                    "isMathMode": False,
                    # "related": []  <-- 削除しました
                }

                # Workshopデータからの補完
                ws_key = normalize_key_for_ws(cmd_name)
                ws_info = workshop_data.get(ws_key)
                
                if ws_info:
                    # 説明文が構造データ側で空ならWorkshopを使う
                    if not entry["description"]:
                        entry["description"] = ws_info.get("detail") or ws_info.get("documentation") or ""
                    
                    if "snippet" in ws_info:
                        entry["snippet"] = ws_info["snippet"]
                    
                    if "package" in ws_info:
                        entry["package"] = ws_info["package"]
                        entry["tags"].append(ws_info["package"])

                # 数式モード簡易判定
                if any("Math" in p for p in current_path):
                    entry["isMathMode"] = True

                final_db[cmd_name] = entry

            # 子要素再帰
            if "items" in node and node["items"]:
                if node.get("type") != "command":
                    next_path = current_path + [title]
                    build_db_recursive(node["items"], next_path)

    print("Building command database...")
    build_db_recursive(structure_data, [])

    # 6. DB保存
    with open(FILE_DB_OUT, 'w', encoding='utf-8') as f:
        json.dump(final_db, f, indent=4, ensure_ascii=False)

    print("-" * 30)
    print(f"Complete!")
    print(f"Total Commands in DB: {len(final_db)}")
    print(f"Files updated:")
    print(f"  - {FILE_STRUCTURE} (Added Uncategorized)")
    print(f"  - {FILE_DB_OUT} (Full DB without related)")

if __name__ == "__main__":
    main()