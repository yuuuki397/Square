
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
