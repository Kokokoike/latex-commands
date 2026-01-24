/* data.js */

// ★ データ生成用の関数
// 1.1 ギリシャ文字
function createGreek(name, kana, kana2, isUpper = false, related = []) {
    const type = isUpper ? "大文字" : "小文字";
    return {
        command: name,
        description: `ギリシャ文字の${type}の${kana}です。アルファベットの${kana2}と同じ形です。`,
        tags: ["数式", "ギリシャ文字", `ギリシャ文字・${type}`],
        package: null,
        isMathMode: false,
        related: related
    };
}
// 1.1.1 ギリシャ文字・小文字
function smallGreek(name, kana, related = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の小文字の${kana}です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・小文字"],
        package: null,
        isMathMode: true,
        related: related
    };
}
// 1.1.2 ギリシャ文字・小文字・異体字
function smallGreek2(name, kana, related = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の小文字の${kana}の異体字です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・小文字", "ギリシャ文字・異体字"],
        package: null,
        isMathMode: true,
        related: related
    };
}
// 1.1.3 ギリシャ文字・大文字
function bigGreek(name, kana, related = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の大文字の${kana}です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・大文字"],
        package: null,
        isMathMode: true,
        related: related
    };
}
// 1.1.4 ギリシャ文字・大文字・異体字
function bigGreek2(name, kana, related = []) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の大文字の${kana}の異体字です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・大文字", "ギリシャ文字・異体字"],
        package: null,
        isMathMode: true,
        related: related
    };
}

// ★ データベース
const commandDatabase = {
    // 1.1.1 ギリシャ文字・小文字
    "\\alpha":  smallGreek("alpha",   "アルファ", ["\\beta", "\\gamma"]),
    "\\beta":   smallGreek("beta",    "ベータ"),
    "\\gamma":  smallGreek("gamma",   "ガンマ"),
    "\\delta":  smallGreek("delta",   "デルタ"),
    "\\epsilon":smallGreek("epsilon", "イプシロン"),
    "\\zeta":   smallGreek("zeta",    "ゼータ（ツェータ）"),
    "\\eta":    smallGreek("eta",     "イータ（エータ）"),
    "\\theta":  smallGreek("theta",   "シータ（テータ）"),
    "\\iota":   smallGreek("iota",    "イオタ"),
    "\\kappa":  smallGreek("kappa",   "カッパ"),
    "\\lambda": smallGreek("lambda",  "ラムダ"),
    "\\mu":     smallGreek("mu",      "ミュー"),
    "\\nu":     smallGreek("nu",      "ニュー"),
    "\\xi":     smallGreek("xi",      "グザイ（クシー）"),
    "o":        createGreek("o", "オミクロン", "o(オー)"),
    "\\pi":     smallGreek("pi",      "パイ"),
    "\\rho":    smallGreek("rho",     "ロー"),
    "\\sigma":  smallGreek("sigma",   "シグマ"),
    "\\tau":    smallGreek("tau",     "タウ"),
    "\\upsilon":smallGreek("upsilon", "ユプシロン"),
    "\\phi":    smallGreek("phi",     "ファイ"),
    "\\chi":    smallGreek("chi",     "カイ"),
    "\\psi":    smallGreek("psi",     "プサイ（プシー）"),
    "\\omega":  smallGreek("omega",   "オメガ"),

    // 1.1.2 ギリシャ文字・小文字・異体字
    "\\varepsilon": smallGreek2("varepsilon", "イプシロン"),
    "\\vartheta":   smallGreek2("vartheta",   "シータ（テータ）"),
    "\\varkappa":   smallGreek2("varkappa",   "カッパ"),
    "\\varpi":      smallGreek2("varpi",      "パイ"),
    "\\varrho":     smallGreek2("varrho",     "ロー"),
    "\\varsigma":   smallGreek2("varsigma",   "シグマ"),
    "\\varphi":     smallGreek2("varphi",     "ファイ"),

    // 1.1.3 ギリシャ文字・大文字
    "A":        createGreek("A", "アルファ", "A(エー)", true),
    "B":        createGreek("B", "ベータ", "B(ビー)", true),
    "\\Gamma":  bigGreek("Gamma", "ガンマ"),
    "\\Delta":  bigGreek("Delta", "デルタ"),
    "E":        createGreek("E", "イプシロン", "E(イー)", true),
    "Z":        createGreek("Z", "ゼータ（ツェータ）", "Z(ゼット)", true),
    "H":        createGreek("H", "イータ（エータ）", "H(エイチ)", true),
    "\\Theta":  bigGreek("Theta", "シータ（テータ）"),
    "I":        createGreek("I", "イオタ", "I(アイ)", true),
    "K":        createGreek("K", "カッパ", "K(ケー)", true),
    "\\Lambda": bigGreek("Lambda", "ラムダ"),
    "M":        createGreek("M", "ミュー", "M(エム)", true),
    "N":        createGreek("N", "ニュー", "N(エヌ)", true),
    "\\Xi":     bigGreek("Xi", "グザイ（クシー）"),
    "O":        createGreek("O", "オミクロン", "O(オー)", true),
    "\\Pi":     bigGreek("Pi", "パイ"),
    "P":        createGreek("P", "ロー", "P(ピー)", true),
    "\\Sigma":  bigGreek("Sigma", "シグマ"),
    "T":        createGreek("T", "タウ", "T(ティー)", true),
    "\\Upsilon":bigGreek("Upsilon", "ユプシロン"),
    "\\Phi":    bigGreek("Phi", "ファイ"),
    "X":        createGreek("X", "カイ", "X(エックス)", true),
    "\\Psi":    bigGreek("Psi", "プサイ（プシー）"),
    "\\Omega":  bigGreek("Omega", "オメガ"),

    // 1.1.4 ギリシャ文字・大文字・異体字
    "\\varGamma":   bigGreek2("varGamma", "ガンマ"),
    "\\varDelta":   bigGreek2("varDelta", "デルタ"),
    "\\varTheta":   bigGreek2("varTheta", "シータ（テータ）"),
    "\\varLambda":  bigGreek2("varLambda", "ラムダ"),
    "\\varXi":      bigGreek2("varXi", "グザイ（クシー）"),
    "\\varPi":      bigGreek2("varPi", "パイ"),
    "\\varSigma":   bigGreek2("varSigma", "シグマ"),
    "\\varUpsilon": bigGreek2("varUpsilon", "ユプシロン"),
    "\\varPhi":     bigGreek2("varPhi", "ファイ"),
    "\\varPsi":     bigGreek2("varPsi", "プサイ（プシー）"),
    "\\varOmega":   bigGreek2("varOmega", "オメガ"),

    "\\mathbb{}": {
        command: "\\mathbb{R}",
        description: "黒板太字です。例として、実数全体の集合を表すRの黒板太字を表示しています。",
        tags: ["数式", "フォント"],
        package: "amssymb",
        isMathMode: true
    }
};