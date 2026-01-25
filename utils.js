// グローバルなデータ保管場所
window.LaTeXDict = {
    categories: {}, // カテゴリごとのメタデータ (title, sectionsなど)
    bigCategories: {}, // 大カテゴリ（カテゴリグループ）のメタデータ
    database: {}    // すべてのコマンド定義 (検索・詳細ページ用)
};

// データを登録するための関数
window.registerCategory = function(id, data) {
    // カテゴリ情報を保存
    window.LaTeXDict.categories[id] = {
        title: data.title,
        icon: data.icon, // カテゴリアイコン
        description: data.description,
        sections: data.sections || null
    };

    // コマンド定義を統合データベースにマージ
    if (data.commands) {
        Object.assign(window.LaTeXDict.database, data.commands);
    }
};

// 大カテゴリ（カテゴリグループ）を登録するための関数
window.registerBigCategory = function(id, data) {
    window.LaTeXDict.bigCategories[id] = {
        title: data.title,
        description: data.description,
        sections: data.sections || []
    };
};

// 既存のコードの下位互換性のためにエイリアスを設定
window.commandDatabase = window.LaTeXDict.database;

// 検索ロジック
function getSearchResults(term, db) {
    if (!term) return [];
    const keys = Object.keys(db);
    return keys.filter(key => {
        const d = db[key];
        return key.includes(term) || 
               d.command.toLowerCase().includes(term) || 
               d.description.includes(term) || 
               d.tags.some(t => t.includes(term));
    });
}

// コピー機能
function copyText(btn, text) {
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
}

// 検索オートコンプリート機能
function setupAutocomplete(inputId, resultsId, db) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    
    if (!input || !results) return;

    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        if (term.length === 0) { 
            results.classList.remove('active'); 
            return; 
        }

        const hits = getSearchResults(term, db);

        if (hits.length > 0) {
            results.innerHTML = '';
            hits.forEach(key => {
                const d = db[key];
                const div = document.createElement('div');
                div.className = 'result-item';
                const desc = d.description.length > 20 ? d.description.substring(0, 20) + '...' : d.description;
                div.innerHTML = `<span class="result-cmd">${key}</span> <span class="result-desc">${desc}</span>`;
                div.onclick = () => { window.location.href = `detail1.html?id=${key}`; };
                results.appendChild(div);
            });
            results.classList.add('active');
        } else { results.classList.remove('active'); }
    });

    // 外部クリックで閉じる
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) { results.classList.remove('active'); }
    });

    // Enterキーで閉じる（遷移処理は各ページのkeydownイベントに任せる）
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            results.classList.remove('active');
        }
    });
}