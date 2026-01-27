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

// ヘッダー機能のセットアップ
window.setupHeader = function() {
    const header = document.querySelector('.top-header');
    if (!header) return;

    const searchContainer = document.querySelector('.header-search-container');
    const searchInput = document.getElementById('header-search-input');
    const searchToggle = document.getElementById('header-search-toggle');
    const headerText = document.querySelector('.header-text');

    // スクロール検知
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // 重なり判定
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
    window.addEventListener('resize', checkOverlap);
    checkOverlap();

    // 検索トグル
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
            const interval = setInterval(checkOverlap, 50);
            setTimeout(() => clearInterval(interval), 400);
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
            const href = (data.type === 'big') ? `bigCategory.html?file=${file}` : `category.html?file=${file}`;
            addLink(title, href);
        } catch (e) { console.log(`Breadcrumb skip: ${file}`); }
    }

    const span = document.createElement('span');
    span.className = 'current-page-name';
    span.innerText = currentTitle;
    nav.appendChild(span);
};
