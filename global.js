/**
 * グローバル変数を定義するファイル
 *
 * クラスの定義や関数の定義などの前に定義しておきたいものをここに定義している
 */

let core;                       //ゲーム部分
let ui;                         //画面表示用
let operable = false;           //操作が可能か true: 操作可能 false: 操作不可能
let blocks = new Array();       //ブロックアクセス用の配列
let player;                     //プレイヤー
let mapData = new Array();      //マップのデータ
let bounceLine = new Array();   //跳ね返りの地点
let enemyCount = 0;             //残りの敵の数
let maxBounceCount = 3;         //最大バウンド回数
let isGaming = false;           //対戦中か
let selectedStage = 0;          //選択されたステージ
let nextClearStage;             //次にクリアするステージ
let isReleaseAllStages = false; //全ステージ解放
let isHpUp = false;             //HPアップ
let isShotSpeedUp = false;      //弾のスピードを上げる
let useLanguage = "ja";         //使用言語
let tutorials;                  //チュートリアルの内容の変数

const PLACE_COUNT = 5;          //出現場所の数

//データがあれば格納する
nextClearStage = localStorage.getItem("nextClearStage") | 0;
