var ball;
var p1;
var p2;
var gen;
var totalScore;
function setup() {
  createCanvas(400, 400);
  totalScore = 0;
  gen = 1
	ball = {
		x:200,
		y:200,
		xs:3,
		ys:3,
		s:10,
	}
	p1 = {
		x:100,
		y:0,
		l:100,
    score:0,
    colour:[255,255,255],
    net:new Net(ball)
	}
  p2 = {
  	x:300,
    y:0,
    l:100,
    score:0,
    colour:[255,255,255],
    net:new Net(ball)
  }
	noStroke()
}

function draw() {
  background("black");
  fill("white")
	ellipse(ball.x,ball.y,ball.s,ball.s);
	ball.x+=ball.xs;
	ball.y+=ball.ys;
  
  text("generation:"+gen,150,50)
  
	//p1.y=mouseY-p1.l/2;//moving the paddle to the mouse
  
  p1.net.think()
  p1.net.move(p1)
  p1.net.update(ball,p1)
  
  p2.net.think()
  p2.net.move(p2)
  p2.net.update(ball,p2)
  
  totalScore = p1.score + p2.score
  
  if (totalScore === 10 && p1.score > p2.score) {
    resetGame()
    gen += 1
    p2.net = p1.net
    p2.net.tweak()
    console.log(0)
  }
  else if (totalScore === 10 && p2.score > p1.score) {
    resetGame()
    gen += 1
    p1.net = p2.net
    p1.net.tweak()
    console.log(1)
  }
  else if (totalScore === 10) {
    resetGame()
    gen += 1
    p1.net.tweakNeuron(p1.net.ballx)
    p2.net.tweakNeuron(p2.net.ballx)
    console.log(p1.net.ballx.neuron.weight,p2.net.ballx.neuron.weight)
  }
  
  if (p1.y>400-p1.l) {
    p1.y = 400 - p1.l
  }
  if (p1.y<0) {
    p1.y = 0
  }
  if (p2.y>400-p2.l) {
    p2.y = 400 - p2.l
  }
  if (p2.y<0) {
    p2.y = 0
  }
  
  //console.log(p1.net.output,p2.net.output)
  
  //wall collision
	if(ball.x>400-(ball.s/2)) {
		ball.xs = -ball.xs
    ball.ys = random([ball.ys,-ball.ys])
    p1.score += 1
    ball.x = 200
    ball.y = 200
	}
  if (ball.x<0+(ball.s/2)) {
		ball.xs = -ball.xs
    ball.ys = random([ball.ys,-ball.ys])
    p2.score += 1
    ball.x = 200
    ball.y = 200
  }
	if(ball.y>400-(ball.s/2)||ball.y<0+(ball.s/2)) {
		ball.ys = -ball.ys
	}
  fill(p1.colour)
	rect(p1.x,p1.y,1,p1.l)
  fill(p2.colour)
  rect(p2.x,p2.y,1,p2.l)
  //paddle collision
	
  if(paddleCollision(ball.x,ball.y,ball.s,p1.x,p1.y,p1.l)){
  	ball.xs = 3
    //p1.colour=[random(0,255),random(0,255),random(0,255)]
  }
  if(paddleCollision(ball.x,ball.y,ball.s,p2.x,p2.y,p2.l)){
  	ball.xs = -3
    //p2.colour=[random(0,255),random(0,255),random(0,255)]
  }
  /*
  if(keyCode===38&&keyIsPressed&&p2.y>0){
  	p2.y-=5
  }
  if(keyCode===40&&keyIsPressed&&p2.y+p2.l<400){
  	p2.y+=5
  }*/
  //displays score
  fill("white")
  textSize(20)
  text("score:"+p1.score,10,20)
  text("score:"+p2.score,320,20)
}

function resetGame() {
  p1.y = 0
  p2.y = 0
  p1.score = 0
  p2.score = 0
}

function sigmoid(a) {
  return 1/(1+2^a)
}

function paddleCollision(bx,by,bs,px,py,pl){
  if(bx>px-(bs/2)&&by<py+pl+(bs/2)&&by>py-(bs/2)&&ball.x<px+(bs/2)) {
		return true
	}
}

function Neuron() {
  this.weight = random(-1,1)
  this.bias = random(-10,10)
}

function Net(a,d) {
  this.ballx = {value:a.x,
               neuron:new Neuron()}
  this.bally = {value:a.y,
                neuron:new Neuron()}
  this.ballxs = {value:a.xs,
                 neuron:new Neuron()}
  this.ballys = {value:a.ys,
                 neuron:new Neuron()}
  this.px = {value:1,
             neuron:new Neuron()}
  this.py = {value:1,
             neuron:new Neuron()}
  this.output = 0
  
/*
		this.randomise = function() {
    this.ballx.neuron = new Neuron()
    this.bally.neuron = new Neuron()
    this.ballxs.neuron = new Neuron()
    this.ballys.neuron = new Neuron()
    this.px.neuron = new Neuron()
    this.py.neuron = new Neuron()
  }
*/
  
  this.update = function(c,d) {
    this.ballx.value = sigmoid(c.x)
  	this.bally.value = sigmoid(c.y)
  	this.ballxs.value = sigmoid(c.xs)
  	this.ballys.value = sigmoid(c.ys)
    this.px.value = sigmoid(d.x)
    this.py.value = sigmoid(d.y)
  }
  this.think1 = function(b) {
    this.output += b.value * b.neuron.weight
    this.output -= b.neuron.bias
  }
  this.think = function() {
    this.output = 0
    this.think1(this.ballx)
    this.think1(this.bally)
    this.think1(this.ballxs)
    this.think1(this.ballys)
  }
  this.move = function(b) {
    b.y += sigmoid(this.output)*40
  }
  
  this.tweakNeuron = function(c) {
    c.neuron.weight += random(-1,1)
    c.neuron.bias += random(-10,10)
  }
  this.tweak = function() {
    this.tweakNeuron(this.ballx)
    this.tweakNeuron(this.bally)
    this.tweakNeuron(this.ballxs)
    this.tweakNeuron(this.ballys)
    this.tweakNeuron(this.px)
    this.tweakNeuron(this.py)
  }
}
