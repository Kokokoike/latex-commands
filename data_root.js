/* data_root.js */
setData({
    title: "主なカテゴリー",
    description: "",
    type: "big",
    sections: [
        {
            title: "フォント",
            items: [
                {
                    title: "太字",
                    description: "太字フォントの表示方法一覧です。",
                    file: "data/bold/data_bold.js",
                    type: "leaf",
                    icon: "\\mathbb{R}"
                }
            ]
        }, 
        {
            title: "数式",
            items: [
                {
                    title: "数式",
                    description: "LaTeXの数式環境で使われるコマンドです。",
                    file: "data/math/data_math.js",
                    type: "big",
                    icon: "\\sin"
                }
            ]
        }
    ]
});
