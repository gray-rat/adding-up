'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {
    const columns =lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        };
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});

// .on('close', () => でクローズイベントが起きた時次のアロー関数（無名関数）を実行
rl.on('close', () => {
    // for of　構文　python のfor 変数　in　と同様
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    // Array.from()メソッドで連想配列から通常の配列に変換
    //.sort(変数)関数でソートした結果を返す
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // ソート結果を整形して出力 map関数はpythonと同様
    const rankingSrtrings = rankingArray.map(([key, value]) =>{
        return key + ': ' + value.popu10 + ': ' + value.popu15 + '変化率: ' + value.change;
    });
    console.log(rankingSrtrings);
});