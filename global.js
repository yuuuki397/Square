let core;
let ui;       //画面表示用
let operable = false; //操作が可能か true: 操作可能 false: 操作不可能
let blocks = new Array();  //ブロックアクセス用の配列
let player;
let mapData = new Array();
let bounceLine = new Array(); //跳ね返りの地点
let enemyCount = 0; //残りの敵の数
let maxBounceCount = 3; //最大バウンド回数
let isGaming = false; //対戦中
let selectedStage = 0;  //選択されたステージ
let nextClearStage;     //次にクリアするステージ
let isReleaseAllStages = false; //全ステージ解放
let isHpUp = false; //HPアップ
let isShotSpeedUp = false; //弾のスピードを上げる
let useLanguage = "ja";
let tutorials;

//データがあれば
nextClearStage = localStorage.getItem("nextClearStage") | 0;
