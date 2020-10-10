
/**
 * プレイヤーのクラス
 * HPや速度などの情報。移動のためのメソッドなどが用意される
 */
enchant.Player = enchant.Class.create(enchant.Sprite, {

  /**
   * @param {String} tag プレイヤーだと判定する用
   * @param {Number} hp 体力。1に設定
   * @param {Number} speed 速度を一定にする用(単位 : pixel / second)
   * @param {Boolean} gameovered やられたかどうか。2重でゲームオーバーになることの防止
   * @param {Boolean} moveable 移動ができるか。人間の操作ではない操作をはじく用
   * @param {Number} flashTime 点滅する時間
   */

  initialize: function(){

    enchant.Sprite.call(this, 4, 4);

    this.backgroundColor = "green";
    this.x = 100;
    this.y = 400;
    this.tag = "player";
    this.hp = 1;
    this.speed = 160 / second(1);
    this.gameovered = false;
    this.moveable = true;
    this.flashTime = 0;

    ui.addChild(this);

    let _this = this;

    this.on('DAMAGE', function(){
      if(this.hp <= 0){
        this.gameover();
      }else{
        this.damage();
      }
    });

    this.addCollision(ui);
    this.on(Event.COLLISION, function(e) {
      let target = e.collision.target;
      //衝突の対象が弾だったら
      if(target.tag == "shot"){
        this.hp -= 1;
        this.dispatchEvent(new enchant.Event('DAMAGE'));
      }
    });

    //点滅処理
    this.on(Event.ENTER_FRAME, function(){
      //点滅する時間が0ならやらない
      if(this.flashTime == 0) return;
      this.opacity = 0.5 + 0.5 * Math.sin(this.age);
      this.flashTime--;
      if(this.flashTime == 0) this.opacity = 1;
    });

    //操作可能ならそこへ移動させる
    this.scene.on(Event.TOUCH_START, function(e){
      if(operable){
        _this.move(e);
      }
    });

  },

  /**
   * HPが0以下になった時(一度きり)に起こす処理
   * @method
   */
  gameover: function(){
    if(!this.gameovered){
      //二度目が起きないようにtrueにしておく
      this.gameovered = true;
      //見えなくしておく
      this.opacity = 0;
      //変な処理が入らないようにtlは消しとく
      this.tl.clear();
      //プレイヤーのsceneのゲームオーバー演出をさせておく
      this.scene.gameover();

      //演出部分
      let squares = new Array(4);
      let color = "purple";
      let size = Math.sqrt(this.width * this.height / squares.length);
      for(let i = 0; i < squares.length; i++){
        squares[i] = new Square(size, color);
        squares[i].tag = "player";
        squares[i].x = this.x + i % size * size;
        squares[i].y = this.y + Math.floor(i / size) * size;
        ui.addChild(squares[i]);

        squares[i].tl.delay(second(1));
        squares[i].tl.fadeTo(0, second(2));
        squares[i].tl.and();
        squares[i].tl.moveBy(
          2 * (i % size - size / 2),
          5 * (Math.floor(i / size) +3),
          second(2)
        );
        squares[i].tl.then(function(){
          this.remove();
        });
      }
    }
  },

  /**
   * 指定したところへ向かって移動させる
   * 指定した地点までの間に壁があった場合は壁の前まで進み、止まる
   * @method
   * @param  {Object} e 移動してほしい場所のx座標とy座標を格納しているオブジェクト
   */
  move: function(e){
    //移動可能だったら
    if(this.moveable){
      //向かう場所
      let positionX = e.x;
      let positionY = e.y;
      //衝突地点計算用
      let slope = (e.y - this.y) / (e.x - this.x);
      //ほぼ縦に動いてた時は値を入れちゃう
      if(1000 < slope){
        slope = 416;
      }
      if(slope < -1000){
        slope = -416;
      }

      let intercept = e.y - slope * e.x;

      //指定した場所への移動中に壁に当たるならそこでストップ
      if(positionX < bounceLine[1]){
        positionX = bounceLine[1];
        positionY = slope*positionX + intercept;
      }else if(positionX > bounceLine[2] - this.width){
        positionX = bounceLine[2] - this.width;
        positionY = slope*positionX + intercept;
      }
      if(positionY < bounceLine[0]){
        positionY = bounceLine[0];
        positionX = (positionY - intercept) / slope;
      }else if(positionY > bounceLine[3] - this.height){
        positionY = bounceLine[3] - this.height;
        positionX = (positionY - intercept) / slope;
      }

      //距離の計算
      let distanceX = this.x - positionX;
      let distanceY = this.y - positionY;
      let distanceZ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      //命令を消してすぐに動かす
      this.tl.clear();
      this.tl.moveTo(positionX, positionY, distanceZ / this.speed);
    }
  },

  /**
   * ダメージを受けたときの処理
   * @method
   */
  damage: function(){
    //1秒間点滅させる
    this.flashTime = second(1);
  }

});

/**
 * 四角のクラス
 * 縦と横の大きさが同じ四角形を指定された色で作る
 */
enchant.Square = enchant.Class.create(enchant.Sprite, {

  /**
   * 初期化
   * @param  {Number} size 縦と横の大きさ
   * @param  {[type]} color その四角の色
   */
  initialize: function(size, color){

    enchant.Sprite.call(this, size, size);

    this.backgroundColor = color;
  }
});

/**
 * 敵の元クラス
 * どの敵も持っている情報などが用意されている
 */
enchant.Enemy = enchant.Class.create(enchant.Sprite, {

  /**
   * @param {String} tag 敵だと判別する用
   * @param {Number} hp 体力。デフォルトは1に設定
   * @param {Number} speed 速度を一定にする用(単位 : pizel / second)
   * @param {Boolean} actionable 行動できるか
   * @param {Boolean} isMoving 移動中か
   * @param {Boolean} killed やられた後か
   * @param {Number} flashTime 点滅する時間(フレーム数)
   */

  initialize: function(){

    enchant.Sprite.call(this, 32, 32);

    this.backgroundColor = "red";

    this.x = 320 / 2 - this.width / 2;
    this.y = -32;
    this.tag = "enemy";
    this.hp = 1;
    this.speed = 50 / second(1);
    this.actionable = false;
    this.isMoving = false;
    this.killed = false;
    this.flashTime = 0;

    ui.addChild(this);
    enemyCount++;

    //衝突判定
    this.addCollision(ui);
    this.on(Event.COLLISION, function(e){
      let target = e.collision.target;
      //衝突の対象がプレイヤーだったら
      if(target.tag == "player"){
        target.hp -= 1;
        target.dispatchEvent(new enchant.Event('DAMAGE'));
      }else
      //衝突の対象が弾だったら
      if(target.tag == "shot"){
        //跳ね返った後だったら
        if(target.bounceCount > 0){
          target.remove();
          this.hp -= 1;
          this.dispatchEvent(new enchant.Event('DAMAGE'));
        }
      }
    });
    //点滅処理
    this.on(Event.ENTER_FRAME, function(){
      //点滅する時間が0ならやらない
      if(this.flashTime == 0) return;
      this.opacity = 0.5 + 0.5 * Math.sin(this.age);
      this.flashTime--;
      if(this.flashTime == 0) this.opacity = 1;
    });
    //ダメージを受けたときの処理
    this.on('DAMAGE', function(){
      //すでにやられていたらやらない
      if(this.killed) return;
      //HPが0以下になったらやられる
      if(this.hp <= 0){
        this.kill();
        this.dispatchEvent(new enchant.Event('KILLED'));
        enemyCount--;
      }else{
        this.damage();
      }
    });
  },

  /**
   * 登場させるときの処理
   * @method
   * @param  {Number} place 出現させる位置。0:上 1:左上 2:右上 その他右下
   */
  appear: function(place){
    //登場中はプレイヤーの操作を受け付けない
    operable = false;

    let block1;
    let block2;
    let direction;
    let y, x;

    //位置によって演出のための場所を変える
    switch(place){
      case 0:
        ui.addChild(blocks[getBlocksNum(0, 3)]);
        ui.addChild(blocks[getBlocksNum(0, 6)]);
        block1 = blocks[getBlocksNum(0, 4)];
        block2 = blocks[getBlocksNum(0, 5)];
        direction = 0;
        break;
      case 1:
        ui.addChild(blocks[getBlocksNum(2, 0)]);
        ui.addChild(blocks[getBlocksNum(5, 0)]);
        block1 = blocks[getBlocksNum(3, 0)];
        block2 = blocks[getBlocksNum(4, 0)];
        direction = 1;
        break;
      case 2:
        ui.addChild(blocks[getBlocksNum(2, 9)]);
        ui.addChild(blocks[getBlocksNum(5, 9)]);
        block1 = blocks[getBlocksNum(3, 9)];
        block2 = blocks[getBlocksNum(4, 9)];
        direction = 2;
        break;
      case 3:
        ui.addChild(blocks[getBlocksNum(7, 0)]);
        ui.addChild(blocks[getBlocksNum(10, 0)]);
        block1 = blocks[getBlocksNum(8, 0)];
        block2 = blocks[getBlocksNum(9, 0)];
        direction = 1;
        break;
      case 4:
        ui.addChild(blocks[getBlocksNum(7, 9)]);
        ui.addChild(blocks[getBlocksNum(10, 9)]);
        block1 = blocks[getBlocksNum(8, 9)];
        block2 = blocks[getBlocksNum(9, 9)];
        direction = 2;
        break;
      default: console.log("error direction"); break;
    }

    this.x = (block1.x + block2.x) / 2;
    this.y = (block1.y + block2.y) / 2;

    //位置によって決まる方向の通りに動かす
    switch(direction){
      case 0:
        this.y -= 32;

        block1.tl.moveBy(-32, 0, second(1));
        block2.tl.moveBy(32, 0, second(1));
        this.tl.delay(second(1));

        block1.tl.delay(second(1));
        block2.tl.delay(second(1));
        this.tl.moveBy(0, 32 * 3, second(1));

        block1.tl.moveBy(32, 0, second(1));
        block2.tl.moveBy(-32, 0, second(1));
        this.tl.delay(second(1));
        break;

      case 1:
        this.x -= 32;

        block1.tl.moveBy(0, -32, second(1));
        block2.tl.moveBy(0, 32, second(1));
        this.tl.delay(second(1));

        block1.tl.delay(second(1));
        block2.tl.delay(second(1));
        this.tl.moveBy(32 * 3, 0, second(1));

        block1.tl.moveBy(0, 32, second(1));
        block2.tl.moveBy(0, -32, second(1));
        this.tl.delay(second(1));
        break;
      case 2:
        this.x += 32;

        block1.tl.moveBy(0, -32, second(1));
        block2.tl.moveBy(0, 32, second(1));
        this.tl.delay(second(1));

        block1.tl.delay(second(1));
        block2.tl.delay(second(1));
        this.tl.moveBy(-32 * 3, 0, second(1));

        block1.tl.moveBy(0, 32, second(1));
        block2.tl.moveBy(0, -32, second(1));
        this.tl.delay(second(1));
        break;
      default: console.log("error direction"); break;
    }

    //動き終わったら動かせるようにする
    this.tl.then(function(){
      operable = true;
      this.actionable = true;
      this.age = 0;
    });
  },

  /**
   * やられたときの処理
   * @method
   */
  kill: function(){
    if(!this.killed){
      //二度目が起きないようにtrueにしておく
      this.killed = true;
      //変な処理が入らないようにtlは消しとく
      this.tl.clear();
      this.remove();

      //演出部分
      let squares = new Array(36);
      let color = "pink";
      let size = this.width / Math.sqrt(squares.length);
      let width = Math.sqrt(squares.length);
      for(let i = 0; i < squares.length; i++){
        squares[i] = new Square(size, color);
        squares[i].x = this.x + i % width * size;
        squares[i].y = this.y + Math.floor(i / width) * size;
        ui.addChild(squares[i]);

        squares[i].tl.fadeTo(0, second(2));
        squares[i].tl.and();
        squares[i].tl.moveBy(2 * (i % width - size / 2), 2 * (Math.floor(i / width) +3), second(2));
        squares[i].tl.then(function(){
          squares[i].remove();
        });
      }
    }
  },

  /**
   * ダメージを受けたときの処理
   * @method
   */
  damage: function(){
    //1秒間点滅させる
    this.flashTime = second(1);
  }

});

/**
 * 敵1のクラス
 * その場からプレイヤーへ弾を撃ってくる
 */
enchant.Enemy1 = enchant.Class.create(enchant.Enemy, {

  initialize: function(){

    enchant.Enemy.call(this);

    this.hp = 1;

    this.on(Event.ENTER_FRAME, function(){
      //やられてたらやらない
      if(this.killed) return;
      //行動可能だったら
      if(this.actionable){
        //3秒に一回弾を打つ
        if(this.age % second(3) == 0){
          this.shot();
        }
      }
    });
  },

  /**
   * 弾を撃つ時の処理
   * @method
   */
  shot: function(){
    let shot = new Shot(this.centerX, this.centerY);
    shot.shoot(player.centerX, player.centerY);
  }
});

/**
 * 敵2のクラス
 * 移動しながらプレイヤーへ弾を撃ってくる
 */
enchant.Enemy2 = enchant.Class.create(enchant.Enemy, {

    initialize: function(){

      enchant.Enemy.call(this);

      this.hp = 3;
      this.speed = 50 / second(1); //1秒あたりの移動ピクセル

      this.on(Event.ENTER_FRAME, function(){
        //やられてたらやらない
        if(this.killed) return;
        //行動可能だったら
        if(this.actionable){
          //移動中じゃなかったら
          if(!this.isMoving){
            this.isMoving = true;
            //移動する場所や待機する時間を設定する
            let pointX = getRandom(bounceLine[1], bounceLine[2] - this.width);
            let pointY = getRandom(bounceLine[0], bounceLine[3] - this.height);
            let distanceX = this.x - pointX;
            let distanceY = this.y - pointY;
            let time = getRandom(1, 5);
            this.tl.delay(second(time));
            this.tl.moveTo(
              pointX,
              pointY,
              Math.sqrt(distanceX * distanceX + distanceY * distanceY) / this.speed
            );
            this.tl.then(function(){
              this.isMoving = false;
            });
          }
          //3秒に一回弾を打つ
          if(this.age % second(3) == 0){
            this.shot();
          }
        }
      });
    },

    /**
     * 弾を撃つ時の処理
     * @method
     */
    shot: function(){
      let shot = new Shot(this.centerX, this.centerY);
      shot.shoot(player.centerX, player.centerY);
    }
});

/**
 * 敵3のクラス
 * 弾を周りにまとわせてから撃ってくる
 */
enchant.Enemy3 = enchant.Class.create(enchant.Enemy, {

  /**
   * @param {enchant.Shot []} shots まだ撃ってない弾を管理する用の配列
   */
  initialize: function(){

    enchant.Enemy.call(this);

    this.hp = 5;
    this.shots = new Array();

    let interval = Math.floor(second(0.5));
    let cycleTime = second(6);
    let cosAns1 = new Array();
    let sinAns1 = new Array();
    let cosAns2 = new Array();
    let sinAns2 = new Array();
    for(let i = 0; i < 360 / 30; i++){
      sinAns1[i] = Math.sin(i * 30 * Math.PI / 180);
      cosAns1[i] = Math.cos(i * 30 * Math.PI / 180);
    }
    for(let i = 0; i < 2 * cycleTime / interval; i++){
      sinAns2[i] = Math.sin(360 * interval / cycleTime / 2 * i * Math.PI / 180);
      cosAns2[i] = Math.cos(360 * interval / cycleTime / 2 * i * Math.PI / 180);
    }

    this.interval = interval;
    this.cycleTime = cycleTime;
    this.cosAns1 = cosAns1;
    this.sinAns1 = sinAns1;
    this.cosAns2 = cosAns2;
    this.sinAns2 = sinAns2;



    this.on(Event.ENTER_FRAME, function(){
      //やられていたらやらない
      if(this.killed) return;
      //行動可能なら
      if(this.actionable){
        this.actionable = false;
        //2～4秒待ってから弾を撃つ
        let time = getRandom(2, 4);
        this.tl.delay(second(time));
        this.tl.then(function(){
          this.shot();
        });
      }
      //弾が複数あったら
      if(this.shots.length){
        //0.5秒に一回放つ
        if(this.age % second(3) == 0){
          //何番目の弾を撃つかを決める
          let num = getRandom(0, this.shots.length - 1);
          this.shots[num].shoot(player.centerX, player.centerY);
          this.shots.splice(num, 1);
          //弾がなくなったら、また弾を出せるようにする
          if(this.shots.length == 0){
            this.actionable = true;
          }
        }
      }
    });
    //やられたときに撃っていない弾を持っていたらそれも消しておく
    this.on('KILLED', function(){
      this.shots.forEach(function(value, index){
        value.remove();
      });
    });
  },

  /**
   * 弾を撃つ時の処理
   * @method
   */
  shot: function(){
    let _this = this;

    for(let i = 0; i < 360 / 30; i++){
      let shot = new Shot(this.centerX, this.centerY);
      this.shots.push(shot);
      shot.tl.moveTo(
        this.centerX + this.width * this.cosAns1[i],
        this.centerY + this.height * this.sinAns1[i],
        second(2)
      );
      shot.tl.then(function(){
        let j = i * 2;
        shot.on(Event.ENTER_FRAME, function(){
          //撃たれた後だったらやらない
          if(shot.isShooted) return;
          //敵の回りをくるくる回転させる
          if(Math.floor(shot.age % _this.interval) == 0){
            j++;
            j = j % (_this.sinAns2.length);
            shot.x = _this.centerX + _this.width * _this.cosAns2[j];
            shot.y = _this.centerY + _this.height * _this.sinAns2[j];
          }
        });
      });
    }
  }
});

/**
 * 敵4のクラス
 * 弾を2～11方向に飛ばしてくる
 */
enchant.Enemy4 = enchant.Class.create(enchant.Enemy, {

  initialize: function(){

    enchant.Enemy.call(this);

    this.hp = 5;

    this.on(Event.ENTER_FRAME, function(){
      //やられてたらやらない
      if(this.killed) return;
      //移動可能なら
      if(this.actionable){
        //3秒に一回に撃つ
        if(this.age % second(3) == 0){
          this.shot();
        }
      }
    });
  },

  /**
   * 弾を撃つ時の処理
   * @method
   */
  shot: function(){
    //何方向に撃つかを決める
    let count = getRandom(2, 11);
    for(let i = -(count - 1) / 2; i <= count / 2 - 1 / 2; i++){
      //プレイヤーまでの直線の傾きを求め、それを回転させていく
      let angle = Math.atan2(player.centerY - this.centerY, player.centerX - this.centerX);
      if(angle < 0){
        angle = angle + 2 * Math.PI;
      }
      angle = angle * 180 / Math.PI;

      angle += i * 60 / ((count - 1) / 2);

      let x = this.width / 2 * Math.cos(angle * Math.PI / 180);
      let y = this.height / 2 * Math.sin(angle * Math.PI / 180);

      let shot = new Shot(this.centerX + x, this.centerY + y);
      shot.shoot(player.centerX, player.centerY);
      shot.angle += i * 60 / ((count - 1) / 2);
    }
  }
});

/**
 * 敵5のクラス
 * 弾をプレイヤーまでの直線状に配置し、遅れて発射する
 */
enchant.Enemy5 = enchant.Class.create(enchant.Enemy, {

  /**
   * @param {enchant.Shot []} 撃つ前の弾を管理する用の配列
   */
  initialize: function(){

    enchant.Enemy.call(this);

    this.hp = 5;
    this.shots = new Array();

    this.on(Event.ENTER_FRAME, function(){
      //やられてたらやらない
      if(this.killed) return;
      //行動可能なら
      if(this.actionable){
        //8秒に一回撃つ
        if(this.age % second(8) == 0){
          this.shot();
        }
      }
    });
    //やられたときに撃っていない弾を持っていたらそれも消しておく
    this.on('KILLED', function(){
      this.shots.forEach(function(value, index){
        value.remove();
      });
    });
  },

  /**
   * 弾を撃つ時の処理
   * @method
   */
  shot: function(){
    let _this = this;
    //プレイヤーとの直線の傾きを求める
    let angle = Math.atan2(player.centerY - this.centerY, player.centerX - this.centerX);
    if(angle < 0){
      angle = angle + 2 * Math.PI;
    }
    angle = angle * 180 / Math.PI;

    let distanceX = player.centerX - this.centerX;
    let distanceY = player.centerY - this.centerY;
    let distanceZ = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    //そのままだとプレイヤーの真上に出現する可能性があるので半分にする
    distanceZ /= 2;

    //出したばっかの弾同士がぶつかって消えないように移動させる
    let x = distanceZ * Math.cos(angle * Math.PI / 180);
    let y = distanceZ * Math.sin(angle * Math.PI / 180);

    for(let i = 0; i < distanceZ; i += 32){
      let flashTime = second(5);

      let shot = new Shot(this.centerX + x * i / distanceZ, this.centerY + y * i / distanceZ);
      _this.shots.push(shot);

      shot.on(Event.ENTER_FRAME, function(){
        //点滅が0秒なら
        if(flashTime == 0) return;
        //残り3秒まではゆっくり
        if(flashTime > second(3)){
          shot.opacity = 0.5 + 0.5 * Math.sin(10 * this.age * Math.PI / 180);
        } //残り1秒までは少し早く
        else if(flashTime > second(1)){
          shot.opacity = 0.5 + 0.5 * Math.sin(40 * this.age * Math.PI / 180);
        } //残り1秒を切ったら早く
        else{
          shot.opacity = 0.5 + 0.5 * Math.sin(80 * this.age * Math.PI / 180);
        }
        flashTime--;
        //0になったら透明度を戻しておく
        if(flashTime == 0)  shot.opacity = 1;
      });
      shot.tl.delay(second(5));
      shot.tl.then(function(){
        shot.shoot(player.centerX, player.centerY);
        _this.shots = new Array();
      });
    }
  }
});

/**
 * 弾のクラス
 * 速さや跳ね返ったかどうかの情報。発射するときのメソッドなどが用意されている
 */
enchant.Shot = enchant.Class.create(enchant.Sprite, {

  /**
   * @param {String} tag 弾だと判別する用
   * @param {Boolean} isShooted 発射された後かどうか
   * @param {Number} bounceCount バウンド回数
   * @param {Number} speed 速度を一定にする用(単位 : pixel / second)
   * @param {Number} angle 次に進む方向を保持する用
   * @param {Number} nextX 次に進むx座標を保持する用
   * @param {Number} nextY 次に進むy座標を保持する用
   */

  /**
   * 初期化
   * @param  {Number} centerX 弾の中心のx座標
   * @param  {Number} centerY 弾の中心のy座標
   */
  initialize: function(centerX, centerY){

    enchant.Sprite.call(this, 4, 4);

    this.backgroundColor = "blue";
    this.centerX = centerX;
    this.centerY = centerY;
    this.tag = "shot";
    this.isShooted = false; //撃たれたか
    this.bounceCount = 0; //バウンド回数

    if(isShotSpeedUp) {
      this.speed = 160 / second(1); //1秒あたり160ピクセル移動
    } else {
      this.speed = 80 / second(1); //1秒あたり100ピクセル移動
    }

    this._angle = 0;

    ui.addChild(this);

    //毎フレーム動作
    this.on(Event.ENTER_FRAME, function(){
      //発射されてなかったら終了
      if(!this.isShooted) return;

      //次のフレームでの場所を予測する
      let x = this.nextX;
      let y = this.nextY;
      let bounced = false;

      //予測地点が壁より外なら、壁にぶつかり跳ね返った後の場所を予測する
      if(this.x + x < bounceLine[1]){
        x = 2 * (bounceLine[1] - this.x) - x;
        this._angle = 180 - this._angle;
        bounced = true;
      }else
      if(this.x + x >= bounceLine[2] - this.width){
        x = 2 * (bounceLine[2] - this.width - this.x) - x;
        this._angle = 180 - this._angle;
        bounced = true;
      }
      if(this.y + y < bounceLine[0]){
        y = 2 * (bounceLine[0] - this.y) - y;
        this._angle = -this._angle;
        bounced = true;
      }else
      if(this.y + y >= bounceLine[3] - this.height){
        y = 2 * (bounceLine[3] - this.height - this.y) - y;
        this._angle = -this._angle;
        bounced = true;
      }

      //バウンドしてたら
      if(bounced){
        if(this.bounceCount < maxBounceCount) {
          this.bounceCount++;

          this.backgroundColor = "orange";
          this.nextX = this.speed * Math.cos(this.angle * Math.PI / 180);
          this.nextY = this.speed * Math.sin(this.angle * Math.PI / 180);
        } else {
          this.remove();
        }
      }

      //予想分だけ動かす
      this.x += x;
      this.y += y;
    });
  },

  /**
   * 弾を発射するときの処理
   * @method
   * @param  {Number} x 向かう地点のx座標
   * @param  {Number} y 向かう地点のy座標
   */
  shoot: function(x, y){
    let positionX = x;  //向かう場所
    let positionY = y;  //向かう場所

    //向かう地点への直線の傾きを求める
    let angle = Math.atan2(positionY - this.centerY, positionX - this.centerX);
    if(angle < 0){
      angle = angle + 2 * Math.PI;
    }
    this.angle = angle * 180 / Math.PI;

    this.isShooted = true;
  },

  /**
   * 角度を入れておく変数
   * 角度を変えたときに次に進む座標も一緒に計算する
   * @type Number
   */
  angle: {
    get: function(){
      return this._angle;
    },
    set: function(angle){
      this._angle = angle;
      this.nextX = this.speed * Math.cos(angle * Math.PI / 180);
      this.nextY = this.speed * Math.sin(angle * Math.PI / 180);
    }
  }

});

/**
 * 壁のクラス
 * 何マス目かを入れるとそこにブロックを表示できる
 */
enchant.Block = enchant.Class.create(enchant.Group, {

  /**
   * 初期化
   * @param  {Number} x 何マス目に置くか（横）
   * @param  {Number} y 何マス目に置くか（縦）
   */
  initialize: function(x, y){

    enchant.Group.call(this);

    let block = new Sprite(30, 30);
    block.tag = "block";
    let top = new Sprite(32, 1);
    top.tag = "block";
    let left = new Sprite(1, 32);
    left.tag = "block";
    let right = new Sprite(1, 32);
    right.tag = "block";
    let bottom = new Sprite(32, 1);
    bottom.tag = "block";

    //全体の場所の移動
    this.x = x * 32;
    this.y = y * 32;
    //block
    block.x = 1;
    block.y = 1;
    block.backgroundColor = "#009dac";
    //top
    top.x = 0;
    top.y = 0;
    top.backgroundColor = "black";
    //left
    left.x = 0;
    left.y = 0;
    left.backgroundColor = "black";
    //right
    right.x = 31;
    right.y = 0;
    right.backgroundColor = "black";
    //bottom
    bottom.x = 0;
    bottom.y = 31;
    bottom.backgroundColor = "black";

    this.addChild(block);
    this.addChild(top);
    this.addChild(left);
    this.addChild(right);
    this.addChild(bottom);

    ui.addChild(this);
  }
});

/**
 * 文字のクラス
 * ピクセル数だけを変えたりできる
 */
enchant.Letter = enchant.Class.create(enchant.Label, {

  /**
   * 初期化
   * @param  {String} text 表示したい文字
   */
  initialize: function(text){

    enchant.Label.call(this, text);

    this._px = 30;
    this.font = this._px + "px 'square'";
    this.color = "white";
    this.width = 320;
    this.textAlign = "center";
    this.opacity = 0;

    ui.addChild(this);

    //ピクセル数が変えられた時
    this.on('CHANGE_PX', function(){
      this.font = this._px + "px 'square'";
    });
  },

  /**
   * ピクセル数
   * @type {Number}
   */
  px: {
    get: function(){
      return this._px;
    },
    set: function(px){
      this._px = px;
      this.dispatchEvent(new enchant.Event('CHANGE_PX'));
    }
  },

  /**
   * 表示するときのメソッド
   * @method
   * @param  {Function} callback 表示した後にしたい処理
   */
  show: function(callback){
    //すぐに表示するとフォントが間に合わないため少し遅らせる
    this.tl.delay(second(0.025));
    this.tl.then(function(){
      this.opacity = 1;
      this.dispatchEvent(new enchant.Event('SHOW'));
      if(callback){
        callback();
      }
    });
  }
});

/**
 * メッセージボックスのクラス
 * 文字が入りきらないことがないように改行する
 */
enchant.MessageBox = enchant.Class.create(enchant.Group, {

  initialize: function(){

    enchant.Group.call(this);

    let back = new Sprite(320, 150);
    back.backgroundColor = "silver";
    back.y = 480 - back.height;
    this.addChild(back);

    let texts = new Array();
    for(let i = 0; i < 7; i++){
      let text = new Letter();
      text.textAlign = "left";
      text.color = "white";
      text.px = 20;
      text.y = back.y + i * text.px + text.px / 2;
      this.addChild(text);
      texts.push(text);
      text.show();
    }

    this.back = back;
    this.texts = texts;

    //メッセージの内容が変更されたら
    this.on('CHANGE_MESSAGE', function(){
      //全て消しとく
      for(let i = 0; i < texts.length; i++){
        texts[i].text = "";
      }
      //それぞれの初期化
      let n = 0;
      let message = this.message;
      let indention = false;
      let maxLength = 23;
      if(useLanguage == "ja"){
        maxLength = 15;
      }
      for(let i = 0; i < texts.length; i++){
        indention = false;
        while(
          (texts[i].text.length < maxLength || texts[i].text.length == undefined) &&
          message[n] != undefined &&
          indention == false
        ){
          // '\n'なら改行文字とみなし改行する
          if(message[n] == '\n'){
            indention = true;
          }
          else{
            texts[i].text += message[n];
          }
          n++;
        }
      }
    });
  },

  /**
   * 書きたい文章を入れる
   * @type {String}
   */
  message: {
    get: function(){
      return this._message;
    },
    set: function(message){
      this._message = message;
      this.dispatchEvent(new enchant.Event('CHANGE_MESSAGE'));
    }
  }

});

/**
 * テキスト付矢印のクラス
 * 指したい場所とテキストの内容を引数に入れると矢印とテキストを出してくれる
 */
enchant.TextArrow = enchant.Class.create(enchant.Group, {

  /**
   * 初期化
   * @param  {Number} x         指したい場所のx座標
   * @param  {Number} y         指したい場所のy座標
   * @param  {String} arrowText 矢印のテキスト
   */
  initialize: function(x, y, arrowText){

    enchant.Group.call(this);

    let arrow = new Letter("↓");
    arrow.x = x - arrow.width / 2;
    arrow.y = y - arrow.px;
    arrow.show(function(){
      arrow.tl.fadeTo(0, second(0.5));
      arrow.tl.fadeTo(1, second(0.5));
      arrow.tl.fadeTo(0, second(0.5));
      arrow.tl.fadeTo(1, second(0.5));
      arrow.tl.fadeTo(0, second(0.5));
      arrow.tl.then(function(){
        arrow.remove();
      });
    });

    let text = new Letter(arrowText);
    text.px = 20;
    text.x = x - text.width / 2;
    text.y = arrow.y - text.px;
    text.show(function(){
      text.tl.fadeTo(0, second(0.5));
      text.tl.fadeTo(1, second(0.5));
      text.tl.fadeTo(0, second(0.5));
      text.tl.fadeTo(1, second(0.5));
      text.tl.fadeTo(0, second(0.5));
      text.tl.then(function(){
        text.remove();
      });
    });

    this.addChild(arrow);
    this.addChild(text);
    ui.addChild(this);

  }
});

//ステージの内容の変数
let stages = [
  //1
  [
    {type: enchant.Enemy1, place: 0}
  ],
  //2
  [
    {type: enchant.Enemy1, place: 1},
    {type: enchant.Enemy1, place: 2}
  ],
  //3
  [
    {type: enchant.Enemy1, place: 0},
    {type: enchant.Enemy1, place: 1},
    {type: enchant.Enemy1, place: 2}
  ],
  //4
  [
    {type: enchant.Enemy2, place: 0}
  ],
  //5
  [
    {type: enchant.Enemy2, place: 1},
    {type: enchant.Enemy2, place: 2}
  ],
  //6
  [
    {type: enchant.Enemy3, place: 0},
  ],
  //7
  [
    {type: enchant.Enemy3, place: 1},
    {type: enchant.Enemy3, place: 2}
  ],
  //8
  [
    {type: enchant.Enemy3, place: 0},
    {type: enchant.Enemy3, place: 1},
    {type: enchant.Enemy3, place: 2}
  ],
  //9
  [
    {type: enchant.Enemy4, place: 0}
  ],
  //10
  [
    {type: enchant.Enemy4, place: 1},
    {type: enchant.Enemy4, place: 2}
  ],
  //11
  [
    {type: enchant.Enemy4, place: 0},
    {type: enchant.Enemy4, place: 1},
    {type: enchant.Enemy4, place: 2}
  ],
  //12
  [
    {type: enchant.Enemy4, place: 0},
    {type: enchant.Enemy2, place: 1},
    {type: enchant.Enemy2, place: 2}
  ],
  //13
  [
    {type: enchant.Enemy4, place: 0},
    {type: enchant.Enemy3, place: 1},
    {type: enchant.Enemy3, place: 2}
  ],
  //14
  [
    {type: enchant.Enemy5, place: 0}
  ],
  //15
  [
    {type: enchant.Enemy5, place: 1},
    {type: enchant.Enemy5, place: 2}
  ],
  //16
  [
    {type: enchant.Enemy5, place: 0},
    {type: enchant.Enemy3, place: 1},
    {type: enchant.Enemy3, place: 2}
  ],
  //17
  [
    {type: enchant.Enemy5, place: 0},
    {type: enchant.Enemy1, place: 1},
    {type: enchant.Enemy1, place: 2},
    {type: enchant.Enemy1, place: 3},
    {type: enchant.Enemy1, place: 4}
  ],
  //18
  [
    {type: enchant.Enemy1, place: 0},
    {type: enchant.Enemy2, place: 1},
    {type: enchant.Enemy2, place: 2},
    {type: enchant.Enemy1, place: 3},
    {type: enchant.Enemy1, place: 4}
  ],
  //19
  [
    {type: enchant.Enemy2, place: 0},
    {type: enchant.Enemy2, place: 1},
    {type: enchant.Enemy2, place: 2},
    {type: enchant.Enemy2, place: 3},
    {type: enchant.Enemy2, place: 4}
  ],
  //20
  [
    {type: enchant.Enemy2, place: 0},
    {type: enchant.Enemy4, place: 1},
    {type: enchant.Enemy4, place: 2},
    {type: enchant.Enemy2, place: 3},
    {type: enchant.Enemy2, place: 4}
  ],
  //21
  [
    {type: enchant.Enemy3, place: 0},
    {type: enchant.Enemy1, place: 1},
    {type: enchant.Enemy1, place: 2},
    {type: enchant.Enemy4, place: 3},
    {type: enchant.Enemy4, place: 4}
  ],
  //22
  [
    {type: enchant.Enemy5, place: 0},
    {type: enchant.Enemy2, place: 1},
    {type: enchant.Enemy2, place: 2},
    {type: enchant.Enemy5, place: 3},
    {type: enchant.Enemy5, place: 4}
  ],
  //23
  [
    {type: enchant.Enemy4, place: 0},
    {type: enchant.Enemy5, place: 1},
    {type: enchant.Enemy5, place: 2},
    {type: enchant.Enemy5, place: 3},
    {type: enchant.Enemy5, place: 4}
  ],
  //24
  [
    {type: enchant.Enemy5, place: 0},
    {type: enchant.Enemy5, place: 1},
    {type: enchant.Enemy5, place: 2},
    {type: enchant.Enemy5, place: 3},
    {type: enchant.Enemy5, place: 4}
  ],
  //25
  [
    {type: enchant.Enemy4, place: 0},
    {type: enchant.Enemy4, place: 1},
    {type: enchant.Enemy4, place: 2},
    {type: enchant.Enemy4, place: 3},
    {type: enchant.Enemy4, place: 4}
  ]
];
