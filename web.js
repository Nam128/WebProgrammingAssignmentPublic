const startButton = document.getElementById("start");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let rightPressed = false;
let leftPressed = false;

let itemSecond = 400; // 본드와 신발 아이템 지속시간. 정확한 수치는 모르지만 계속 대입해보고 수정해가면 보완 가능.

let brick = {
    img : new Image,
    imgList : [],
    imgAmount : 1,
    rowCount : 9,  // row column 바뀜
    columnCount : 3,
    width : 40,
    height : 30,
    padding : 10,
    offsetTop : 30,
    offsetLeft : 30,
    choose : function() {
        for (var i=0; i<this.imgAmount; i++) {
            this.imgList[i] = "img/monster" + i + ".png";
        }
        this.img.src = this.imgList[0];
    }
}
let ball = {
    img : new Image,
    imgList : [],
    imgAmount : 13,
    radius : 11,
    x : canvas.width/2,
    y : canvas.height-50,
    dx : 0.8,
    dy : -0.8,
    choose : function() {
        for (var i=0; i<this.imgAmount; i++) {
            this.imgList[i] = "img/bomb" + i + ".png";
        }
        // this.img.src = "img/startButton.png";
        this.img.src = this.imgList[5];
    }
}
let paddle = {
    height : 40,
    width : 45,
    X : 0, // (canvas.width-paddle.width)/2,
    Y : canvas.height-this.height,
    img : new Image,
    imgList : [],
    imgAmount : 1,
    choose : function() {
        for (var i=0; i<this.imgAmount; i++) {
            this.imgList[i] = "img/character" + i + ".png";
        }
        this.img.src = this.imgList[0];
    },
    dx : 5
}
let item = {
    columnCount: brick.columnCount,
    rowCount: brick.rowCount,
    width: 40,
    height: 30,
    img: new Image(this.width, this.height),
    imgList: [null, "img/shield.png", "img/bond.png","img/shoes.png"], // 1 2 3
    offsetLeft: brick.offsetLeft,
    offsetTop: brick.offsetTop,
    padding: 10,
    dy : 1
}
let score = 0;
let lives = 3; // 라이프
let shield = {
    x : 1,
    y : 300,
    height : 20,
    width: canvas.width,
    img : new Image,
    status : 0,
    choose : function() {
        this.img.src = "img/shield-line.png";
    }
}
let bond = {
    status : 0,
    second : 0
}
let shoes = {
    status : 0,
    second : 0
}

document.addEventListener("keydown", keyDownHandler, false); // keydown 이벤트가 발생하면, keyDownHandler 실행
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
startButton.addEventListener("click", draw, false); // '시작' 누르면 draw 실행

function keyDownHandler(e) {
    if (e.keyCode == 39) { // 아스키 코드가 아니라 키 코드. 키 코드 39는 오른쪽.
        rightPressed = true;
    } else if (e.keyCode == 37) { // 키 코드 37은 왼쪽.
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.X = relativeX - paddle.width/2;
    }
}

var bricks = []; // 블록
for(let c=0; c<brick.columnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brick.rowCount; r++)
        bricks[c][r] = { x: 0, y: 0, status: 1 };
}
var items = []; // 각 블록에 아이템 생성
for(let c=0; c<item.columnCount; c++) {
    items[c] = [];
    for(let r=0; r<item.rowCount; r++)
        items[c][r] = {
            x: (r * (item.width + item.padding)) + item.offsetLeft,
            y: (c * (item.height + item.padding)) + item.offsetTop,
            status: 0,
            itemNum: getRandomInt(1,5), img: new Image }; // 1 쉴드 2 본드 3 신발 4 없음
}
function getRandomInt(min, max) { // 두 값 사이의 정수 난수 생성
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function collisionDetection() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            let b = bricks[c][r];
            let i = items[c][r];
            if(b.status) { // 아직 닿지 않은 블록
                if(CanvasCircleColliding(b, brick)) { // 블럭과 벽이 충돌된다면,
                    // if(b.x < x && x < b.x+brick.width && b.y < y && y < b.y+brick.height) {
                        // if(!((x+ballRadius<=b.x&&(b.y<=y||y<=b.y+brick.height))||(y+ballRadius<=b.y&&(b.x<=x||x<=b.x+brick.width))||(x-ballRadius>=b.x&&(b.y<=y||y<=b.y+brick.height))||(y-ballRadius>=b.y+brick.height&&(b.x<=x||x<=b.x+brick.width)))) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    i.status = 1;
                    score++;
                    switch(i.itemNum) {
                        case 1:
                            i.img.src = item.imgList[1];
                            break;
                        case 2:
                            i.img.src = item.imgList[2];
                            break;
                        case 3:
                            i.img.src = item.imgList[3];
                            break;
                    }
                        if(score == brick.rowCount*brick.columnCount) {
                            alert("You win! Congratulations!");
                            document.location.reload();
                    }
                }
            }
        }
    }
}
function CanvasCircleColliding(rect, rectLength){ // 사각형과 원의 충돌 감지 알고리즘
    var distX = Math.abs(ball.x - rect.x-rectLength.width/2);
    var distY = Math.abs(ball.y - rect.y-rectLength.height/2);

    if (distX > (rectLength.width/2 + ball.radius)) { return false; }
    if (distY > (rectLength.height/2 + ball.radius)) { return false; }

    if (distX <= (rectLength.width/2)) { return true; }
    if (distY <= (rectLength.height/2)) { return true; }

    var dx=distX-rectLength.width/2;
    var dy=distY-rectLength.height/2;
    return (dx*dx+dy*dy<=(ball.radius*ball.radius));
}

// draw
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawBall() { // 공 그림
    ctx.beginPath();
    ctx.drawImage(ball.img, ball.x-ball.radius, ball.y-ball.radius, 2*ball.radius, 2*ball.radius);
    ctx.closePath();
}
function drawPaddle() { // 페들 그림
    ctx.beginPath();
    ctx.drawImage(paddle.img, paddle.X, canvas.height-paddle.height, paddle.width, paddle.height);
    ctx.closePath();
}
function drawBricks() {
    for(let c=0; c<brick.columnCount; c++) {
        for(let r=0; r<brick.rowCount; r++) {
            if(bricks[c][r].status) { // 블록이 공에 닿지 않았을 때
                let brickX = (r * (brick.width + brick.padding)) + brick.offsetLeft;
                let brickY = (c * (brick.height + brick.padding)) + brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.drawImage(brick.img, brickX, brickY, brick.width, brick.height);
                ctx.closePath();
            }
        }
    }
}
function drawItems() {
    for(let c=0; c<item.columnCount; c++) {
        for(let r=0; r<item.rowCount; r++) {
            if(items[c][r].status) {
                ctx.beginPath();
                ctx.drawImage(items[c][r].img, items[c][r].x, items[c][r].y, item.width, item.height);
                ctx.closePath();
            }
        }
    }
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
function drawShield() {
    if(shield.status) {
        ctx.beginPath();
        ctx.drawImage(shield.img, shield.x, shield.y, shield.width, shield.height);
        ctx.closePath();
    }
}

function draw() { // 모든 draw 함수 실행 및 움직임 구현
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 프레임을 지워줌
    document.getElementById("h1").innerHTML = "배찌 속도: "+paddle.dx;
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    drawShield();
    drawItems();


    for(let c=0; c<item.columnCount; c++) {
        for(let r=0; r<item.rowCount; r++) {
            if(items[c][r].status) {
                if(items[c][r].y<=canvas.height-paddle.height) { // 왜 paddle.Y로는 안 됐을까? 이 조건 없앨까, 말까? (없애면 쭉 떨어짐. 있으면 바닥에서 멈춤.)
                    items[c][r].y += item.dy;
                }
                if((items[c][r].y>=canvas.height-paddle.height)&&(items[c][r].x<=paddle.X&&paddle.X<=items[c][r].x+item.width||items[c][r].x<=paddle.X+paddle.width&&paddle.X+paddle.width<=items[c][r].x+item.width)) { // 아이템 먹기
                    items[c][r].status = 0;
                    switch (items[c][r].itemNum) {
                        case 1: // 쉴드
                            shield.status = 1;
                            break;
                        case 2: // 본드
                            bond.second=0;
                            paddle.dx=5;
                            paddle.dx/=1.2;
                            bond.status = 1;
                            break;
                        case 3: // 신발
                            shoes.second=0;
                            paddle.dx=5;
                            paddle.dx*=1.2;
                            shoes.status = 1;
                            break;

                    }

                }
            }
        }
    }

    bond.second++;
    shoes.second++;
    if (bond.second==itemSecond&&bond.status) {
        paddle.dx = 5;
        bond.second = 0;
        bond.status = 0;
    }
    if (shoes.second==itemSecond&&shoes.status) {
        paddle.dx = 5;
        shoes.second=0;
        shoes.status = 0;
    }

    // 벽에 튕기기 및 페달 튕기기 및 죽었을 때 라이프 차감 및 게임 오버 구현 + 쉴드 구현
    if (ball.x + ball.dx > canvas.width-ball.radius || ball.x + ball.dx < ball.radius) { // canvas 좌우 튕기기
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) { // canvas 위 튕기기
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height-ball.radius*2) { // canvas 아래쪽에 공이 다가갈 때
        if (ball.x > paddle.X && ball.x<paddle.X + paddle.width) { // 페들에 닿으면 튕기기
            ball.dy = -ball.dy;
        }
        else if((!(ball.x > paddle.X && ball.x < paddle.X + paddle.width))&&!shield.status) { // 페들에 닿지 않으면 죽음
            lives--;
            if(lives) {
                ball.dx = 1;
                ball.dy = -1;
                ball.x = canvas.width/2;
                ball.y = canvas.height-50;
                paddle.X = (canvas.width-paddle.width)/2;
            }
            else {
                alert("GAME OVER"); // 게임오버이면 재도전 버튼을 넣을까?
                document.location.reload();
            }
        }
        else {
            ball.dy = -ball.dy;
            shield.status = 0;
        }
    }

    // 페달(캐릭터) 움직임
    if (rightPressed && paddle.X < canvas.width-paddle.width) {
        paddle.X += paddle.dx;
    } else if (leftPressed && paddle.X > 0) {
        paddle.X -= paddle.dx;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // 아이템 움직임

    
    // 아이템 먹기
    /*for(let c=0; c<item.columnCount; c++) {
        for(let r=0; r<item.rowCount; r++) {
            if(items[c][r].status) { // 블록이 공에 닿았을 때
                if (items[c][r].y>=paddle.Y)
                    break;
                items[c][r].y++;
            }
        }
    }*/
    /*
    ctx.beginPath();
    this.img.src = this.imgList[1];
    for (; itemY>canvas.height - paddleHeight; itemY--) {
        ctx.drawImage(this.img, itemX, itemY, this.width, this.height);
    }
    itemX--;
    itemY--;
    ctx.closePath();
*/

    // setInterval() 대신 사용
    requestAnimationFrame(draw);
}

ball.choose();
paddle.choose();
brick.choose();
shield.choose();