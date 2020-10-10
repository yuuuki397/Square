
//実際のゲームの画面
function gameStart(stageData){
  let scene = new Scene();

  scene.gameover = function(){
    isGaming = false;
    operable = false;
    background.backgroundColor = "black";
    ui.addChild(background);

    //敵と弾を消す
    lastAccess(scene, function(node){
      if(node.tag == "enemy" || node.tag == "shot"){
        node.remove();
      }
    });

    player.tl.delay(second(4));
    player.tl.then(function(){
      let youLose = new Letter("you lose");
      youLose.y = 100;
      youLose.px = 50;
      youLose.show();

      let restart = new Letter("restart");
      restart.y = 250;
      restart.px = 30;

      restart.show(function(){
        restart.on(Event.TOUCH_START, function(){
          core.replaceScene(gameStart(stageData));
        });
      });

      let selectStage = new Letter("select stage");
      selectStage.y = 300;
      selectStage.px = 30;

      selectStage.show(function(){
        selectStage.on(Event.TOUCH_START, function(){
          core.replaceScene(selectStageStart());
        });
      });

      let title = new Letter("title");
      title.y = 350;
      title.px = 30;

      title.show(function(){
        title.on(Event.TOUCH_START, function(){
          core.replaceScene(titleStart());
        });
      });

      //選択言語が日本語なら
      if(useLanguage == "ja"){
        restart.text = "リスタート";
        selectStage.text = "ステージ選択へ"
        title.text = "タイトルへ";
      }
    });
  }

  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Sprite(320,480);
  background.backgroundColor = "grey";
  background.tag = "back";
  ui.addChild(background);

  //プレイヤー
  player = new Player();
  if(isHpUp)  player.hp = 10;

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

  //マップに壁を設置
  blocks = new Array();
  for(let y = 0; y < mapData.length; y++){
    for(let x = 0; x < mapData[y].length; x++){
      let block = new Block(x, y);
      blocks.push(block);
      if(mapData[y][x] == 0){
        block.remove();
      }
    }
  }

  //跳ね返る地点の設定
  bounceLine = new Array(4);
  bounceLine[0] = blocks[getBlocksNum(0, 0)].y + 32;
  bounceLine[1] = blocks[getBlocksNum(0, 0)].x + 32;
  bounceLine[2] = blocks[getBlocksNum(0, mapData[0].length - 1)].x;
  bounceLine[3] = blocks[getBlocksNum(mapData.length - 1, mapData[0].length - 1)].y;

  //実際の処理
  enemyCount = 0;
  isGaming = true;

  //敵の配置
  if(stageData != undefined){
    stageData.forEach(function(value){
      let enemy = new value.type();
      enemy.appear(value.place);
    });
  }else if(selectedStage < stages.length){
    stages[selectedStage].forEach(function(value, index){
      let enemy = new value.type();
      enemy.appear(value.place);
    });
  }else{
    console.log("selectedStage error");
  }

  //クリアしたときの判定
  player.on(Event.ENTER_FRAME, function(){
    if(isGaming == true){
      if(enemyCount == 0){
        isGaming = false;
        operable = false;

        //選択したステージが最新のステージなら
        if(selectedStage == (nextClearStage) && stageData == undefined){
          nextClearStage++;
          localStorage.setItem("nextClearStage", nextClearStage);
        }

        //敵と弾を消す
        lastAccess(scene, function(node){
          if(node.tag == "enemy" || node.tag == "shot"){
            node.remove();
          }
        });

        let youWin = new Letter("you win!");
        youWin.y = 100;
        youWin.px = 50;
        youWin.color = "black";
        youWin.show();

        let nextStage = new Letter("next stage");
        nextStage.y = 250;
        nextStage.px = 30;

        //ステージづくりのバトルじゃなかったら
        if(stageData == undefined){
          nextStage.show(function(){
            nextStage.on(Event.TOUCH_START, function(){
              selectedStage++;
              core.replaceScene(gameStart());
            });
          });
        }

        let selectStage = new Letter("select stage");
        selectStage.y = 300;
        selectStage.px = 30;

        selectStage.show(function(){
          selectStage.on(Event.TOUCH_START, function(){
            core.replaceScene(selectStageStart());
          });
        });

        let title = new Letter("title");
        title.y = 350;
        title.px = 30;

        title.show(function(){
          title.on(Event.TOUCH_START, function(){
            core.replaceScene(titleStart());
          });
        });

        //選択言語が日本語なら
        if(useLanguage == "ja"){
          nextStage.text = "次のステージへ";
          selectStage.text = "ステージ選択へ";
          title.text = "タイトルへ";
        }

        player.gameovered = true;
      }
    }

  });

  return scene;
}

//ステージ選択の画面
function selectStageStart(){
  let scene = new Scene();

  ui = new Group();
  scene.addChild(ui);

  let background = new Sprite(320, 480);
  background.backgroundColor = "green";
  ui.addChild(background);

  let back = new Letter("back");
  back.color = "black";
  back.textAlign = "left";
  back.px = 15;
  back.show(function(){
    back.on(Event.TOUCH_START, function(){
      core.replaceScene(titleStart());
    });
  });

  //選択言語が日本語なら
  if(useLanguage == "ja"){
    back.text = "もどる";
  }

  let maxItem = stages.length;
  let showMaxItem = 10;
  let page = Math.floor(selectedStage / showMaxItem);

  showItems();

  scene.on('TOUCH_ITEM', function(){
    core.replaceScene(gameStart());
  });

  //ステージ表示用
  function showItems(){
    //ステージの一覧
    for(let i = 0; i < showMaxItem; i++){
      //ステージ数を超えたら表示しない
      if((page * showMaxItem + i) >= maxItem) break;

      let letter = new Letter("STAGE :" + ("000" + (page * showMaxItem + i + 1)).slice(-3));
      letter.number = page * showMaxItem + i;
      letter.textAlign = "left";
      letter.tag = "letter";
      letter.x = 50;
      letter.y = 20 + 40 * i;
      letter.show(function(){
        //次にクリアするステージまでしか選択できないようにする
        if(letter.number < nextClearStage + 1 || isReleaseAllStages){
          letter.on(Event.TOUCH_START, function(){
            selectedStage = letter.number;
            letter.scene.dispatchEvent(new enchant.Event('TOUCH_ITEM'));
          });
        }else{
          letter.opacity = 0.5;
        }
      });
    }
    //左ページ移動用
    let leftPage = new Letter("<=");
    leftPage.textAlign = "left";
    leftPage.x = leftPage.px / 2;
    leftPage.y = 480 - leftPage.px * 2;
    leftPage.tag = "page";
    leftPage.show(function(){
      if(page > 0){
        leftPage.on(Event.TOUCH_START, function(){
          page--;
          scene.tl.then(function(){
            lastAccess(scene, function(node){
              if(node.tag == "page" || node.tag == "letter"){
                node.remove();
              }
            });
          });
          scene.tl.delay(second(1));
          scene.tl.then(function(){
            showItems();
          });
        });
      }else{
        leftPage.opacity = 0.5;
      }
    });
    //右ページ移動用
    let rightPage = new Letter("=>");
    rightPage.textAlign = "right";
    rightPage.x = - rightPage.px / 2;
    rightPage.y = 480 - rightPage.px * 2;
    rightPage.tag = "page";
    rightPage.show(function(){
      if(maxItem > (page + 1) * showMaxItem){
        rightPage.on(Event.TOUCH_START, function(){
          page++;
          scene.tl.then(function(){
            lastAccess(scene, function(node){
              if(node.tag == "page" || node.tag == "letter"){
                node.remove();
              }
            });
          });
          scene.tl.delay(second(1));
          scene.tl.then(function(){
            showItems();
          });
        });
      }else{
        rightPage.opacity = 0.5;
      }
    });

    //何ページ目か表示用
    let pageNum = new Letter("page - " + (page + 1));
    pageNum.px = 15;
    pageNum.y = 480 - pageNum.px * 2;
    pageNum.tag = "page";
    pageNum.show();
  }

  return scene;
}

//タイトル画面
function titleStart(){
  let scene = new Scene();

  scene.gameover = function(){

    //弾と敵とプレイヤーを消す
    manager.remove();
    lastAccess(scene, function(node){
      if(node.tag == "player" || node.tag == "shot" || node.tag == "enemy"){
        node.remove();
      }
    });
    scene.tl.delay(second(1));
    scene.tl.then(function(){
      demo();
    });
  }

  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Sprite(320, 480);
  background.backgroundColor = "whitesmoke";
  ui.addChild(background);

  blocks = new Array();

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
  for(let y = 0; y < mapData.length; y++){
    for(let x = 0; x < mapData[y].length; x++){
      block = new Block(x, y);
      blocks.push(block);
      if(mapData[y][x] == 0){
        block.remove();
      }
    }
  }
  //跳ね返る地点の設定
  bounceLine = new Array(4);
  bounceLine[0] = blocks[getBlocksNum(0, 0)].y + 32;
  bounceLine[1] = blocks[getBlocksNum(0, 0)].x + 32;
  bounceLine[2] = blocks[getBlocksNum(0, mapData[0].length - 1)].x;
  bounceLine[3] = blocks[getBlocksNum(mapData.length - 1, mapData[0].length - 1)].y;

  //タイトル
  let title = new Letter("Square");
  title.color = "black";
  title.y = -100;

  //スタート
  let start = new Letter("start");
  start.color = "black";
  start.y = 290;

  //チュートリアル
  let tutorial = new Letter("tutorial");
  tutorial.color = "black";
  tutorial.y = 340;

  //追加機能
  let addFeatures = new Letter("add features");
  addFeatures.color = "black";
  addFeatures.px = 20;
  addFeatures.y = 390;

  //自作ステージ
  let stageEdit = new Letter("stage edit");
  stageEdit.color = "black";
  stageEdit.px = 20;
  stageEdit.y = 430;

  //言語選択
  let language = new Letter("言語");
  language.color = "black";
  language.px = 15;
  language.y = 480 - language.px;
  language.textAlign = "right";

  //選択言語が日本語なら
  if(useLanguage == "ja"){
    start.text = "スタート";
    tutorial.text = "チュートリアル";
    addFeatures.text = "機能の追加";
    stageEdit.text = "ステージづくり";
    language.text = "language";
  }

  //動かし始める
  scene.tl.delay(second(1));
  scene.tl.then(function(){
    demo();
  });
  scene.tl.delay(second(1));
  scene.tl.then(function(){
    title.show(function(){
      title.tl.moveTo(0, 100, second(1));
    });
  });
  scene.tl.delay(second(2));
  scene.tl.then(function(){
    start.show(function(){
      start.on(Event.TOUCH_START, function(){
        core.replaceScene(selectStageStart());
      });
    });
    tutorial.show(function(){
      tutorial.on(Event.TOUCH_START, function(){
        core.replaceScene(tutorialStart());
      });
    });
    addFeatures.show(function(){
      addFeatures.on(Event.TOUCH_START, function(){
        core.replaceScene(addFeaturesStart());
      });
    });
    stageEdit.show(function(){
      stageEdit.on(Event.TOUCH_START, function(){
        core.replaceScene(stageEditStart());
      });
    });
    language.show(function(){
      language.on(Event.TOUCH_START, function(){
        core.replaceScene(languageSelectStart());
      });
    });
  });

  let manager;

  function demo(){

    player = new Player();
    player.y = 200;

    let y = 0, x = 0;

    manager = new Sprite(32, 32);
    ui.addChild(manager);
    manager.tl.delay(second(0.7));
    manager.tl.then(function(){
      x = getRandom(bounceLine[1], bounceLine[2]);
      y = getRandom(bounceLine[0], bounceLine[3]);

      player.move({x: x, y: y});
    });
    manager.tl.loop();

    let enemy = new Enemy1();
    enemy.appear(0);
    enemy.tl.then(function() {
      operable = false;
    });
    enemy.on('KILLED', function(){
      scene.gameover();
    });
  }


  return scene;
}

//機能の追加画面
function addFeaturesStart(){

  let scene = new Scene();

  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Sprite(320, 480);
  background.backgroundColor = "whitesmoke";
  ui.addChild(background);

  //機能の追加
  let addFeatures = new Letter("add features");
  addFeatures.color = "black";
  addFeatures.y = 50;
  addFeatures.show();

  //全ステージ解放
  let releaseAllStages = new Letter("release all stages");
  releaseAllStages.px = 20;
  releaseAllStages.color = isReleaseAllStages ? "orange" : "black";
  releaseAllStages.y = 150;
  releaseAllStages.show(function(){
    releaseAllStages.on(Event.TOUCH_START, function(){
      isReleaseAllStages = !isReleaseAllStages;
      releaseAllStages.color = isReleaseAllStages ? "orange" : "black";
    });
  });

  //HPを上げる
  let hpUp = new Letter("HP UP");
  hpUp.px = 20;
  hpUp.color = isHpUp ? "orange" : "black";
  hpUp.y = 200;
  hpUp.show(function(){
    hpUp.on(Event.TOUCH_START, function(){
      isHpUp = !isHpUp;
      hpUp.color = isHpUp ? "orange" : "black";
    });
  });

  //弾のスピードを上げる
  let shotSpeedUp = new Letter("shot speed up");
  shotSpeedUp.px = 20;
  shotSpeedUp.color = isShotSpeedUp ? "orange" : "black";
  shotSpeedUp.y = 250;
  shotSpeedUp.show(function(){
    shotSpeedUp.on(Event.TOUCH_START, function(){
      isShotSpeedUp = !isShotSpeedUp;
      shotSpeedUp.color = isShotSpeedUp ? "orange" : "black";
    });
  });

  let back = new Letter("back");
  back.color = "black";
  back.textAlign = "left";
  back.px = 15;
  back.show(function(){
    back.on(Event.TOUCH_START, function(){
      core.replaceScene(titleStart());
    });
  });

  //選択言語が日本語なら
  if(useLanguage == "ja"){
    back.text = "もどる";
    addFeatures.text = "機能の追加";
    releaseAllStages.text = "全ステージ解放";
    hpUp.text = "HP増加";
    shotSpeedUp.text = "弾のスピードを上昇";

  }

  return scene;
}

//ステージづくり画面
function stageEditStart(){
  let scene = new Scene();

  ui = new Group();
  scene.addChild(ui);

  let background = new Sprite(320, 480);
  background.backgroundColor = "whitesmoke";
  ui.addChild(background);

  let back = new Letter("back");
  back.color = "black";
  back.textAlign = "left";
  back.px = 15;
  back.show(function(){
    back.on(Event.TOUCH_START, function(){
      core.replaceScene(titleStart());
    });
  });

  let stageData = new Array();
  let dataCount = 0;

  let enemys = [
    enchant.Enemy1,
    enchant.Enemy2,
    enchant.Enemy3,
    enchant.Enemy4,
    enchant.Enemy5
  ];

  let numberTexts = new Array();
  for(let i = 0; i < 5; i++){
    let numberText = new Letter("No" + i + " : ");
    if(i == 1) numberText.text = "No" + i + "  : ";
    numberText.color = "black";
    numberText.textAlign = "left";
    numberText.x = 30;
    numberText.y = 100 + 50 * i;
    numberText.px = 20;
    numberTexts.push(numberText);
    numberText.show();
  }

  let enemyType = new Letter("enemy type");
  enemyType.color = "black";
  enemyType.textAlign = "left";
  enemyType.x = 100;
  enemyType.y = 50;
  enemyType.px = 20;
  enemyType.show();

  let letters = new Array();
  for(let i = 0; i < 5; i++){
    letters[i] = new Array();
    for(let j = 0; j < 5; j++){
      let letter = new Letter(j + 1);
      letter.color = "black";
      letter.textAlign = "left";
      letter.x = 100 + 30 * j;
      letter.y = 100 + 50 * i;
      letter.px = 20;
      letters[i].push(letter);
      letter.show(function(){
        letter.on(Event.TOUCH_START, function(){
          if(letter.color == "orange"){
            letter.color = "black";
            dataCount--;
          }else{
            let flg = false;  //その列にオレンジのがすでにあったらtrue
            for(let k = 0; k < 5; k++){
              if(letters[i][k].color == "orange"){
                flg = true;
              }
              letters[i][k].color = j == k ? "orange" : "black";
            }
            if(!flg){
              dataCount++;
            }
          }
          if(dataCount == 0){
            ok.opacity = 0.5;
          }else{
            ok.opacity = 1;
          }
        });
      });
    }
  }

  //決定ボタン
  let okBack = new Sprite(60, 30);
  okBack.border(30, "crimson", 8);
  okBack.x = 320 - 70;
  okBack.y = 350;
  okBack.opacity = 0.5;
  ui.addChild(okBack);

  let ok = new Letter("OK");
  ok.color = "black";
  ok.textAlign = "left";
  ok.x = 320 - 55;
  ok.y = 355;
  ok.px = 20;
  ok.show(function(){
    ok.opacity = 0.5;
    ok.on(Event.TOUCH_START, function(){
      //データが一つ以上あれば
      if(dataCount > 0){
        for(let i = 0; i < 5; i++){
          for(let j = 0; j < 5; j++){
            //選択されているのなら
            if(letters[i][j].color == "orange"){
              stageData.push({type: enemys[j], place: i});
            }
          }
        }
        core.replaceScene(gameStart(stageData));
      }
    });
  });
  //選択言語が日本語なら
  if(useLanguage == "ja"){
    back.text = "もどる";
    enemyType.text = "　敵の種類";
    numberTexts.forEach(function(value, index){
      value.text = index == 1 ? index + "番  : " : index + "番 : ";
    });
  }

  return scene;
}

//言語選択画面
function languageSelectStart(){

  let scene = new Scene();

  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Sprite(320, 480);
  background.backgroundColor = "whitesmoke";
  ui.addChild(background);

  let back = new Letter("back");
  back.color = "black";
  back.textAlign = "left";
  back.px = 15;
  back.show(function(){
    back.on(Event.TOUCH_START, function(){
      core.replaceScene(titleStart());
    });
  });

  let language = new Letter("language");
  language.color = "black";
  language.y = 50;
  language.show();

  let japanese = new Letter("Japanese");
  japanese.color = "black";
  japanese.y = 150;
  japanese.show(function(){
    japanese.on(Event.TOUCH_START, function(){
      useLanguage = "ja";
      back.text = "もどる";
      japanese.color = "orange";
      english.color = "black";
    });
  });

  let english = new Letter("English");
  english.color = "black";
  english.y = 200;
  english.show(function(){
    english.on(Event.TOUCH_START, function(){
      useLanguage = "en";
      back.text = "back";
      japanese.color = "black";
      english.color = "orange";
    });
  });

  //選択言語が日本語なら
  if(useLanguage == "ja"){
    back.text = "もどる";
    japanese.color = "orange";
  }else{
    english.color = "orange";
  }

  return scene;
}

//チュートリアル画面
function tutorialStart(){

  let scene = new Scene();

  ui = new Group();
  scene.addChild(ui);

  //背景
  let background = new Sprite(320, 480);
  background.backgroundColor = "#00956f";
  ui.addChild(background);

  let tutorial = new Letter("tutorial");
  tutorial.color = "black";
  tutorial.px = 40;
  tutorial.y = 30;
  tutorial.show();

  let back = new Letter("back");
  back.color = "black";
  back.textAlign = "left";
  back.px = 15;
  back.show(function(){
    back.on(Event.TOUCH_START, function(){
      core.replaceScene(titleStart());
    });
  });

  let move = new Letter("move");
  move.color = "black";
  move.y = 120;
  move.show(function(){
    move.on(Event.TOUCH_START, function(){
      core.pushScene(tutorials.move());
    });
  });

  let attack = new Letter("attack");
  attack.color = "black";
  attack.y = 180;
  attack.show(function(){
    attack.on(Event.TOUCH_START, function(){
      core.pushScene(tutorials.attack());
    });
  });

  //選択言語が日本語だったら
  if(useLanguage == "ja"){
    tutorial.text = "チュートリアル";
    back.text = "もどる";
    move.text = "移動方法";
    attack.text = "攻撃方法";
  }

  return scene;
}

//チュートリアルの内容の変数
tutorials = {
  move: function(){
    let scene = new Scene();

    ui = new Group();
    scene.addChild(ui);

    let background = new Sprite(320, 480);
    background.backgroundColor = "peru";
    ui.addChild(background);

    let back = new Letter("back");
    back.color = "black";
    back.textAlign = "left";
    back.px = 15;
    back.show(function(){
      back.on(Event.TOUCH_START, function(){
        core.popScene();
      });
    });

    operable = false;

    let touchX = 200;
    let touchY = 150;

    let messageBox = new MessageBox();
    ui.addChild(messageBox);
    messageBox.message =
    "・move\n" +
    "When you touch the screen, the player moves towards it.\n" +
    "Avoid enemy attacks by moving well!";

    demo();

    //選択言語が日本語だったら
    if(useLanguage == "ja"){
      back.text = "もどる";
      messageBox.message =
        "・移動方法\n" +
        "画面をタッチすると、そこへ向かってプレイヤーは動きます\n" +
        "うまく移動して敵の攻撃をよけましょう";
    }

    function demo(){
      player = new Player();
      player.y = 100;

      let me = new TextArrow(
        player.x + player.width / 2,
        player.y + player.height / 2,
        "me"
      );
      me.tl.delay(second(3));
      me.tl.then(function(){
        let touch = new TextArrow(
          touchX + player.width / 2,
          touchY + player.height / 2,
          "touch"
        );

        touch.tl.delay(second(3));
        touch.tl.then(function(){
          player.move({x: touchX, y: touchY});
        });
        touch.tl.delay(second(3));
        touch.tl.then(function(){
          me.remove();
          touch.remove();
          player.remove();
          demo();
        });
      })
    }

    return scene;
  },

  attack: function(){
    let scene = new Scene();

    scene.gameover = function(){
      lastAccess(scene, function(node){
        if(node.tag == "player" || node.tag == "enemy" || node.tag == "shot"){
          node.remove();
        }
      });
      scene.tl.delay(second(4));
      scene.tl.then(function(){
        demo();
      });
    }

    ui = new Group();
    scene.addChild(ui);

    let background = new Sprite(320, 480);
    background.backgroundColor = "peru";
    ui.addChild(background);

    let back = new Letter("back");
    back.color = "black";
    back.textAlign = "left";
    back.px = 15;
    back.show(function(){
      back.on(Event.TOUCH_START, function(){
        core.popScene();
      });
    });

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

    blocks = new Array();
    for(let y = 0; y < mapData.length; y++){
      for(let x = 0; x < mapData[y].length; x++){
        block = new Block(x, y);
        block.x += 32;
        block.y += 64;
        blocks.push(block);
        if(mapData[y][x] == 0){
          block.remove();
        }
      }
    }
    //跳ね返る地点の設定
    bounceLine = new Array(4);
    bounceLine[0] = blocks[getBlocksNum(0, 0)].y + 32;
    bounceLine[1] = blocks[getBlocksNum(0, 0)].x + 32;
    bounceLine[2] = blocks[getBlocksNum(0, mapData[0].length - 1)].x;
    bounceLine[3] = blocks[getBlocksNum(mapData.length - 1, mapData[0].length - 1)].y;

    let messageBox = new MessageBox();
    ui.addChild(messageBox);
    messageBox.message =
      "・attack\n" +
      "By hitting the bounced ball against the enemy, you can damage the enemy.\n" +
      "Let's dodge a lot!";

      demo();

    //選択言語が日本語なら
    if(useLanguage == "ja"){
      back.text = "もどる";
      messageBox.message =
        "・攻撃方法\n" +
        "一度跳ね返った弾を敵に当てることでダメージを与えられます\n" +
        "うまくよけて敵に攻撃しましょう";
    }

    function demo(){
      player = new Player();
      player.x = 150;
      player.y = 200;

      player.moveable = true;
      player.move({x: 200, y: 200});

      let enemy = new Enemy1();
      enemy.x = 200;
      enemy.y = 120;
      enemy.shot();
      enemy.on('KILLED', function(){
        scene.gameover();
      });
    }

    return scene;
  }
};


//==========
//EnchantJS
enchant();
let gameManager;
gameManager = new common.GameManager();
window.onload = function() {
  core = gameManager.createCore(320, 480);
  core.fps = 50;
  core.onload = function(){
    core.resume();
    core.replaceScene(titleStart());
  };
  core.start();
  core.pause();
};
