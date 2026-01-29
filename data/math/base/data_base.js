/* data_greek.js */

// ★ データ生成用の関数
// 1.1 ギリシャ文字
function createGreek(name, kana, kana2, isUpper = false, related = [], examples = []) {
    const type = isUpper ? "大文字" : "小文字";
    return {
        command: name,
        description: `ギリシャ文字の${type}の${kana}です。アルファベットの${kana2}と同じ形です。`,
        tags: ["数式", "ギリシャ文字", `ギリシャ文字・${type}`],
        package: null,
        isMathMode: false,
        related: related,
        examples: examples
    };
}
// 1.1.1 ギリシャ文字・大文字
function bigGreek(name, kana, related = [], examples = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の大文字の${kana}です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・大文字"],
        package: null,
        isMathMode: true,
        related: related,
        examples: examples
    };
}
// 1.1.2 ギリシャ文字・小文字
function smallGreek(name, kana, related = [], examples = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の小文字の${kana}です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・小文字"],
        package: null,
        isMathMode: true,
        related: related,
        examples: examples
    };
}
// 1.1.3 ギリシャ文字・大文字・異体字
function bigGreek2(name, kana, related = [], examples = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の大文字の${kana}の異体字です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・大文字", "ギリシャ文字・異体字"],
        package: null,
        isMathMode: true,
        related: related,
        examples: examples
    };
}
// 1.1.4 ギリシャ文字・小文字・異体字
function smallGreek2(name, kana, related = [], examples = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の小文字の${kana}の異体字です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・小文字", "ギリシャ文字・異体字"],
        package: null,
        isMathMode: true,
        related: related,
        examples: examples
    };
}

// ★ データベース
setData({
    title: "base",
    description: "base",
    type: "leaf",
    
    sections: [
        { title: "大文字", requiredTags: ["ギリシャ文字・大文字"], excludedTags: ["ギリシャ文字・異体字"] },
        { title: "小文字", requiredTags: ["ギリシャ文字・小文字"], excludedTags: ["ギリシャ文字・異体字"] },
        { title: "大文字（異体字）", requiredTags: ["ギリシャ文字・大文字", "ギリシャ文字・異体字"] },
        { title: "小文字（異体字）", requiredTags: ["ギリシャ文字・小文字", "ギリシャ文字・異体字"] }
    ],

    commands: {
        // 1.1.1 ギリシャ文字・大文字
        "A":        createGreek("A", "アルファ", "A(エー)", true, ["\\alpha"]),
        "B":        createGreek("B", "ベータ", "B(ビー)", true, ["\\beta"]),
        "\\Gamma":  bigGreek("Gamma", "ガンマ", ["\\gamma", "\\varGamma"]),
        "\\Delta":  bigGreek("Delta", "デルタ", ["\\delta", "\\varDelta"]),
        "E":        createGreek("E", "イプシロン", "E(イー)", true, ["\\epsilon", "\\varepsilon"]),
        "Z":        createGreek("Z", "ゼータ（ツェータ）", "Z(ゼット)", true, ["\\zeta"]),
        "H":        createGreek("H", "イータ（エータ）", "H(エイチ)", true, ["\\eta"]),
        "\\Theta":  bigGreek("Theta", "シータ（テータ）", ["\\theta", "\\varTheta", "\\vartheta"]),
        "I":        createGreek("I", "イオタ", "I(アイ)", true, ["\\iota"]),
        "K":        createGreek("K", "カッパ", "K(ケー)", true, ["\\kappa", "\\varkappa"]),
        "\\Lambda": bigGreek("Lambda", "ラムダ", ["\\lambda", "\\varLambda"]),
        "M":        createGreek("M", "ミュー", "M(エム)", true, ["\\mu"]),
        "N":        createGreek("N", "ニュー", "N(エヌ)", true, ["\\nu"]),
        "\\Xi":     bigGreek("Xi", "グザイ（クシー）", ["\\xi", "\\varXi"]),
        "O":        createGreek("O", "オミクロン", "O(オー)", true, ["o"]),
        "\\Pi":     bigGreek("Pi", "パイ", ["\\pi", "\\varPi", "\\varpi"]),
        "P":        createGreek("P", "ロー", "P(ピー)", true, ["\\rho", "\\varrho"]),
        "\\Sigma":  bigGreek("Sigma", "シグマ", ["\\sigma", "\\varSigma", "\\varsigma"]),
        "T":        createGreek("T", "タウ", "T(ティー)", true, ["\\tau"]),
        "\\Upsilon":bigGreek("Upsilon", "ユプシロン", ["\\upsilon", "\\varUpsilon"]),
        "\\Phi":    bigGreek("Phi", "ファイ", ["\\phi", "\\varPhi", "\\varphi"]),
        "X":        createGreek("X", "カイ", "X(エックス)", true, ["\\chi"]),
        "\\Psi":    bigGreek("Psi", "プサイ（プシー）", ["\\psi", "\\varPsi"]),
        "\\Omega":  bigGreek("Omega", "オメガ", ["\\omega", "\\varOmega"]),

        // 1.1.2 ギリシャ文字・小文字
        "\\alpha":  smallGreek("alpha",   "アルファ", ["A"]),
        "\\beta":   smallGreek("beta",    "ベータ", ["B"]),
        "\\gamma":  smallGreek("gamma",   "ガンマ", ["\\Gamma", "\\varGamma"]),
        "\\delta":  smallGreek("delta",   "デルタ", ["\\Delta", "\\varDelta"]),
        "\\epsilon":smallGreek("epsilon", "イプシロン", ["E", "\\varepsilon"]),
        "\\zeta":   smallGreek("zeta",    "ゼータ（ツェータ）", ["Z"]),
        "\\eta":    smallGreek("eta",     "イータ（エータ）", ["H"]),
        "\\theta":  smallGreek("theta",   "シータ（テータ）", ["\\Theta", "\\varTheta", "\\vartheta"]),
        "\\iota":   smallGreek("iota",    "イオタ", ["I"]),
        "\\kappa":  smallGreek("kappa",   "カッパ", ["K", "\\varkappa"]),
        "\\lambda": smallGreek("lambda",  "ラムダ", ["\\Lambda", "\\varLambda"]),
        "\\mu":     smallGreek("mu",      "ミュー", ["M"]),
        "\\nu":     smallGreek("nu",      "ニュー", ["N"]),
        "\\xi":     smallGreek("xi",      "グザイ（クシー）", ["\\Xi", "\\varXi"]),
        "o":        createGreek("o", "オミクロン", "o(オー)", false, ["O"]),
        "\\pi":     smallGreek("pi",      "パイ", ["\\Pi", "\\varPi", "\\varpi"]),
        "\\rho":    smallGreek("rho",     "ロー", ["P", "\\varrho"]),
        "\\sigma":  smallGreek("sigma",   "シグマ", ["\\Sigma", "\\varSigma", "\\varsigma"]),
        "\\tau":    smallGreek("tau",     "タウ", ["T"]),
        "\\upsilon":smallGreek("upsilon", "ユプシロン", ["\\Upsilon", "\\varUpsilon"]),
        "\\phi":    smallGreek("phi",     "ファイ", ["\\Phi", "\\varPhi", "\\varphi"]),
        "\\chi":    smallGreek("chi",     "カイ", ["X"]),
        "\\psi":    smallGreek("psi",     "プサイ（プシー）", ["\\Psi", "\\varPsi"]),
        "\\omega":  smallGreek("omega",   "オメガ", ["\\Omega", "\\varOmega"]),

        // 1.1.3 ギリシャ文字・大文字・異体字
        "\\varGamma":   bigGreek2("varGamma", "ガンマ", ["\\Gamma", "\\gamma"]),
        "\\varDelta":   bigGreek2("varDelta", "デルタ", ["\\Delta", "\\delta"]),
        "\\varTheta":   bigGreek2("varTheta", "シータ（テータ）", ["\\Theta", "\\theta", "\\vartheta"]),
        "\\varLambda":  bigGreek2("varLambda", "ラムダ", ["\\Lambda", "\\lambda"]),
        "\\varXi":      bigGreek2("varXi", "グザイ（クシー）", ["\\Xi", "\\xi"]),
        "\\varPi":      bigGreek2("varPi", "パイ", ["\\Pi", "\\pi", "\\varpi"]),
        "\\varSigma":   bigGreek2("varSigma", "シグマ", ["\\Sigma", "\\Sigma", "\\varsigma"]),
        "\\varUpsilon": bigGreek2("varUpsilon", "ユプシロン", ["\\Upsilon", "\\upsilon"]),
        "\\varPhi":     bigGreek2("varPhi", "ファイ", ["\\Phi", "\\phi", "\\varphi"]),
        "\\varPsi":     bigGreek2("varPsi", "プサイ（プシー）", ["\\Psi", "\\psi"]),
        "\\varOmega":   bigGreek2("varOmega", "オメガ", ["\\Omega", "\\omega"]),

        // 1.1.4 ギリシャ文字・小文字・異体字
        "\\varepsilon": smallGreek2("varepsilon", "イプシロン", ["\\epsilon", "E"]),
        "\\vartheta":   smallGreek2("vartheta",   "シータ（テータ）", ["\\theta", "\\Theta", "\\varTheta"]),
        "\\varkappa":   smallGreek2("varkappa",   "カッパ", ["\\kappa", "K"]),
        "\\varpi":      smallGreek2("varpi",      "パイ", ["\\pi", "\\Pi", "\\varPi"]),
        "\\varrho":     smallGreek2("varrho",     "ロー", ["\\rho", "P"]),
        "\\varsigma":   smallGreek2("varsigma",   "シグマ", ["\\sigma", "\\Sigma", "\\varSigma"]),
        "\\varphi":     smallGreek2("varphi",     "ファイ", ["\\phi", "\\Phi", "\\varPhi"]),
    }
});
