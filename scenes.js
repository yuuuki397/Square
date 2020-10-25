/**
 * 実際のゲーム画面のファイル
 *
 * ====このファイルに定義されている画面====
 * ゲーム画面：試合中の画面
 * ステージ選択画面：ステージを選ぶ画面
 * タイトル画面：最初に表示される画面。ここから他の画面に行く
 * 機能の追加画面：機能の追加をする画面
 * ステージづくり画面：自分でステージを作る画面
 * 言語選択画面：言語を選択する画面。日本語or英語
 * チュートリアル画面：チュートリアルを選ぶ画面
 */

/**
 * メインのゲーム画面
 * @param  {Object} stageData ステージのデータ
 * @return {enchant.Scene}    ゲーム画面
 */
function gameStart(stageData) {
  let scene = new Scene();

  //ゲームオーバー時の処理
  scene.gameover = function() {
    //操作できなくして画面を黒くする
    isGaming = false;
    operable = false;
    background.backgroundColor = "black";
    ui.addChild(background);

    //敵と弾を消す
    lastAccess(scene, function(node) {
      if (node.tag == "enemy" || node.tag == "shot") {
        node.remove();
      }
    });

    //4秒待ってから表示する
    player.tl.delay(second(4));
    player.tl.then(function() {
      //結果表示
      let youLose = new Letter("you lose");
      youLose.y = 100;
      youLose.px = 50;
      youLose.show();

      //リスタート表示
      let restart = new Letter("リスタート", "restart");
      restart.y = 250;
      restart.px = 30;
      restart.show(function() {
        restart.on(Event.TOUCH_START, function() {
          core.replaceScene(gameStart(stageData));
        });
      });

      //セレクトステージ表示
      let selectStage = new Letter("ステージ選択へ", "select stage");
      selectStage.y = 300;
      selectStage.px = 30;
      selectStage.show(function() {
        selectStage.on(Event.TOUCH_START, function() {
          core.replaceScene(selectStageStart());
        });
      });

      //タイトル表示
      let title = new Letter("タイトルへ", "title");
      title.y = 350;
      title.px = 30;
      title.show(function() {
        title.on(Event.TOUCH_START, function() {
          core.replaceScene(titleStart());
        });
      });
    });
  }

  //UIを初期化
  ui = new Group();
  scene.addChild(ui);

  //ゲームのスタート
  enemyCount = 0;
  isGaming = true;

  //背景
  let background = new Background("gray");

  //プレイヤー
  player = new Player();
  if (isHpUp) player.hp = 10;

  //壁の作成
  mapData = new Array();
  mapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  //壁の設置
  setBlock();

  //跳ね返る地点の設定
  setBounceLine(blocks[0], blocks[blocks.length - 1]);

  //敵の配置
  if (stageData != undefined) {
    //ステージの情報があるなら、その情報から敵を配置する
    stageData.forEach(function(value) {
      let enemy = new value.type();
      enemy.appear(value.place);
    });
  } else if (selectedStage < stages.length) {
    //ステージの情報がないなら、選択中のステージの情報から敵を配置する
    stages[selectedStage].forEach(function(value) {
      let enemy = new value.type();
      enemy.appear(value.place);
    });
  } else {
    console.log("selectedStage error");
  }

  //クリアしたときの判定
  player.on(Event.ENTER_FRAME, function() {
    //試合中じゃないか敵が残っているのなら返す
    if(!isGaming) return;
    if(enemyCount > 0) return;

    //ゲームの終了
    isGaming = false;
    operable = false;
    player.gameovered = true;

    //選択したステージが最新のステージなら次のステージを解放
    if ((selectedStage == nextClearStage) && stageData == undefined) {
      nextClearStage++;
      localStorage.setItem("nextClearStage", nextClearStage);
    }

    //敵と弾を消す
    lastAccess(scene, function(node) {
      if (node.tag == "enemy" || node.tag == "shot") {
        node.remove();
      }
    });

    //結果表示
    let youWin = new Letter("you win!");
    youWin.y = 100;
    youWin.px = 50;
    youWin.color = "black";
    youWin.show();

    //ネクストステージ表示
    let nextStage = new Letter("次のステージへ", "next stage");
    nextStage.y = 250;
    nextStage.px = 30;
    //次のステージがあるなら表示
    if (stageData == undefined && selectedStage < stages.length - 1) {
      nextStage.show();
      //押されたら次のステージに行く
      nextStage.on(Event.TOUCH_START, function() {
        selectedStage++;
        core.replaceScene(gameStart());
      });
    }

    //セレクトステージ表示
    let selectStage = new Letter("ステージ選択へ", "select stage");
    selectStage.y = 300;
    selectStage.px = 30;
    selectStage.show(function() {
      selectStage.on(Event.TOUCH_START, function() {
        core.replaceScene(selectStageStart());
      });
    });

    //タイトル表示
    let title = new Letter("タイトルへ", "title");
    title.y = 350;
    title.px = 30;
    title.show(function() {
      title.on(Event.TOUCH_START, function() {
        core.replaceScene(titleStart());
      });
    });
  });

  return scene;
}

/**
 * ステージ選択の画面
 * @return {enchant.Scene} ステージ選択の画面
 */
function selectStageStart() {
  let scene = new Scene();

  //UIを初期化
  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Background("green");

  //戻る
  let back = new BackTitle();

  //ページ用変数
  let maxItem = 10;
  let page = Math.floor(selectedStage / maxItem);

  //項目を見せる
  let pageView = new Page();
  ui.addChild(pageView);

  return scene;
}

/**
 * タイトル画面
 * @return {enchant.Scene} タイトル画面
 */
function titleStart() {
  let scene = new Scene();

  //デモの時間管理用
  let timer;

  //ゲームオーバー時の処理
  scene.gameover = function() {
    //弾と敵とプレイヤーを消す
    lastAccess(scene, function(node) {
      if (node.tag == "player" || node.tag == "shot" || node.tag == "enemy") {
        node.remove();
      }
    });

    //1秒後にデモを再スタート
    timer.remove();
    scene.tl.delay(second(1));
    scene.tl.then(function() {
      demo();
    });
  }

  //UIを初期化
  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Background("whitesmoke");

  //壁の作成
  mapData = new Array();
  mapData = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  //壁の設置
  setBlock();

  //跳ね返る地点の設定
  setBounceLine(blocks[0], blocks[blocks.length - 1]);

  //タイトル
  let title = new Letter("Square");
  title.color = "black";
  title.y = -100;

  //スタート
  let start = new Letter("スタート", "start");
  start.color = "black";
  start.y = 290;

  //チュートリアル
  let tutorial = new Letter("チュートリアル", "tutorial");
  tutorial.color = "black";
  tutorial.y = 340;

  //追加機能
  let addFeatures = new Letter("機能の追加", "add features");
  addFeatures.color = "black";
  addFeatures.px = 20;
  addFeatures.y = 390;

  //ステージづくり
  let stageEdit = new Letter("ステージづくり", "stage edit");
  stageEdit.color = "black";
  stageEdit.px = 20;
  stageEdit.y = 430;

  //言語選択
  let language = new Letter("language", "言語");
  language.color = "black";
  language.px = 15;
  language.y = 480 - language.px;
  language.textAlign = "right";

  //デモをスタート
  scene.tl.delay(second(1));
  scene.tl.then(function() {
    demo();
  });
  //タイトルを表示
  scene.tl.delay(second(1));
  scene.tl.then(function() {
    title.show(function() {
      title.tl.moveTo(0, 100, second(1));
    });
  });
  //各テキストを表示
  scene.tl.delay(second(2));
  scene.tl.then(function() {
    //スタート
    start.show(function() {
      start.on(Event.TOUCH_START, function() {
        core.replaceScene(selectStageStart());
      });
    });
    //チュートリアル
    tutorial.show(function() {
      tutorial.on(Event.TOUCH_START, function() {
        core.replaceScene(tutorialStart());
      });
    });
    //機能の追加
    addFeatures.show(function() {
      addFeatures.on(Event.TOUCH_START, function() {
        core.replaceScene(addFeaturesStart());
      });
    });
    //ステージづくり
    stageEdit.show(function() {
      stageEdit.on(Event.TOUCH_START, function() {
        core.replaceScene(stageEditStart());
      });
    });
    //言語選択
    language.show(function() {
      language.on(Event.TOUCH_START, function() {
        core.replaceScene(languageSelectStart());
      });
    });
  });

  //デモ
  function demo() {
    //プレイヤー
    player = new Player();
    player.y = 200;

    //プレイヤーの移動の時間管理用
    timer = new Node();
    ui.addChild(timer);
    //0.7秒毎に移動する
    timer.tl.delay(second(0.7));
    timer.tl.then(function() {
      //範囲内のランダムなところに移動させる
      let x = getRandom(bounceLine[1], bounceLine[2]);
      let y = getRandom(bounceLine[0], bounceLine[3]);
      player.move({
        x: x,
        y: y
      });
    });
    timer.tl.loop();

    //敵
    let enemy = new Enemy1();
    enemy.appear(0);
    enemy.tl.then(function() {
      operable = false;
    });
    enemy.on('KILLED', function() {
      scene.gameover();
    });
  }

  return scene;
}

/**
 * 機能の追加画面
 * @return {enchant.Scene} 機能の追加画面
 */
function addFeaturesStart() {
  let scene = new Scene();

  //UIを初期化
  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Background("whitesmoke");

  //機能の追加
  let addFeatures = new Letter("機能の追加", "add features");
  addFeatures.color = "black";
  addFeatures.y = 50;
  addFeatures.show();

  //全ステージ解放
  let releaseAllStages = new Letter("全ステージ解放", "release all stages");
  releaseAllStages.px = 20;
  releaseAllStages.color = isReleaseAllStages ? "orange" : "black";
  releaseAllStages.y = 150;
  releaseAllStages.show();
  //押したらON/OFFを変化させる
  releaseAllStages.on(Event.TOUCH_START, function() {
    isReleaseAllStages = !isReleaseAllStages;
    releaseAllStages.color = isReleaseAllStages ? "orange" : "black";
  });

  //HPを上げる
  let hpUp = new Letter("HP増加", "HP UP");
  hpUp.px = 20;
  hpUp.color = isHpUp ? "orange" : "black";
  hpUp.y = 200;
  hpUp.show();
  //押したらON/OFFを変化させる
  hpUp.on(Event.TOUCH_START, function() {
    isHpUp = !isHpUp;
    hpUp.color = isHpUp ? "orange" : "black";
  });

  //弾のスピードを上げる
  let shotSpeedUp = new Letter("弾のスピードを上昇", "shot speed up");
  shotSpeedUp.px = 20;
  shotSpeedUp.color = isShotSpeedUp ? "orange" : "black";
  shotSpeedUp.y = 250;
  shotSpeedUp.show();
  //押したらON/OFFを変化させる
  shotSpeedUp.on(Event.TOUCH_START, function() {
    isShotSpeedUp = !isShotSpeedUp;
    shotSpeedUp.color = isShotSpeedUp ? "orange" : "black";
  });

  //戻る
  let back = new BackTitle();

  return scene;
}

/**
 * ステージづくり画面
 * @return {enchant.Scene} ステージづくり画面
 */
function stageEditStart() {
  let scene = new Scene();

  //UIを初期化
  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Background("whitesmoke");

  //戻る
  let back = new BackTitle();

  //作ったステージを格納する用
  let stageData = new Array();

  //敵の種類の配列
  let enemys = [
    enchant.Enemy1,
    enchant.Enemy2,
    enchant.Enemy3,
    enchant.Enemy4,
    enchant.Enemy5
  ];

  //ナンバーを表示
  let numberTextArray = new Array();
  for (let i = 0; i < PLACE_COUNT; i++) {
    let numberText;
    //1の時はフォントの関係で文字を調整する
    if(i == 1) {
      numberText = new Letter(` ${i}番 :`, `No${i}  : `);
    } else {
      numberText = new Letter(`${i}番 : `, `No${i} : `)
    }
    numberText.color = "black";
    numberText.textAlign = "left";
    numberText.x = 30;
    numberText.y = 100 + 50 * i;
    numberText.px = 20;
    numberText.show();
    numberTextArray.push(numberText);
  }

  //敵の種類
  let enemyType = new Letter("敵の種類", "enemy type");
  enemyType.color = "black";
  enemyType.textAlign = "left";
  enemyType.x = 100;
  enemyType.y = 50;
  enemyType.px = 20;
  enemyType.show();

  //ラジオボタン
  let radioButtonsArray = new Array();
  for (let i = 0; i < PLACE_COUNT; i++) {
    //横一列をまとめる
    let radioButtons = new RadioButtons();
    radioButtonsArray.push(radioButtons);

    //敵の種類の番号ボタン
    for (let j = 0; j < enemys.length; j++) {
      let radioButton = new RadioButton(j + 1);
      radioButton.x = 100 + 30 * j;
      radioButton.y = 100 + 50 * i;
      radioButton.show();
      radioButtons.addChild(radioButton);
    }
  }

  //決定ボタンの後ろのところ
  let okBack = new Sprite(60, 30);
  okBack.border(30, "crimson", 8);
  okBack.x = 320 - 70;
  okBack.y = 350;
  okBack.opacity = 0.5;
  ui.addChild(okBack);

  //決定ボタンのOK部分
  let ok = new Letter("OK");
  ok.color = "black";
  ok.textAlign = "left";
  ok.x = 320 - 55;
  ok.y = 355;
  ok.px = 20;
  ok.isValid = false;
  ok.show();

  //OKを押した時の処理
  ok.on(Event.TOUCH_START, function() {
    //有効じゃないなら終了
    if (!ok.isValid) return;

    //どのボタンが押されているかを調べていく
    for (let i = 0; i < PLACE_COUNT; i++) {
      let index = radioButtonsArray[i].getCheckedButtonIndex();
      if (index != -1) {
        //どの敵をどこに作るかのデータを入れていく
        stageData.push({
          type: enemys[index],
          place: i
        });
      }
    }

    //作ったステージのデータでゲームスタート
    core.replaceScene(gameStart(stageData));
  });

  //OKボタンの有効か無効かの判定処理
  ok.on(Event.ENTER_FRAME, function() {
    //チェックが入っているボタンがあるか調べていく
    for (let i = 0; i < PLACE_COUNT; i++) {
      //見つかったら有効
      if (radioButtonsArray[i].getCheckedButtonIndex() != -1) {
        ok.opacity = 1;
        ok.isValid = true;
        return;
      }
    }

    //見つからなかったら無効
    ok.opacity = 0.5;
    ok.isValid = false;
  });

  return scene;
}

/**
 * 言語選択画面
 * @return {enchant.Scene} 言語選択画面
 */
function languageSelectStart() {
  let scene = new Scene();

  //UIを初期化
  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Background("whitesmoke");

  //戻る
  let back = new BackTitle();

  //言語選択
  let language = new Letter("language");
  language.color = "black";
  language.y = 50;
  language.show();

  //日本語
  let japanese = new Letter("Japanese");
  japanese.y = 150;
  japanese.show();
  //押したら使用言語を日本語にする
  japanese.on(Event.TOUCH_START, function() {
    useLanguage = "ja";
    japanese.color = "orange";
    english.color = "black";
  });

  //英語
  let english = new Letter("English");
  english.y = 200;
  english.show();
  //押したら使用言語を英語にする
  english.on(Event.TOUCH_START, function() {
    useLanguage = "en";
    japanese.color = "black";
    english.color = "orange";
  });

  //言語選択によって色を変更する
  if(useLanguage == "ja") {
    japanese.color = "orange";
    english.color = "black";
  } else {
    japanese.color = "black";
    english.color = "orange";
  }

  return scene;
}

/**
 * チュートリアル画面
 * @return {enchant.Scene} チュートリアル画面
 */
function tutorialStart() {
  let scene = new Scene();

  //UIを初期化
  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Background("#00956f");

  //チュートリアル
  let tutorial = new Letter("チュートリアル", "tutorial");
  tutorial.color = "black";
  tutorial.px = 40;
  tutorial.y = 30;
  tutorial.show();

  //戻る
  let back = new BackTitle();

  //移動
  let move = new Letter("移動方法", "move");
  move.color = "black";
  move.y = 120;
  move.show(function() {
    move.on(Event.TOUCH_START, function() {
      core.pushScene(tutorials.move());
    });
  });

  //攻撃
  let attack = new Letter("攻撃方法", "attack");
  attack.color = "black";
  attack.y = 180;
  attack.show(function() {
    attack.on(Event.TOUCH_START, function() {
      core.pushScene(tutorials.attack());
    });
  });

  return scene;
}

//チュートリアルの内容の変数
tutorials = {
  /**
   * 移動のチュートリアル
   * @return {enchant.Scene} 移動のチュートリアル画面
   */
  move: function() {
    let scene = new Scene();

    //UIを初期化
    ui = new Group();
    scene.addChild(ui);

    //背景
    let background = new Background("peru");

    //戻る
    let back = new Back();

    //操作不能にする
    operable = false;

    //メッセージボックス
    let messageBox = new MessageBox(
      "・移動方法\n" +
      "画面をタッチすると、そこへ向かってプレイヤーは動きます\n" +
      "うまく移動して敵の攻撃をよけましょう",
      "・move\n" +
      "When you touch the screen, the player moves towards it.\n" +
      "Avoid enemy attacks by moving well!"
    );
    ui.addChild(messageBox);

    //デモをスタート
    demo();

    //デモ
    function demo() {
      //デモでプレイヤーを移動させる場所
      let touchX = 200;
      let touchY = 150;

      //プレイヤー
      player = new Player();
      player.y = 100;

      //自分を指す矢印
      let me = new TextArrow(
        player.x + player.width / 2,
        player.y + player.height / 2,
        "me"
      );
      //3秒後にタッチ地点を指す矢印を出す
      me.tl.delay(second(3));
      me.tl.then(function() {
        //タッチ地点を指す矢印
        let touch = new TextArrow(
          touchX + player.width / 2,
          touchY + player.height / 2,
          "touch"
        );

        //3秒後にプレイヤーを移動させる
        touch.tl.delay(second(3));
        touch.tl.then(function() {
          player.move({
            x: touchX,
            y: touchY
          });
        });
        //3秒後にデモを再スタートさせる
        touch.tl.delay(second(3));
        touch.tl.then(function() {
          me.remove();
          touch.remove();
          player.remove();
          demo();
        });
      })
    }

    return scene;
  },

  /**
   * 攻撃のチュートリアル
   * @return {enchant.Scene} 攻撃のチュートリアルの画面
   */
  attack: function() {
    let scene = new Scene();

    //ゲームオーバーの時の処理
    scene.gameover = function() {
      //プレイヤーと敵と弾は全て消す
      lastAccess(scene, function(node) {
        if (node.tag == "player" || node.tag == "enemy" || node.tag == "shot") {
          node.remove();
        }
      });

      //4秒後にデモを再スタート
      scene.tl.delay(second(4));
      scene.tl.then(function() {
        demo();
      });
    }

    //UIを初期化
    ui = new Group();
    scene.addChild(ui);

    //背景
    let background = new Background("peru");

    //戻る
    let back = new Back();

    //マップデータ
    mapData = new Array();
    mapData = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ];

    //壁の配置
    setBlock(32, 64);

    //跳ね返る地点の設定
    setBounceLine(blocks[0], blocks[blocks.length - 1]);

    //メッセージボックス
    let messageBox = new MessageBox(
      "・攻撃方法\n" +
      "一度跳ね返った弾を敵に当てることでダメージを与えられます\n" +
      "うまくよけて敵に攻撃しましょう",
      "・attack\n" +
      "By hitting the bounced ball against the enemy, you can damage the enemy.\n" +
      "Let's dodge a lot!"
    );
    ui.addChild(messageBox);

    //デモをスタート
    demo();

    //デモ
    function demo() {
      //プレイヤー
      player = new Player();
      player.x = 150;
      player.y = 200;
      //移動させる
      player.moveable = true;
      player.move({
        x: 200,
        y: 200
      });

      //敵
      let enemy = new Enemy1();
      enemy.x = 200;
      enemy.y = 120;
      enemy.shot();
      //敵が死んでもゲームオーバーになるようにする
      enemy.on('KILLED', function() {
        scene.gameover();
      });
    }

    return scene;
  }
};
