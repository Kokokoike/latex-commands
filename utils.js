// 現在読み込まれているデータ
window.currentData = null;

// データを登録する関数 (各データファイルから呼ばれる)
window.setData = function(data) {
    window.currentData = data;
};

// JSファイルを動的に読み込む関数
window.loadDataFile = function(filePath, callback) {
    window.currentData = null; // リセット
    
    const script = document.createElement('script');
    script.src = filePath;
    
    script.onload = () => {
        if (window.currentData) {
            callback(window.currentData);
        } else {
            console.error("Data not found in " + filePath);
            alert("データの形式が正しくありません: " + filePath);
        }
    };
    
    script.onerror = () => {
        console.error("Failed to load script: " + filePath);
        alert("ファイルの読み込みに失敗しました。\nパスが正しいか確認してください: " + filePath);
    };
    
    document.head.appendChild(script);
};

// コピー機能
window.copyText = function(btn, text) {
    if (btn.classList.contains('copied')) return;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = "Copied";
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('copied');
        }, 1500);
    });
};
