/* data.js */
const commandDatabase = {
    "alpha": {
        command: "\\alpha",
        description: "ギリシャ文字の小文字のアルファです。数式モードで使用できます。",
        tags: ["ギリシャ文字", "小文字"],
        package: null
    },
    "beta": {
        command: "\\beta",
        description: "ギリシャ文字の小文字のベータです。",
        tags: ["ギリシャ文字", "小文字"],
        package: null
    },
    "gamma": {
        command: "\\gamma",
        description: "ギリシャ文字の小文字のガンマです。",
        tags: ["ギリシャ文字", "小文字"],
        package: null
    },
    "mathbb_r": {
        command: "\\mathbb{R}",
        description: "実数全体の集合を表す黒板太字のRです。",
        tags: ["数式", "集合"],
        package: "amssymb"
    },
    "frac": {
        command: "\\frac{a}{b}",
        description: "分数を表示します。前が分子、後ろが分母です。",
        tags: ["数式", "基本"],
        package: null
    },
    "sum": {
        command: "\\sum_{i=1}^{n}",
        description: "総和（シグマ）記号です。",
        tags: ["数式", "大型演算子"],
        package: null
    }
};