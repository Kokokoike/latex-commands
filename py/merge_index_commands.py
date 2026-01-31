# ccategory_structure.json内へコマンドを集約

import requests
from bs4 import BeautifulSoup
import json
import re
import os

# ==========================================
# 設定
# ==========================================
OUTPUT_DIR = "data"
INDEX_URL = "https://latexref.xyz/Index.html"
FILE_STRUCTURE_IN = os.path.join(OUTPUT_DIR, "category_structure.json")
FILE_STRUCTURE_OUT = os.path.join(OUTPUT_DIR, "category_structure_with_commands.json")

# ==========================================
# 関数
# ==========================================
def get_soup(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    try:
        print(f"Fetching: {url}")
        res = requests.get(url, headers=headers)
        res.encoding = res.apparent_encoding
        res.raise_for_status()
        return BeautifulSoup(res.text, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def clean_command_name(text):
    if text.startswith(r"\ "): 
        return r"\ "
    return text.split()[0]

def main():
    if not os.path.exists(FILE_STRUCTURE_IN):
        print(f"Error: {FILE_STRUCTURE_IN} not found. Run rebuild_structure.py first.")
        return

    # 1. 構造データの読み込み
    with open(FILE_STRUCTURE_IN, 'r', encoding='utf-8') as f:
        structure_data = json.load(f)

    # 2. Index.html から (コマンド, カテゴリ) の辞書を作成
    soup = get_soup(INDEX_URL)
    if not soup: return

    category_map = {}
    rows = soup.find_all("tr")
    print(f"Found {len(rows)} rows in Index. Analyzing...")

    count = 0
    for row in rows:
        entry_td = row.find("td", class_="printindex-index-entry")
        section_td = row.find("td", class_="printindex-index-section")

        if entry_td and section_td:
            cmd_text = entry_td.get_text(strip=True)
            
            if not cmd_text.startswith("\\"):
                continue

            cmd_clean = clean_command_name(cmd_text)
            sec_text = section_td.get_text(strip=True)
            
            if sec_text not in category_map:
                category_map[sec_text] = []
            
            if cmd_clean not in category_map[sec_text]:
                category_map[sec_text].append(cmd_clean)
                count += 1

    print(f"Extracted {count} commands across {len(category_map)} categories.")

    # 3. 構造データへの統合（再帰処理・修正版）
    
    def inject_commands(nodes):
        for node in nodes:
            # ノードにタイトルがない場合はスキップ
            if "title" not in node:
                continue

            title = node["title"]
            
            # --- 修正箇所: itemsキーがなければ作成する安全策 ---
            if "items" not in node:
                node["items"] = []
            # --------------------------------------------------

            # このカテゴリに対応するコマンドがあれば items に追加
            if title in category_map:
                commands = category_map[title]
                for cmd in commands:
                    # コマンドノードの作成
                    cmd_node = {
                        "title": cmd,
                        "description": "",
                        "tag": [],
                        "keywords": [],
                        "related":[], 
                        "type": "command"
                    }
                    node["items"].append(cmd_node)

            # 子要素があれば再帰的に処理
            # itemsがリストであることを確認してから再帰
            if len(node["items"]) > 0:
                # コマンドノード自体は items を持たないので、リストの中身が辞書の場合のみ進むなどのガードも可能だが
                # 今回は type check で制御してもよい。
                # ここでは単純に再帰するが、無限ループ防止のため type:command は潜らないようにする
                
                # type キーがない、または type が command でないものだけ潜る
                if node.get("type") != "command":
                     inject_commands(node["items"])

    print("Merging commands into structure...")
    inject_commands(structure_data)

    # 4. 保存
    with open(FILE_STRUCTURE_OUT, 'w', encoding='utf-8') as f:
        json.dump(structure_data, f, indent=4, ensure_ascii=False)

    print(f"Success! Saved merged data to: {FILE_STRUCTURE_OUT}")

if __name__ == "__main__":
    main()