import requests
from bs4 import BeautifulSoup
import json
import re
import os

# ==========================================
# 設定
# ==========================================
# 保存先（HTMLが読み込んでいる場所に合わせて変更してください）
OUTPUT_DIR = "data" 
FILE_STRUCTURE = os.path.join(OUTPUT_DIR, "category_structure.json")

# スクレイピング対象
TOC_URL = "https://latexref.xyz/index.html"

# ==========================================
# 関数定義
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
    # アンカーのみの場合はファイル名は空文字とするなどの処理が必要ならここに追加
    return title, href

def create_node(title):
    """指定された形式のノードを作成"""
    return {
        "title": title,
        "description": "", # はじめは空
        "tag": [],        # はじめは空
        "keywords": [],   # はじめは空
        "items": []       # children の代わりに items
    }

# ==========================================
# メイン処理
# ==========================================
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    soup = get_soup(TOC_URL)
    if not soup: return

    structure_data = []

    # 目次エリアの取得
    contents_div = soup.find("div", class_="contents") or soup.find("body")
    root_ul = (contents_div.find("ul", class_="no-bullet") or 
               contents_div.find("ul", class_="toc") or 
               contents_div.find("ul"))

    if root_ul:
        # Loop 1: Chapter (Top Level)
        for li_chap in root_ul.find_all("li", recursive=False):
            chap_title, _ = extract_link_info(li_chap)
            if not chap_title: continue

            chap_node = create_node(chap_title)

            # Loop 2: Section
            ul_sec = li_chap.find("ul")
            if ul_sec:
                for li_sec in ul_sec.find_all("li", recursive=False):
                    sec_title, _ = extract_link_info(li_sec)
                    if not sec_title: continue

                    sec_node = create_node(sec_title)

                    # Loop 3: Subsection
                    ul_subsec = li_sec.find("ul")
                    if ul_subsec:
                        for li_subsec in ul_subsec.find_all("li", recursive=False):
                            subsec_title, _ = extract_link_info(li_subsec)
                            if not subsec_title: continue
                            
                            subsec_node = create_node(subsec_title)
                            # Subsectionの下にさらに階層があれば再帰的に処理するが、
                            # LaTeXRefManualは3階層が基本なのでここで止める
                            
                            sec_node["items"].append(subsec_node)

                    chap_node["items"].append(sec_node)

            structure_data.append(chap_node)

    # JSON保存
    with open(FILE_STRUCTURE, 'w', encoding='utf-8') as f:
        json.dump(structure_data, f, indent=4, ensure_ascii=False)
    
    print(f"Success! Created new structure JSON at: {FILE_STRUCTURE}")
    print("Format: title, description, tag, keywords, items")

if __name__ == "__main__":
    main()