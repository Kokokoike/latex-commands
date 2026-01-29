setData({
    title: "数式",
    description: "LaTeXの数式環境で使われるコマンドです。",
    type: "big",
    sections: [
        {
            title: "基本情報",
            items: [
                {
                    title: "base",
                    description: "base",
                    file: "data/math/base/data_base.js",
                    type: "leaf",
                    icon: "x_k^2"
                }, 
                {
                    title: "symbols",
                    description: "symbols",
                    file: "data/math/symbols/data_symbols.js",
                    type: "big",
                    icon: "\\alpha"
                }, 
                {
                    title: "functions",
                    description: "functions",
                    file: "data/math/functions/data_functions.js",
                    type: "leaf",
                    icon: "\\sin"
                }, 
                {
                    title: "accents",
                    description: "accents",
                    file: "data/math/accents/data_accents.js",
                    type: "leaf",
                    icon: "\\alpha"
                }
            ]
        }
    ]
});
