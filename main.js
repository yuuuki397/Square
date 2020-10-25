/**
 * ゲームを起動する処理を書いているファイル
 *
 * scenes.jsに定義した画面（シーン）を表示して行ってゲームを作る
 * 最初にタイトル画面を表示させて、そこから各シーンに移動させる
 */

//==========
//EnchantJS
enchant();
window.onload = function() {
  enchant.ENV.USE_TOUCH_TO_START_SCENE = false;
  core = new Core(320, 480);
  core.fps = 50;
  core.onload = function() {
    core.resume();
    core.replaceScene(titleStart());  //タイトル画面を最初に表示する
  };
  core.start();
  core.pause();
};
