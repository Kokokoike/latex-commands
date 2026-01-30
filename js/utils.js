// ==========================================
// グローバル変数: データベース
// ==========================================
window.db = {
    structure: null, // カテゴリ階層
    commands: null,  // コマンド詳細
    catToCmd: null,  // 逆引き
    isLoaded: false
};

// ==========================================
// データベース初期化
// ==========================================
window.initDatabase = async function() {
    if (window.db.isLoaded) return true;

    try {
        // dataフォルダの各JSONファイルを読み込む
        const [structRes, cmdRes, catRes] = await Promise.all([
            fetch('data/category_structure.json'),
            fetch('data/command_database_full.json'),
            fetch('data/category_to_commands.json')
        ]);

        if (!structRes.ok || !cmdRes.ok || !catRes.ok) throw new Error("Data load failed");

        window.db.structure = await structRes.json();
        window.db.commands = await cmdRes.json();
        window.db.catToCmd = await catRes.json();
        window.db.isLoaded = true;
        return true;
    } catch (error) {
        console.error("Init DB Error:", error);
        if (window.location.protocol === 'file:') {
            alert("エラー: ローカルセキュリティ制限によりデータを読み込めません。\nVS CodeのLive Server機能などを使って開いてください。");
        }
        return false;
    }
};

// ==========================================
// ユーティリティ & UIコンポーネント
// ==========================================

// 現在読み込まれているデータ（互換性のため保持）
window.currentData = null;

// データを登録する関数
window.setData = function(data) {
    window.currentData = data;
};

// データファイルを読み込む関数 (JSON対応版)
window.loadDataFile = function(filePath, callback) {
    window.currentData = null;
    
    // .js を .json に置換して読み込む
    let targetPath = filePath;
    if (targetPath.endsWith('.js')) {
        targetPath = targetPath.replace(/\.js$/, '.json');
    }
    
    // パスの調整（必要に応じて dat/ を付与するなど）
    // ここではfilePathがそのまま使えると仮定

    fetch(targetPath)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            window.currentData = data;
            callback(data);
        })
        .catch(e => {
            console.error("Data load error:", e);
            // エラー時はcallbackしない、またはエラー処理
        });
};

// データキャッシュ
window.fileCache = {};

// データ読み込みのPromise化
window.loadDataFilePromise = function(file) {
    if (window.fileCache[file]) {
        return Promise.resolve(window.fileCache[file]);
    }
    return new Promise((resolve, reject) => {
        // タイムアウト設定
        const timer = setTimeout(() => reject('timeout'), 2000);
        loadDataFile(file, (data) => {
            clearTimeout(timer);
            window.fileCache[file] = data;
            resolve(data);
        });
    });
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

// KaTeXレンダリングのヘルパー関数
window.renderMath = function(target, latexCommand, options = {}) {
    const el = (typeof target === 'string') ? document.getElementById(target) : target;
    if (!el) return;
    
    const defaultOptions = { throwOnError: false };
    const finalOptions = { ...defaultOptions, ...options };
    
    // window.katexが存在する場合のみ実行
    if (window.katex) {
        katex.render(latexCommand, el, finalOptions);
    }
};

// ==========================================
// 共通ヘッダーレンダリング
// ==========================================
window.renderCommonHeader = function() {
    const headerHtml = `
        <div class="header-logo-wrapper" onclick="window.location.href='index.html'">
            <img src="images/icon.svg" alt="" class="header-icon">
            <img src="images/logo_text.svg" alt="LaTeX Cmds" class="header-text">
        </div>

        <div class="header-search-container">
            <input type="text" id="header-search-input" placeholder="Search..." autocomplete="off">
            <button id="header-search-toggle" class="search-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </div>
    `;

    const headerEl = document.querySelector('.top-header');
    if (headerEl) {
        headerEl.innerHTML = headerHtml;
        setupHeader(); // イベント登録
    }
};

// ヘッダー機能のセットアップ
window.setupHeader = function() {
    const header = document.querySelector('.top-header');
    if (!header) return;

    const searchContainer = document.querySelector('.header-search-container');
    const searchInput = document.getElementById('header-search-input');
    const searchToggle = document.getElementById('header-search-toggle');
    const headerText = document.querySelector('.header-text');
    
    // 重なり判定関数
    function checkOverlap() {
        if (!headerText || !searchContainer) return;
        const textRect = headerText.getBoundingClientRect();
        const searchRect = searchContainer.getBoundingClientRect();
        if (textRect.right > searchRect.left - 10) {
            headerText.classList.add('top_scrolled');
        } else {
            headerText.classList.remove('top_scrolled');
        }
    }

    // リサイズ時などに重なりをチェック
    window.addEventListener('resize', checkOverlap);
    checkOverlap(); // 初期実行

    // 検索トグル
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }

    // 検索実行 (Enterキー)
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch(searchInput.value);
            }
        });
    }
};

/**
 * 共通検索実行関数
 */
function executeSearch(query) {
    if (!query) return;
    const term = query.trim();
    if (term.length === 0) return;

    window.location.href = `search.html?q=${encodeURIComponent(term)}`;
}

// ==========================================
// パンくずリスト生成 (高機能版)
// ==========================================
window.buildBreadcrumbs = async function(currentFile, currentTitle, isDetail = false) {
    const nav = document.querySelector('.breadcrumbs');
    if (!nav) return;
    nav.innerHTML = ''; 

    const addLink = (text, href) => {
        const a = document.createElement('a');
        a.href = href;
        a.innerText = text;
        nav.appendChild(a);
        nav.appendChild(document.createTextNode(' > '));
    };

    addLink('TOP', 'index.html');

    // パス解析: data/math/data_math.js -> [data, math, data_math.js]
    const parts = currentFile.split('/');
    const parents = [];
    let pathAcc = '';
    
    // 親ディレクトリを順にたどる
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (pathAcc) pathAcc += '/';
        pathAcc += part;
        
        if (part === 'data' || part === 'dat') continue; 
        
        // 親カテゴリファイルのパスを推測 (例: data/math -> data/math/data_math.js)
        // JSON環境では .json になるが loadDataFilePromise が吸収する
        const parentFile = `${pathAcc}/data_${part}.js`;
        
        // 詳細ページ(isDetail=true)の場合は、現在のファイル(カテゴリ)も親としてリンクに追加する
        if (isDetail || parentFile !== currentFile) {
            parents.push(parentFile);
        }
    }

    // 親カテゴリのタイトルを取得してリンク生成
    for (const file of parents) {
        try {
            const data = await loadDataFilePromise(file);
            const title = data.title || file;
            const href = `category.html?file=${file}`;
            addLink(title, href);
        } catch (e) { 
            // 読み込み失敗時はスキップ
            console.log(`Breadcrumb skip: ${file}`); 
        }
    }

    const span = document.createElement('span');
    span.className = 'current-page-name';
    span.innerText = currentTitle;
    nav.appendChild(span);
};

// ==========================================
// カテゴリパス用パンくずリスト生成 (category.html用)
// ==========================================
window.buildBreadcrumbsFromCategory = function(catPath) {
    const nav = document.querySelector('.breadcrumbs');
    if (!nav) return;
    nav.innerHTML = '<a href="index.html">TOP</a>';
    
    if (!catPath) return;

    const parts = catPath.split('/');
    let accum = "";
    parts.forEach((p, i) => {
        nav.appendChild(document.createTextNode(' > '));
        if(i === parts.length - 1) {
            const span = document.createElement('span');
            span.className = 'current-page-name';
            span.innerText = p;
            nav.appendChild(span);
        } else {
            accum += (i>0 ? "/" : "") + p;
            const a = document.createElement('a');
            a.href = `category.html?cat=${encodeURIComponent(accum)}`;
            a.innerText = p;
            nav.appendChild(a);
        }
    });
};

// 検索ロジック
window.performSearch = function(query) {
    if (!query || !window.db.commands) return [];
    const lowerQ = query.toLowerCase().trim();
    const results = [];
    
    for (const [key, data] of Object.entries(window.db.commands)) {
        let score = 0;
        const lowerKey = key.toLowerCase();
        
        if (lowerKey === lowerQ) score += 100;
        else if (lowerKey.startsWith(lowerQ)) score += 50;
        else if (lowerKey.includes(lowerQ)) score += 20;
        else if ((data.description||"").toLowerCase().includes(lowerQ)) score += 5;

        if (score > 0) results.push({ key, data, score });
    }
    // スコア順
    return results.sort((a,b) => b.score - a.score);
};