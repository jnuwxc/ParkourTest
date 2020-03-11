(function () {
    'use strict';

    var Direction;
    (function (Direction) {
        Direction[Direction["up"] = 0] = "up";
        Direction[Direction["down"] = 1] = "down";
        Direction[Direction["left"] = 2] = "left";
        Direction[Direction["right"] = 3] = "right";
        Direction[Direction["pause"] = 4] = "pause";
    })(Direction || (Direction = {}));
    ;
    class Metro {
        constructor(speed) {
            this.roadWidth = 60;
            this.directions = [Direction.up, Direction.left, Direction.up, Direction.right, Direction.up, Direction.left];
            this.scales = [1, 1, 0.7, 1, 1, 1];
            this.turnXY = [[-388, -473], [-388, -21], [40, -21], [40, 350], [-887, 350], [-887, 850]];
            this.speed = speed;
        }
        getTurnNum() {
            return this.turnXY.length;
        }
        getRoadWidth() {
            return this.roadWidth;
        }
        getTurnXY(i) {
            return this.turnXY[i];
        }
        getScale(i) {
            return this.scales[i];
        }
        getDirection(i) {
            return this.directions[i];
        }
        getSpeed() {
            return this.speed;
        }
        setSpedd(speed) {
            this.speed = speed;
        }
    }

    var Direction$1;
    (function (Direction) {
        Direction[Direction["up"] = 0] = "up";
        Direction[Direction["down"] = 1] = "down";
        Direction[Direction["left"] = 2] = "left";
        Direction[Direction["right"] = 3] = "right";
        Direction[Direction["pause"] = 4] = "pause";
    })(Direction$1 || (Direction$1 = {}));
    ;
    class Test extends Laya.Script {
        constructor() {
            super();
            this.pxs = 3;
        }
        onEnable() {
            console.log("Game Start!");
            this.score = 0;
            this.moveI = 0;
            this.scoreText = this.owner.getChildByName("scoreText");
            this.background = this.owner.getChildByName("bgimg");
            this.subwayImg = this.owner.getChildByName("subway");
            this.subway = new Metro(1);
            this.bgx = this.background.x;
            this.bgy = this.background.y;
            this.roadWidth = this.subway.getRoadWidth();
        }
        onUpdate() {
            this.scoreText.set_text(String(this.score++));
            if (this.direction != Direction$1.pause) {
                this.direction = this.subway.getDirection(this.moveI);
                this.move();
                this.isDied();
            }
        }
        onLateUpdate() {
        }
        onClick() {
            this.moveI++;
            console.log("用户第" + this.moveI + "次点击");
        }
        isDied() {
            if (this.moveI == 0) {
                let turnXY = this.subway.getTurnXY(1);
                if (this.bgy > turnXY[1] + this.roadWidth) {
                    this.stopGame();
                }
            }
            else if (this.moveI == this.subway.getTurnNum() - 1) {
                let turnXY = this.subway.getTurnXY(this.subway.getTurnNum() - 1);
                if (this.bgx < turnXY[0] - this.roadWidth || this.bgx > turnXY[0] + this.roadWidth) {
                    this.stopGame();
                }
            }
            else {
                let turnXY = this.subway.getTurnXY(this.moveI);
                let turnXYPre = this.subway.getTurnXY(this.moveI - 1);
                let turnXYNext = this.subway.getTurnXY(this.moveI + 1);
                if (this.direction == Direction$1.up) {
                    if (this.isInH(turnXY[0], turnXYPre[0], turnXY[1]) || this.isInV(turnXYNext[0], turnXYNext[1])) {
                    }
                    else {
                        this.stopGame();
                    }
                }
                else {
                    if (this.isInV(turnXY[0], turnXY[1]) || this.isInH(turnXY[0], turnXYNext[0], turnXY[1])) {
                    }
                    else {
                        this.stopGame();
                    }
                }
            }
        }
        stopGame() {
            this.direction = Direction$1.pause;
            let overText = this.owner.getChildByName("overText");
            overText.set_visible(true);
            console.log("game over!");
        }
        move() {
            let speed = this.subway.getSpeed();
            switch (this.direction) {
                case Direction$1.up:
                    this.bgy += (speed * this.pxs);
                    break;
                case Direction$1.left:
                    this.bgx += (speed * this.pxs);
                    break;
                case Direction$1.right:
                    this.bgx -= (speed * this.pxs);
                    break;
                default:
                    console.log("move error");
                    break;
            }
            this.background.pos(this.bgx, this.bgy);
        }
        isInH(x1, x2, y) {
            let xMax = x1;
            let xMin = x2;
            if (x1 < x2) {
                xMax = x2;
                xMin = x1;
            }
            if (this.bgy < y - this.roadWidth || this.bgy > y + this.roadWidth
                || this.bgx < xMin - this.roadWidth || this.bgx > xMax + this.roadWidth) {
                return false;
            }
            return true;
        }
        isInV(x, y) {
            if (this.bgx < x - this.roadWidth || this.bgx > x + this.roadWidth
                || this.bgy > y + this.roadWidth) {
                return false;
            }
            return true;
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/Test.ts", Test);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "parkour.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
