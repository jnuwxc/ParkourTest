import Subway from "./Subway";
enum Direction {up, down, left, right, pause};

export default class Test extends Laya.Script{
    /** @prop {name:bgimg,tips:"背景图片",type:Sprite}*/

    pxs: number = 3; //每帧移动多少像素
    // scanles: number = 0.01; //每帧缩放多少
    background: Laya.Sprite; //背景
    subwayImg: Laya.Sprite; //地铁图片
    // started: boolean = false; //游戏是否开始
    subway: Subway;
    moveI: number; //移动了几段路，视每转弯一次+1
    bgx: number; //背景的坐标
    bgy: number;
    score: number;//得分
    scoreText: Laya.Text;
    direction: Direction;//地铁前进方向
    roadWidth: number;//半个路宽

    constructor(){
        super();
    }

    onEnable(){
        console.log("Game Start!");
        this.score = 0;
        this.moveI = 0;
        this.scoreText = this.owner.getChildByName("scoreText") as Laya.Text;
        this.background = this.owner.getChildByName("bgimg") as Laya.Sprite;
        this.subwayImg = this.owner.getChildByName("subway") as Laya.Sprite;
        this.subway = new Subway(1);
        this.bgx = this.background.x;
        this.bgy = this.background.y;
        this.roadWidth = this.subway.getRoadWidth();
    }
    onUpdate(){
        this.scoreText.set_text(String(this.score++));
        // console.log(this.score + " x:" + this.bgx +" y:" + this.bgy);
        if(this.direction != Direction.pause){
            this.direction = this.subway.getDirection(this.moveI);
            this.move();
            this.isDied();
        }
    }
    onLateUpdate(){

    }

    onClick(){
        this.moveI++;
        console.log("用户第" + this.moveI + "次点击");
    }

    isDied(){
        //!在测试中，水平路和数值路是必然交替出现的
        //地图确定后肯定还要再修改（并不想）
        if(this.moveI == 0){
            let turnXY = this.subway.getTurnXY(1);
            if(this.bgy > turnXY[1] + this.roadWidth){
                this.stopGame();
            }
        }else if(this.moveI == this.subway.getTurnNum() - 1){
            let turnXY = this.subway.getTurnXY(this.subway.getTurnNum() - 1);
            if(this.bgx < turnXY[0] - this.roadWidth || this.bgx > turnXY[0] + this.roadWidth){
                this.stopGame();
            }
        }else{
            let turnXY = this.subway.getTurnXY(this.moveI);
            let turnXYPre = this.subway.getTurnXY(this.moveI - 1);
            let turnXYNext = this.subway.getTurnXY(this.moveI + 1);
            if(this.direction == Direction.up){
                if(this.isInH(turnXY[0], turnXYPre[0], turnXY[1]) || this.isInV(turnXYNext[0], turnXYNext[1])){

                }else{
                    this.stopGame();
                }
            }else{//现在为水平路径（左右）
                if(this.isInV(turnXY[0], turnXY[1]) || this.isInH(turnXY[0], turnXYNext[0], turnXY[1])){

                }else{
                    this.stopGame();
                }
            }
        }
    }

    stopGame(){
        this.direction = Direction.pause;
        let overText: Laya.Text = this.owner.getChildByName("overText") as Laya.Text;
        overText.set_visible(true);
        console.log("game over!");
    }

    move(){
        //注意：这里是移动的背景，而Direction是指地铁方向，二者相反。
        let speed = this.subway.getSpeed();
        switch(this.direction){
            case Direction.up:
                this.bgy += (speed * this.pxs);
                break;
            case Direction.left:
                this.bgx += (speed * this.pxs);
                break;
            case Direction.right:
                this.bgx -= (speed * this.pxs);
                break;
            default:
                console.log("move error");
                break;
        }
        this.background.pos(this.bgx, this.bgy);
        //逻辑bug，暂时搁置
        // //缩放是背景和地铁同时
        // let scale = this.subway.getScale(this.moveI);
        // if(scale != 1){
        //     //是否放大
        //     let isZoom = scale > 1 ? true : false;
        //     if(isZoom){
        //         scale -= this.scanles;
        //     }else{
        //         scale += this.scanles;
        //     }
        //     this.background.scale(scale, scale);
        //     this.subwayImg.scale(scale, scale);
        // }
    }

    //是否跑在水平路径上
    isInH(x1: number, x2: number, y: number){
        let xMax = x1;
        let xMin = x2;
        if(x1 < x2){
            xMax = x2;
            xMin = x1;
        }
        if(this.bgy < y - this.roadWidth || this.bgy > y + this.roadWidth 
            || this.bgx < xMin - this.roadWidth || this.bgx > xMax + this.roadWidth){
                return false;
            }
        return true;
    }
    //是否跑在垂直路径上
    //只需要上升路高点坐标，因为不可能低于低点y值
    isInV(x: number, y:number): boolean{
        if(this.bgx < x - this.roadWidth || this.bgx > x + this.roadWidth
            || this.bgy > y + this.roadWidth){
            return false;
        }
        return true;
    }
}