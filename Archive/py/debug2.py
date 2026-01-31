import requests
from bs4 import BeautifulSoup

URL = "https://latexref.xyz/Command-Index.html"

def debug_fetch():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    print(f"1. URLにアクセスします: {URL}")
    try:
        res = requests.get(URL, headers=headers, timeout=10)
        res.encoding = res.apparent_encoding
        print(f"   ステータスコード: {res.status_code}")
    except Exception as e:
        print(f"   アクセス失敗: {e}")
        return

    if res.status_code != 200:
        print("   ❌ 正常にアクセスできていません。時間を置くか、URLを確認してください。")
        print(f"   内容の一部: {res.text[:200]}")
        return

    print("2. HTML解析を開始します...")
    soup = BeautifulSoup(res.text, 'html.parser')
    
    # ページタイトルの確認
    print(f"   ページタイトル: {soup.title.string if soup.title else 'なし'}")

    # リンク数の確認
    links = soup.select('div.index-cp a, table.index-cp a, body a')
    print(f"   発見した全リンク数: {len(links)}")

    if len(links) == 0:
        print("   ❌ リンクが1つも見つかりませんでした。HTML構造が変わったか、中身が空です。")
        print("   HTMLの先頭500文字を表示します:\n")
        print(res.text[:500])
        return

    # フィルタリングのテスト
    valid_count = 0
    print("\n3. 最初の10個のリンクをチェックします:")
    for i, a in enumerate(links[:10]):
        text = a.get_text(strip=True)
        href = a.get('href')
        print(f"   [{i}] テキスト: '{text}' / リンク: {href}")
        
        # フィルタ条件のチェック
        if (text.startswith('\\') or '{' in text or 'environment' in (href or '')):
            valid_count += 1
    
    print(f"\n   -> 有効そうなコマンドリンク数（推測）: {valid_count} / 10")
    
    if valid_count == 0:
        print("   ⚠️ リンクは見つかりましたが、コマンドとして認識されていません。フィルタ条件が厳しすぎる可能性があります。")

if __name__ == "__main__":
    debug_fetch()