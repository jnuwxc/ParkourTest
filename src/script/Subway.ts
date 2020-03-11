enum Direction {up, down, left, right, pause};
export default class Metro{
    private speed: number;//地铁行驶速度

    private roadWidth:number = 60; //半个路宽，px

    //地铁方向，初始向上。暂时认为没有向下的路径
    //注意最后一个方向是左或右都可以，反正都得死。
    private directions: Direction[] = [Direction.up, Direction.left, Direction.up, Direction.right, Direction.up, Direction.left];

    //缩放，1代表不缩放，有Bug，暂时搁置
    private scales: number[] = [1, 1, 0.7, 1, 1, 1];

    //转弯点坐标
    private turnXY: number[][] = [[-388, -473], [-388, -21], [40, -21], [40, 350], [-887, 350], [-887, 850]];

    //构造函数，传入地铁的初始速度
    constructor(speed: number){
        this.speed = speed;
    }
    //返回拐点个数
    public getTurnNum(): number{
        return this.turnXY.length;
    }
    public getRoadWidth(): number{
        return this.roadWidth;
    }
    public getTurnXY(i: number): number[]{
        return this.turnXY[i];
    }
    public getScale(i: number): number{
        return this.scales[i];
    }
    public getDirection(i: number): Direction{
        return this.directions[i];
    }
    public getSpeed(): number{
        return this.speed;
    }
    public setSpedd(speed: number){
        this.speed = speed;
    }

}