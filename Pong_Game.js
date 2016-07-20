//BEGIN LIBRARY CODE
//Define Variables and give themvalues
var x = 25;
var y = 250;
var dx = 1.5;
var dy = -4;
var WIDTH;
var HEIGHT;
var ctx;
//for paddle
var paddlex;
var paddleh = 10;
var paddlew = 75;
//intervalID didnt work, lets rename to gameStop!
var intervalId= 0;

//I don't know what this does
var canvasMinX = 0;
var canvasMaxX = 0;

//For Bricks
var bricks;
var NROWS = 5;
var NCOLS = 5;
var BRICKWIDTH;
var BRICKHEIGHT = 15;
var PADDING = 1;

//This makes is so that when not pushing buttons, the paddle wont move
var rightDown = false;
var leftDown = false;

//Defining Style Variables

var ballr = 10;
var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
var paddlecolor = "#FFFFFF";
var ballcolor = "#FFFFFF";
var backcolor = "#000000";


//This listens for the left key or right key to be pushed down and sets it as a workable variable 
function onKeyDown(evt){
	if (evt.keyCode == 39) rightDown= true;
	else if (evt.keyCode ==37) leftDown = true;
}
//This cancels the rightDown and leftDown when the key is released
function onKeyUp(evt){
	if (evt.keyCode == 39) rightDown = false;
	else if (evt.keyCode == 37) leftDown=false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);


//Draw on Canvas and make height and width as variables for if statements Also sets the animation speed every 10 ms
function startAction() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();
  paddlex = WIDTH / 2;
  BRICKWIDTH = (WIDTH/NCOLS) - 1;
  canvasMinX = $("#canvas").offset() .left;
  canvasMaxX = canvasMinX + WIDTH;
  intervalId = setInterval(draw, 10);
}
//Draw the ball
function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}
//for animation
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

//Sets the values for the draw function to make the paddle
function startActionPaddle() {
  paddlex = WIDTH / 2;
  paddleh = 10;
  paddlew = 75;
}

function actionMouse(){
	canvasMinX = $("#canvas") .offset().left;
	canvasMaxX = canvasMinX + WIDTH;
}

function onMouseMove (evt){
	if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX){
		paddlex = evt.pageX - canvasMinX - (paddlew/2);
	}
}

$(document).mousemove(onMouseMove);


function startActionBricks(){
	bricks = new Array (NROWS);
	for (i=0; i < NROWS; i++) {
		bricks[i] = new Array (NCOLS);
		for (j=0; j < NCOLS; j++){
			bricks[i][j] = 1;
		}
	}
}

//END LIBRARY CODE



function draw() {
	ctx.fillStyle = backcolor;
  clear();
  ctx.fillStyle = ballcolor;
  circle(x, y, ballr);

  if (rightDown) paddlex += 5;
  else if (leftDown) paddlex -= 5;
  rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);

  //draw bricks
  for (i=0; i < NROWS; i++) {
    for (j=0; j < NCOLS; j++) {
      if (bricks[i][j] == 1) {
        rect((j * (BRICKWIDTH + PADDING)) + PADDING, 
             (i * (BRICKHEIGHT + PADDING)) + PADDING,
             BRICKWIDTH, BRICKHEIGHT);
      }
    }
  }

  //have we hit a brick?
  rowheight = BRICKHEIGHT + PADDING;
  colwidth = BRICKWIDTH + PADDING;
  row = Math.floor(y/rowheight);
  col = Math.floor(x/colwidth);
  //reverse the ball and mark the brick as broken
  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy;
    bricks[row][col] = 0;
  }
 
  if (x + dx + ballr > WIDTH || x + dx - ballr < 0)
    dx = -dx;

  if (y + dy - ballr < 0)
    dy = -dy;
  else if (y + dy + ballr > HEIGHT - paddleh) {
    if (x > paddlex && x < paddlex + paddlew) {
      //move the ball differently based on where it hit the paddle
      dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
      dy = -dy;
    }
    else if (y + dy + ballr > HEIGHT)
      clearInterval(intervalId);
  }
 
  x += dx;
  y += dy;
}

startAction();
startActionBricks();
