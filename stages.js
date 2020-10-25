/**
 * 変数stagesの定義がされているファイル
 *
 * 各ステージにはどの種類の敵かを表すtype、どこの場所から登場させるかを表すplaceの
 *    2つのプロパティを持つオブジェクトが配列の形で格納されている
 * この変数を使ってステージに敵を配置していく
 */

/**
 * ステージの内容の変数
 * @type {Array}
 */
let stages = [
  //1
  [{
    type: enchant.Enemy1,
    place: 0
  }],
  //2
  [{
      type: enchant.Enemy1,
      place: 1
    },
    {
      type: enchant.Enemy1,
      place: 2
    }
  ],
  //3
  [{
      type: enchant.Enemy1,
      place: 0
    },
    {
      type: enchant.Enemy1,
      place: 1
    },
    {
      type: enchant.Enemy1,
      place: 2
    }
  ],
  //4
  [{
    type: enchant.Enemy2,
    place: 0
  }],
  //5
  [{
      type: enchant.Enemy2,
      place: 1
    },
    {
      type: enchant.Enemy2,
      place: 2
    }
  ],
  //6
  [{
    type: enchant.Enemy3,
    place: 0
  }, ],
  //7
  [{
      type: enchant.Enemy3,
      place: 1
    },
    {
      type: enchant.Enemy3,
      place: 2
    }
  ],
  //8
  [{
      type: enchant.Enemy3,
      place: 0
    },
    {
      type: enchant.Enemy3,
      place: 1
    },
    {
      type: enchant.Enemy3,
      place: 2
    }
  ],
  //9
  [{
    type: enchant.Enemy4,
    place: 0
  }],
  //10
  [{
      type: enchant.Enemy4,
      place: 1
    },
    {
      type: enchant.Enemy4,
      place: 2
    }
  ],
  //11
  [{
      type: enchant.Enemy4,
      place: 0
    },
    {
      type: enchant.Enemy4,
      place: 1
    },
    {
      type: enchant.Enemy4,
      place: 2
    }
  ],
  //12
  [{
      type: enchant.Enemy4,
      place: 0
    },
    {
      type: enchant.Enemy2,
      place: 1
    },
    {
      type: enchant.Enemy2,
      place: 2
    }
  ],
  //13
  [{
      type: enchant.Enemy4,
      place: 0
    },
    {
      type: enchant.Enemy3,
      place: 1
    },
    {
      type: enchant.Enemy3,
      place: 2
    }
  ],
  //14
  [{
    type: enchant.Enemy5,
    place: 0
  }],
  //15
  [{
      type: enchant.Enemy5,
      place: 1
    },
    {
      type: enchant.Enemy5,
      place: 2
    }
  ],
  //16
  [{
      type: enchant.Enemy5,
      place: 0
    },
    {
      type: enchant.Enemy3,
      place: 1
    },
    {
      type: enchant.Enemy3,
      place: 2
    }
  ],
  //17
  [{
      type: enchant.Enemy5,
      place: 0
    },
    {
      type: enchant.Enemy1,
      place: 1
    },
    {
      type: enchant.Enemy1,
      place: 2
    },
    {
      type: enchant.Enemy1,
      place: 3
    },
    {
      type: enchant.Enemy1,
      place: 4
    }
  ],
  //18
  [{
      type: enchant.Enemy1,
      place: 0
    },
    {
      type: enchant.Enemy2,
      place: 1
    },
    {
      type: enchant.Enemy2,
      place: 2
    },
    {
      type: enchant.Enemy1,
      place: 3
    },
    {
      type: enchant.Enemy1,
      place: 4
    }
  ],
  //19
  [{
      type: enchant.Enemy2,
      place: 0
    },
    {
      type: enchant.Enemy2,
      place: 1
    },
    {
      type: enchant.Enemy2,
      place: 2
    },
    {
      type: enchant.Enemy2,
      place: 3
    },
    {
      type: enchant.Enemy2,
      place: 4
    }
  ],
  //20
  [{
      type: enchant.Enemy2,
      place: 0
    },
    {
      type: enchant.Enemy4,
      place: 1
    },
    {
      type: enchant.Enemy4,
      place: 2
    },
    {
      type: enchant.Enemy2,
      place: 3
    },
    {
      type: enchant.Enemy2,
      place: 4
    }
  ],
  //21
  [{
      type: enchant.Enemy3,
      place: 0
    },
    {
      type: enchant.Enemy1,
      place: 1
    },
    {
      type: enchant.Enemy1,
      place: 2
    },
    {
      type: enchant.Enemy4,
      place: 3
    },
    {
      type: enchant.Enemy4,
      place: 4
    }
  ],
  //22
  [{
      type: enchant.Enemy5,
      place: 0
    },
    {
      type: enchant.Enemy2,
      place: 1
    },
    {
      type: enchant.Enemy2,
      place: 2
    },
    {
      type: enchant.Enemy5,
      place: 3
    },
    {
      type: enchant.Enemy5,
      place: 4
    }
  ],
  //23
  [{
      type: enchant.Enemy4,
      place: 0
    },
    {
      type: enchant.Enemy5,
      place: 1
    },
    {
      type: enchant.Enemy5,
      place: 2
    },
    {
      type: enchant.Enemy5,
      place: 3
    },
    {
      type: enchant.Enemy5,
      place: 4
    }
  ],
  //24
  [{
      type: enchant.Enemy5,
      place: 0
    },
    {
      type: enchant.Enemy5,
      place: 1
    },
    {
      type: enchant.Enemy5,
      place: 2
    },
    {
      type: enchant.Enemy5,
      place: 3
    },
    {
      type: enchant.Enemy5,
      place: 4
    }
  ],
  //25
  [{
      type: enchant.Enemy4,
      place: 0
    },
    {
      type: enchant.Enemy4,
      place: 1
    },
    {
      type: enchant.Enemy4,
      place: 2
    },
    {
      type: enchant.Enemy4,
      place: 3
    },
    {
      type: enchant.Enemy4,
      place: 4
    }
  ]
];
