/* data_letters.js */
setData({
    title: "文字",
    description: "LaTeXで使用できる文字一覧です",
    type: "big",
    sections: [
        {
            title: "数式",
            items: [
                {
                    title: "ギリシャ文字",
                    description: "ギリシャ文字の大文字・小文字と、異体字の表示方法一覧です。アルファベットと同形でない場合、数式環境が必要です。",
                    file: "data/letters/greek/data_greek.js",
                    type: "leaf",
                    icon: "\\alpha"
                }, 
                {
                    title: "太字",
                    description: "太字フォントの表示方法一覧です。",
                    file: "data/letters/bold/data_bold.js",
                    type: "leaf",
                    icon: "\\mathbb{R}"
                }
            ]
        }
    ]
});
