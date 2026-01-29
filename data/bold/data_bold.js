/* data_bold.js */

// ★ データベース
setData({
    title: "太字",
    description: "太字フォントの表示方法一覧です。",
    type: "leaf",

    commands: {
        "\\mathbb{}": {
            command: "\\mathbb{R}",
            description: "黒板太字です。例として、実数全体の集合を表すRの黒板太字を表示しています。",
            tags: ["数式", "フォント"],
            package: "amssymb",
            isMathMode: true, 
            examples:[
            { title: "自然数全体の集合", command: "\\mathbb{N}" },
            { title: "複素数全体の集合", command: "\\mathbb{C}" }
            ]
            // , related: ["\\alpha"]
        }
    }
});
