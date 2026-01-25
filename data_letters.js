/* data_letters.js */

registerBigCategory("letters", {
    title: "文字",
    description: "LaTeXで使用できる文字一覧です",
    sections: [
        {
            title: "数式",
            categories: ["greek"] // data_greek.js で登録したIDを指定
        }
    ]
});