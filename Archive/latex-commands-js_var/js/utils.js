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
        document.head.removeChild(script);
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

// --- 共通機能の追加 ---

// ヘッダーのHTMLを生成して挿入する
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

    // renderCommonHeader関数内などで、HTML生成後に実行
    const headerInput = document.getElementById('header-search-input');
    if (headerInput) {
        headerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch(headerInput.value);
        }
    });
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

    // 検索トグル
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }

    // 検索実行
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const term = searchInput.value.trim();
                if (term) {
                    window.location.href = `search.html?q=${encodeURIComponent(term)}`;
                }
            }
        });
    }
};

// KaTeXレンダリングのヘルパー関数
window.renderMath = function(elementId, latexCommand, options = {}) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const defaultOptions = { throwOnError: false };
    const finalOptions = { ...defaultOptions, ...options };
    
    katex.render(latexCommand, el, finalOptions);
};

// データ読み込みのPromise化
window.loadDataFilePromise = function(file) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject('timeout'), 1000);
        loadDataFile(file, (data) => {
            clearTimeout(timer);
            resolve(data);
        });
    });
};

// パンくずリスト生成
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

    const parts = currentFile.split('/');
    const parents = [];
    let pathAcc = '';
    
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (pathAcc) pathAcc += '/';
        pathAcc += part;
        if (part === 'data') continue; 
        const jsFile = `${pathAcc}/data_${part}.js`;
        
        // 詳細ページ(isDetail=true)の場合は、現在のファイル(カテゴリ)も親としてリンクに追加する
        if (isDetail || jsFile !== currentFile) {
            parents.push(jsFile);
        }
    }

    for (const file of parents) {
        try {
            const data = await loadDataFilePromise(file);
            const title = data.title || file;
            // 統合によりすべて category.html へ
            const href = `category.html?file=${file}`;
            addLink(title, href);
        } catch (e) { console.log(`Breadcrumb skip: ${file}`); }
    }

    const span = document.createElement('span');
    span.className = 'current-page-name';
    span.innerText = currentTitle;
    nav.appendChild(span);
};

/**
 * 共通検索実行関数
 * 入力されたクエリで検索結果ページへ遷移します
 * @param {string} query - 検索キーワード
 */
function executeSearch(query) {
    if (!query) return;
    const term = query.trim();
    if (term.length === 0) return;

    // 検索結果ページへ遷移 (search.htmlがルートにある前提)
    // 既に search.html にいる場合も再読み込みとして機能します
    window.location.href = `search.html?q=${encodeURIComponent(term)}`;
}

