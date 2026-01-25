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