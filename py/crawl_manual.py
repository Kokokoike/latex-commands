import requests
from bs4 import BeautifulSoup
import json
import re
import os
import time

# ==========================================
# 設定
# ==========================================
OUTPUT_DIR = "data_src"
BASE_URL = "https://latexref.xyz/"
TOC_URL = "https://latexref.xyz/index.html"

FILE_MAPPING = os.path.join(OUTPUT_DIR, "command_to_category.json")

# ==========================================
# 関数
# ==========================================
def get_soup(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    try:
        res = requests.get(url, headers=headers, timeout=10)
        res.encoding = res.apparent_encoding
        if res.status_code != 200:
            print(f"   [Error] Status {res.status_code} for {url}")
            return None
        return BeautifulSoup(res.text, 'html.parser')
    except Exception as e:
        print(f"   [Exception] {e} for {url}")
        return None

def clean_title(text):
    return re.sub(r'^\d+(\.\d+)*\s*', '', text.strip())

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # ---------------------------------------------------------
    # Step 1: 目次から「URLとカテゴリの対応表」を作る
    # ---------------------------------------------------------
    print(f"1. 目次 ({TOC_URL}) を解析中...")
    soup_toc = get_soup(TOC_URL)
    if not soup_toc:
        print("❌ 目次の取得に失敗しました。終了します。")
        return

    # 巡回すべきページのリスト: [{url, category_path}, ...]
    pages_to_crawl = []
    
    # URLの重複防止用セット
    seen_urls = set()

    contents_div = soup_toc.find("div", class_="contents") or soup_toc.find("body")
    root_ul = (contents_div.find("ul", class_="no-bullet") or 
               contents_div.find("ul", class_="toc") or 
               contents_div.find("ul"))

    if not root_ul:
        print("❌ 目次リストが見つかりませんでした。")
        return

    # 目次を走査 (階層構造をフラットなリストに展開)
    for li_chap in root_ul.find_all("li", recursive=False):
        a_chap = li_chap.find("a")
        if not a_chap: continue
        
        chap_title = clean_title(a_chap.get_text())
        
        # サブセクション探索
        ul_sec = li_chap.find("ul")
        if ul_sec:
            for li_sec in ul_sec.find_all("li", recursive=False):
                a_sec = li_sec.find("a")
                if not a_sec: continue
                
                sec_title = clean_title(a_sec.get_text())
                sec_href = a_sec.get('href')
                
                if sec_href:
                    # アンカー(#以降)を除去してファイル名を取得
                    filename = sec_href.split('#')[0]
                    full_url = BASE_URL + filename
                    
                    if full_url not in seen_urls:
                        pages_to_crawl.append({
                            "url": full_url,
                            "path": [chap_title, sec_title],
                            "filename": filename
                        })
                        seen_urls.add(full_url)
                    
                    # さらに深い階層 (Subsection)
                    ul_subsec = li_sec.find("ul")
                    if ul_subsec:
                        for li_subsec in ul_subsec.find_all("li", recursive=False):
                            a_subsec = li_subsec.find("a")
                            if not a_subsec: continue
                            
                            subsec_title = clean_title(a_subsec.get_text())
                            subsec_href = a_subsec.get('href')
                            if subsec_href:
                                sub_filename = subsec_href.split('#')[0]
                                sub_full_url = BASE_URL + sub_filename
                                
                                if sub_full_url not in seen_urls:
                                    pages_to_crawl.append({
                                        "url": sub_full_url,
                                        "path": [chap_title, sec_title, subsec_title],
                                        "filename": sub_filename
                                    })
                                    seen_urls.add(sub_full_url)

    print(f"-> 巡回対象: {len(pages_to_crawl)} ページ")

    # ---------------------------------------------------------
    # Step 2: 各ページを巡回してコマンドを収集
    # ---------------------------------------------------------
    print("2. ページ巡回を開始します (完了まで1〜2分かかります)...")
    
    command_db = {}
    
    for i, page in enumerate(pages_to_crawl):
        print(f"[{i+1}/{len(pages_to_crawl)}] Fetching: {page['filename']} ... ", end="", flush=True)
        
        # サーバー負荷軽減のためウェイトを入れる (重要)
        time.sleep(1.0)
        
        soup = get_soup(page['url'])
        if not soup:
            print("Skipped (Error)")
            continue

        # そのページ内で定義されているコマンドを探す
        # LaTeXRefManualでは <dt><code>\command</code></dt> という形式が多い
        # または <span class="command">
        
        found_in_page = 0
        
        # dt タグ内の code を探す (定義)
        for dt in soup.find_all("dt"):
            code = dt.find("code")
            if code:
                cmd_text = code.get_text(strip=True)
                # コマンド判定 (\で始まるもの)
                if cmd_text.startswith('\\'):
                    # 既に登録済みでないか確認 (同ページ内の重複など)
                    if cmd_text not in command_db:
                        command_db[cmd_text] = {
                            "category_root": page["path"][0],
                            "category_sub": page["path"][1] if len(page["path"]) > 1 else "",
                            "category_subsub": page["path"][2] if len(page["path"]) > 2 else "",
                            "source_url": page["url"]
                        }
                        found_in_page += 1
        
        print(f"Found {found_in_page} cmds")

    # ---------------------------------------------------------
    # Step 3: 保存
    # ---------------------------------------------------------
    print("-" * 30)
    if len(command_db) == 0:
        print("❌ コマンドが1つも収集できませんでした。")
    else:
        with open(FILE_MAPPING, 'w', encoding='utf-8') as f:
            json.dump(command_db, f, indent=4, ensure_ascii=False)
        print(f"✅ 成功！ {len(command_db)} 個のコマンドを収集し、以下に保存しました:")
        print(FILE_MAPPING)
        print("次は 'build_database.py' を実行してください。")

if __name__ == "__main__":
    main()