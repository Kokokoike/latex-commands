import os
import json

# 設定されているパス
file_path = "data_src/command_to_category.json"

print(f"現在の場所 (Current Working Directory): {os.getcwd()}")
print(f"確認するファイルのパス: {file_path}")

if os.path.exists(file_path):
    print("✅ ファイルは見つかりました。")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"✅ JSONの読み込み成功。データ数: {len(data)}")
    except Exception as e:
        print(f"❌ ファイルはありましたが、読み込めませんでした: {e}")
else:
    print("❌ ファイルが見つかりません。")
    print("フォルダの中身:")
    if os.path.exists("data_src"):
        print(os.listdir("data_src"))
    else:
        print("'data_src' フォルダ自体が見つかりません。")