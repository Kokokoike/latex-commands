// ★ データ生成用の関数
function createFunctions(name, functionName = "その他の関数", related = [], examples = []) {
    return {
        description: `${name}`,
        tags: ["数式", "関数", functionName],
        package: null,
        isMathMode: true,
        related: related,
        examples: examples
   };
}

// ★ データベース
setData({
    title: "functions",
    description: "functions",
    type: "leaf",
    
    sections: [
        { title: "三角関数", requiredTags: ["三角関数"] }, 
        { title: "指数・対数", requiredTags: ["指数・対数"] }, 
        { title: "線形代数・幾何", requiredTags: ["線形代数", "幾何"] }, 
        { title: "その他の関数", requiredTags: ["その他の関数"] }
    ],

    commands: [
        ["arccos", "三角関数"],
        ["arcsin", "三角関数"],
        ["arctan", "三角関数"],
        ["arg", "その他の関数"],
        ["bmod", "その他の関数"],
        ["cos", "三角関数"],
        ["cosh", "その他の関数"],
        ["cot", "三角関数"],
        ["coth", "その他の関数"],
        ["csc", "三角関数"],
        ["deg", "幾何"],
        ["det", "線形代数"],
        ["dim", "線形代数"],
        ["exp", "指数・対数"],
        ["gcd", "その他の関数"],
        ["hom", "その他の関数"],
        ["inf", "その他の関数"],
        ["ker", "線形代数"],
        ["lg", "指数・対数"],
        ["lim", "その他の関数"],
        ["liminf", "その他の関数"],
        ["limsup", "その他の関数"],
        ["ln", "指数・対数"],
        ["log", "指数・対数"],
        ["max", "その他の関数"],
        ["min", "その他の関数"],
        ["pmod", "その他の関数"],
        ["Pr", "その他の関数"],
        ["sec", "三角関数"],
        ["sin", "三角関数"],
        ["sinh", "その他の関数"],
        ["sup", "その他の関数"],
        ["tan", "三角関数"],
        ["tanh", "その他の関数"],
    ].reduce((acc, [name, tag, related, examples]) => {
        acc[`\\${name}`] = createFunctions(name, tag, related, examples);
        return acc;
    }, {})
});
