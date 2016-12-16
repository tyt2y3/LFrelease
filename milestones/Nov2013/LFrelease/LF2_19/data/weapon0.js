define({
  bmp: {
    file: [
      {
        "file(0-99)": "sprite/weapon0.png", w: 48, h: 48, row: 10, col: 10
      }
    ],
    weapon_hp: 200,
    weapon_drop_hurt: 35,
    weapon_hit_sound: "sound/011.ogg",
    weapon_drop_sound: "sound/011.ogg",
    weapon_broken_sound: "sound/094.ogg"
  },
  weapon_strength_list: {
    1: {
      entry: "normal", dvx: 2, fall: 40, vrest: 10, bdefend: 16, injury: 40
    },
    2: {
      entry: "jump", dvx: 7, fall: 70, vrest: 10, bdefend: 16, injury: 40
    },
    3: {
      entry: "run", dvx: 10, fall: 70, vrest: 10, bdefend: 16, injury: 50
    },
    4: {
      entry: "dash", dvx: 12, fall: 70, vrest: 20, bdefend: 60, injury: 50
    }
  },
  frame: {
  0: { name: "in_the_sky",
    pic: 0, state: 1000, wait: 0, next: 1, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  1: { name: "in_the_sky",
    pic: 1, state: 1000, wait: 0, next: 2, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  2: { name: "in_the_sky",
    pic: 2, state: 1000, wait: 0, next: 3, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  3: { name: "in_the_sky",
    pic: 3, state: 1000, wait: 0, next: 4, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  4: { name: "in_the_sky",
    pic: 4, state: 1000, wait: 0, next: 5, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  5: { name: "in_the_sky",
    pic: 5, state: 1000, wait: 0, next: 6, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  6: { name: "in_the_sky",
    pic: 6, state: 1000, wait: 0, next: 7, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  7: { name: "in_the_sky",
    pic: 7, state: 1000, wait: 0, next: 8, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  8: { name: "in_the_sky",
    pic: 8, state: 1000, wait: 0, next: 9, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  9: { name: "in_the_sky",
    pic: 9, state: 1000, wait: 0, next: 10, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  10: { name: "in_the_sky",
    pic: 10, state: 1000, wait: 0, next: 11, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  11: { name: "in_the_sky",
    pic: 11, state: 1000, wait: 0, next: 12, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  12: { name: "in_the_sky",
    pic: 12, state: 1000, wait: 0, next: 13, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  13: { name: "in_the_sky",
    pic: 13, state: 1000, wait: 0, next: 14, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  14: { name: "in_the_sky",
    pic: 14, state: 1000, wait: 0, next: 15, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  15: { name: "in_the_sky",
    pic: 15, state: 1000, wait: 0, next: 999, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  20: { name: "on_hand",
    pic: 20, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 24, y: 40, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: {
      kind: 5, x: 18, y: 4, w: 12, h: 50, fall: 20, bdefend: 16, injury: 789
    }
  },
  21: { name: "on_hand",
    pic: 21, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 17, y: 41, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 23, y: 2, w: 13, h: 23, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 12, y: 26, w: 13, h: 26, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  22: { name: "on_hand",
    pic: 22, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 12, y: 37, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: -6, y: 36, w: 21, h: 19, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 28, y: 5, w: 14, h: 19, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 10, y: 18, w: 21, h: 22, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  23: { name: "on_hand",
    pic: 23, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 9, y: 33, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 33, y: 15, w: 13, h: 11, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 5, y: 24, w: 25, h: 11, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: -18, y: 33, w: 31, h: 10, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  24: { name: "on_hand",
    pic: 24, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 10, y: 29, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: {
      kind: 5, x: -23, y: 23, w: 70, h: 12, dvx: 8, fall: 20, bdefend: 16, injury: 789
    }
  },
  25: { name: "on_hand",
    pic: 25, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 12, y: 23, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: -14, y: 13, w: 38, h: 17, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 22, y: 25, w: 23, h: 16, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  26: { name: "on_hand",
    pic: 26, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 14, y: 15, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 26, y: 27, w: 16, h: 16, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: -3, y: -1, w: 24, h: 24, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 17, y: 20, w: 16, h: 13, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  27: { name: "on_hand",
    pic: 27, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 17, y: 13, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 7, y: 3, w: 16, h: 22, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 19, y: 22, w: 15, h: 23, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  28: { name: "on_hand",
    pic: 28, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 24, y: 11, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: {
      kind: 5, x: 18, y: 2, w: 14, h: 45, dvx: 8, fall: 20, bdefend: 16, injury: 789
    }
  },
  29: { name: "on_hand",
    pic: 29, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 29, y: 13, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 24, y: -1, w: 11, h: 28, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 11, y: 25, w: 16, h: 22, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  30: { name: "on_hand",
    pic: 30, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 36, y: 16, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: -2, y: 34, w: 24, h: 14, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 34, y: -1, w: 23, h: 16, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 18, y: 14, w: 20, h: 20, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  31: { name: "on_hand",
    pic: 31, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 37, y: 19, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 28, y: 10, w: 32, h: 12, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: -4, y: 21, w: 39, h: 16, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  32: { name: "on_hand",
    pic: 32, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 37, y: 26, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: {
      kind: 5, x: -2, y: 23, w: 66, h: 8
    }
  },
  33: { name: "on_hand",
    pic: 33, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 38, y: 33, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 3, y: 15, w: 22, h: 16, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 25, y: 27, w: 39, h: 15, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  34: { name: "on_hand",
    pic: 34, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 34, y: 36, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 32, y: 34, w: 20, h: 18, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 5, y: 5, w: 17, h: 19, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 15, y: 19, w: 20, h: 18, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  35: { name: "on_hand",
    pic: 35, state: 1001, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    wpoint: {
      kind: 2, x: 29, y: 40, weaponact: 0, attacking: 0, cover: 0, dvx: 0, dvy: 0, dvz: 0
    },
    itr: [
      {
        kind: 5, x: 9, y: 1, w: 14, h: 22, dvx: 8, fall: 20, bdefend: 16, injury: 789
      },
      {
        kind: 5, x: 19, y: 20, w: 18, h: 32, dvx: 8, fall: 20, bdefend: 16, injury: 789
      }
    ]
  },
  40: { name: "throwing",
    pic: 0, state: 1002, wait: 0, next: 41, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 85
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  41: { name: "throwing",
    pic: 1, state: 1002, wait: 0, next: 42, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  42: { name: "throwing",
    pic: 2, state: 1002, wait: 0, next: 43, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  43: { name: "throwing",
    pic: 3, state: 1002, wait: 0, next: 44, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  44: { name: "throwing",
    pic: 4, state: 1002, wait: 0, next: 45, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  45: { name: "throwing",
    pic: 5, state: 1002, wait: 0, next: 46, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  46: { name: "throwing",
    pic: 6, state: 1002, wait: 0, next: 47, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  47: { name: "throwing",
    pic: 7, state: 1002, wait: 0, next: 48, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  48: { name: "throwing",
    pic: 8, state: 1002, wait: 0, next: 49, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  49: { name: "throwing",
    pic: 9, state: 1002, wait: 0, next: 50, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  50: { name: "throwing",
    pic: 10, state: 1002, wait: 0, next: 51, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  51: { name: "throwing",
    pic: 11, state: 1002, wait: 0, next: 52, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  52: { name: "throwing",
    pic: 12, state: 1002, wait: 0, next: 53, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  53: { name: "throwing",
    pic: 13, state: 1002, wait: 0, next: 54, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  54: { name: "throwing",
    pic: 14, state: 1002, wait: 0, next: 55, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  55: { name: "throwing",
    pic: 15, state: 1002, wait: 0, next: 40, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 3, y: 4, w: 40, h: 39, dvx: 8, fall: 70, bdefend: 16, injury: 50
    },
    bdy: {
      kind: 0, x: 3, y: 4, w: 40, h: 39
    }
  },
  60: { name: "on_ground",
    pic: 2, state: 1003, wait: 1, next: 61, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0, sound: "sound/011.ogg"
  },
  61: { name: "on_ground",
    pic: 5, state: 1003, wait: 2, next: 62, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 36, hit_a: 0, hit_d: 0, hit_j: 0
  },
  62: { name: "on_ground",
    pic: 3, state: 1003, wait: 2, next: 63, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 34, hit_a: 0, hit_d: 0, hit_j: 0, sound: "sound/011.ogg"
  },
  63: { name: "on_ground",
    pic: 5, state: 1003, wait: 1, next: 64, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 35, hit_a: 0, hit_d: 0, hit_j: 0
  },
  64: { name: "on_ground",
    pic: 4, state: 1004, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 29, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 1, y: 19, w: 46, h: 15
    }
  },
  70: { name: "just_on_ground",
    pic: 2, state: 1003, wait: 1, next: 71, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 40, hit_a: 0, hit_d: 0, hit_j: 0, sound: "sound/011.ogg",
    itr: {
      kind: 0, x: 1, y: 19, w: 46, h: 15, dvx: 2, fall: 40, arest: 16, bdefend: 16
    }
  },
  71: { name: "just_on_on_ground",
    pic: 5, state: 1003, wait: 2, next: 72, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 36, hit_a: 0, hit_d: 0, hit_j: 0,
    itr: {
      kind: 0, x: 1, y: 19, w: 46, h: 15, dvx: 2, fall: 40, arest: 16, bdefend: 16
    }
  },
  72: { name: "just_on_on_ground",
    pic: 3, state: 1003, wait: 2, next: 64, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 34, hit_a: 0, hit_d: 0, hit_j: 0, sound: "sound/011.ogg",
    itr: {
      kind: 0, x: 1, y: 19, w: 46, h: 15, dvx: 2, fall: 40, arest: 16, bdefend: 16
    }
  },
  399: { name: "dummy",
    pic: 4, state: 0, wait: 0, next: 0, dvx: 0, dvy: 0, dvz: 0, centerx: 24, centery: 29, hit_a: 0, hit_d: 0, hit_j: 0,
    bdy: {
      kind: 0, x: 1, y: 19, w: 46, h: 15
    }
  }
  }
});
