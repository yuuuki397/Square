/**
 * ゲームで使う関数をまとめたクラス
 *
 * ====このファイルで定義している関数====
 * lastAccess：葉の要素に関数を実行させる
 * allAccess：各ノードに関数を実行させる
 * second：秒数を入れて、フレーム数を取得できる
 * getRandom：乱数を取得できる
 * getBlocksNum：mapData[y][x]はblocksの何番目かを取得できる
 * setBlock：mapDataの情報からブロックを配置する
 * setBounceLine：跳ね返る地点の設定を左上のブロックと右下のブロックから設定する
 */

/**
 * 第一引数の子要素の最後にアクセスする
 * @param  {enchant.Scene || enchant.Group} node 親要素
 * @param  {Function} callback 子要素の最後にしてほしい処理
 */
function lastAccess(node, callback){

  if(node != undefined && callback != undefined){
    if(node.childNodes != undefined){
      for(let i = node.childNodes.length - 1; i >= 0; i--){
        lastAccess(node.childNodes[i], callback);
      }
    }
    else{
      callback(node);
    }
  }
}

/**
 * 第一引数の子要素のすべてにアクセスする
 * @param  {enchant.Scene || enchant.Group} node 親要素
 * @param  {Function} callback 子要素の全てにしてほしい処理
 */
function allAccess(node, callback){

  if(node != undefined && callback != undefined){
    if(node.childNodes != undefined){
      for(let i = node.childNodes.length - 1; i >= 0; i--){
        allAccess(node.childNodes[i], callback);
      }
    }
    callback(node);
  }
}

/**
 * 秒数で指定するとフレーム数に直して返してくれる
 * @param  {Number} time 秒数
 * @return {Number} フレーム数
 */
function second(time){
  return time * core.fps;
}

/**
 * start以上end以下の整数をランダムで返す
 * @param  {Number} start 最低値
 * @param  {Number} end   最高値
 * @return {Number} ランダムで出た値
 */
function getRandom(start, end) {
    return start + Math.floor(Math.random() * (end - start + 1));
}

/**
 * mapData[y][x]はblocksの何番目の要素かを返す
 * @param  {Number} y mapData[y]
 * @param  {Number} x mapData[y][x]
 * @return {Number} 何番目かを返す
 */
function getBlocksNum(y, x){
  return y * mapData[y].length + x;
}

/**
 * mapDataの情報からブロックを配置する
 * @param {Number} [offsetX=0] x座標の位置調整
 * @param {Number} [offsetY=0] y座標の位置調整
 */
function setBlock(offsetX = 0, offsetY = 0) {
  blocks = new Array();
  for(let y = 0; y < mapData.length; y++){
    for(let x = 0; x < mapData[y].length; x++){
      //ブロックの作成
      let block = new Block(x, y);
      blocks.push(block);
      block.x += offsetX;
      block.y += offsetY;

      //ブロックがない場所だったのならブロックを取り除く
      if(mapData[y][x] == 0){
        block.remove();
      }
    }
  }
}

/**
 * 跳ね返る地点の設定を左上のブロックと右下のブロックから設定する
 * @param {enchant.Block} leftUpBlock    左上のブロック
 * @param {enchant.Block} rightDownBlock 右上のブロック
 */
function setBounceLine(leftUpBlock, rightDownBlock) {
  bounceLine = new Array(4);
  bounceLine[0] = leftUpBlock.y + 32;
  bounceLine[1] = leftUpBlock.x + 32;
  bounceLine[2] = rightDownBlock.x;
  bounceLine[3] = rightDownBlock.y;
}
