import requests
from bs4 import BeautifulSoup
import json
import re
import os

# ==========================================
# 設定
# ==========================================
OUTPUT_DIR = "data_src"
TOC_URL = "https://latexref.xyz/index.html"
INDEX_URL = "https://latexref.xyz/Command-Index.html"

FILE_STRUCTURE = os.path.join(OUTPUT_DIR, "category_structure.json")
FILE_CMD_TO_CAT = os.path.join(OUTPUT_DIR, "command_to_category.json")
FILE_CAT_TO_CMD = os.path.join(OUTPUT_DIR, "category_to_commands.json")

# ==========================================
# ユーティリティ関数
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

def clean_title(text):
    return re.sub(r'^\d+(\.\d+)*\s*', '', text.strip())

def extract_link_info(li_element):
    a_tag = li_element.find("a")
    if not a_tag: return None, None
    title = clean_title(a_tag.get_text())
    href = a_tag.get('href')
    filename = href.split('#')[0] if href else ""
    return title, filename

# ==========================================
# メイン処理
# ==========================================
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # --------------------------------------
    # Step 1: 目次解析 (URLからカテゴリパスを特定)
    # --------------------------------------
    soup_toc = get_soup(TOC_URL)
    if not soup_toc: return

    url_to_category_path = {}
    structure_data = []

    contents_div = soup_toc.find("div", class_="contents") or soup_toc.find("body")
    root_ul = (contents_div.find("ul", class_="no-bullet") or 
               contents_div.find("ul", class_="toc") or 
               contents_div.find("ul"))

    if root_ul:
        for li_chap in root_ul.find_all("li", recursive=False):
            chap_title, chap_file = extract_link_info(li_chap)
            if not chap_title: continue
            category_node = { "title": chap_title, "children": [] }
            if chap_file: url_to_category_path[chap_file] = [chap_title]

            ul_sec = li_chap.find("ul")
            if ul_sec:
                for li_sec in ul_sec.find_all("li", recursive=False):
                    sec_title, sec_file = extract_link_info(li_sec)
                    if not sec_title: continue
                    sec_node = { "title": sec_title, "children": [] }
                    if sec_file: url_to_category_path[sec_file] = [chap_title, sec_title]

                    ul_subsec = li_sec.find("ul")
                    if ul_subsec:
                        for li_subsec in ul_subsec.find_all("li", recursive=False):
                            subsec_title, subsec_file = extract_link_info(li_subsec)
                            if not subsec_title: continue
                            sec_node["children"].append({ "title": subsec_title })
                            if subsec_file: url_to_category_path[subsec_file] = [chap_title, sec_title, subsec_title]
                    category_node["children"].append(sec_node)
            structure_data.append(category_node)

    with open(FILE_STRUCTURE, 'w', encoding='utf-8') as f:
        json.dump(structure_data, f, indent=4, ensure_ascii=False)

    # --------------------------------------
    # Step 2: 索引解析 (双方向データの生成)
    # --------------------------------------
    soup_idx = get_soup(INDEX_URL)
    if not soup_idx: return

    cmd_to_cat = {}  # コマンド -> カテゴリ
    cat_to_cmd = {}  # カテゴリパス -> [コマンド一覧]

    links = soup_idx.select('div.index-cp a, table.index-cp a, body a')
    print(f"Generating bidirectional data from {len(links)} index entries...")

    for a in links:
        cmd_name = a.get_text(strip=True)
        # フィルタリング: \で始まるか環境名
        if not (cmd_name.startswith('\\') or '{' in cmd_name or 'environment' in a.get('href', '')):
             continue

        href = a.get('href')
        if not href or '#' not in href: continue

        target_filename = href.split('#')[0]
        category_path = url_to_category_path.get(target_filename, ["Uncategorized"])

        # フルパス文字列を作成 (例: "Math formulas / Math symbols / Arrows")
        path_string = " / ".join(category_path)

        # 1. Command-to-Category データの作成
        cmd_to_cat[cmd_name] = {
            "category_path": category_path,
            "source_url": f"https://latexref.xyz/{href}"
        }

        # 2. Category-to-Commands データの作成
        if path_string not in cat_to_cmd:
            cat_to_cmd[path_string] = []
        if cmd_name not in cat_to_cmd[path_string]:
            cat_to_cmd[path_string].append(cmd_name)

    # 保存
    with open(FILE_CMD_TO_CAT, 'w', encoding='utf-8') as f:
        json.dump(cmd_to_cat, f, indent=4, ensure_ascii=False)
    
    with open(FILE_CAT_TO_CMD, 'w', encoding='utf-8') as f:
        json.dump(cat_to_cmd, f, indent=4, ensure_ascii=False)

    print(f"Success!")
    print(f"- {FILE_CMD_TO_CAT} (Command lookup)")
    print(f"- {FILE_CAT_TO_CMD} (Category listing)")

if __name__ == "__main__":
    main()