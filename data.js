/* data.js */

// 1. データ生成用の便利関数
// 引数 kana には "アルファ" や "パイの異体字" だけを渡します
function createGreek(name, kana) {
    return {
        command: `\\${name}`,
        description: `ギリシャ文字の小文字の${kana}です。`,
        tags: ["数式", "ギリシャ文字", "ギリシャ文字・小文字"],
        package: null,
        isMathMode: true
    };
}

// 2. データベース本体
const commandDatabase = {
    // 基本形
    "alpha":   createGreek("alpha",   "アルファ"),
    "beta":    createGreek("beta",    "ベータ"),
    "gamma":   createGreek("gamma",   "ガンマ"),
    "delta":   createGreek("delta",   "デルタ"),
    "epsilon": createGreek("epsilon", "イプシロン"),
    "zeta":    createGreek("zeta",    "ゼータ"),
    "eta":     createGreek("eta",     "イータ"),
    "theta":   createGreek("theta",   "シータ"),
    "iota":    createGreek("iota",    "イオタ"),
    "kappa":   createGreek("kappa",   "カッパ"),
    "lambda":  createGreek("lambda",  "ラムダ"),
    "mu":      createGreek("mu",      "ミュー"),
    "nu":      createGreek("nu",      "ニュー"),
    "xi":      createGreek("xi",      "グサイ（クシー）"),
    "pi":      createGreek("pi",      "パイ"),
    "rho":     createGreek("rho",     "ロー"),
    "sigma":   createGreek("sigma",   "シグマ"),
    "tau":     createGreek("tau",     "タウ"),
    "upsilon": createGreek("upsilon", "ユプシロン"),
    "phi":     createGreek("phi",     "ファイ"),
    "chi":     createGreek("chi",     "カイ"),
    "psi":     createGreek("psi",     "プサイ"),
    "omega":   createGreek("omega",   "オメガ"),

    // 異体字（説明文にうまくつながるように記述）
    "varepsilon": createGreek("varepsilon", "イプシロンの異体字"),
    "vartheta":   createGreek("vartheta",   "シータの異体字"),
    "varpi":      createGreek("varpi",      "パイの異体字"),
    "varrho":     createGreek("varrho",     "ローの異体字"),
    "varsigma":   createGreek("varsigma",   "シグマの語末形"),
    "varphi":     createGreek("varphi",     "ファイの異体字"),

    // その他のコマンド（関数を使わず個別に書く）
    "mathbb_r": {
        command: "\\mathbb{R}",
        description: "実数全体の集合を表す黒板太字のRです。",
        tags: ["数式", "集合"],
        package: "amssymb",
        isMathMode: true
    }
};