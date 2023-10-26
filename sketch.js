var trex, trexRunning, trexCollided;
var edges;
var solo, imageSolo;
var SoloInvisivel;
var clouds, imageClouds, cloudsGp;
var cactos, imageCacto1, imageCacto2, imageCacto3, imageCacto4, imageCacto5, imageCacto6, cactosGp;
var score = 0;
var play = 1;
var end = 0;
var gameState = play;
var records = 0;
var gameOver, gameOverImg
var restart, restartImg
var jumpSound, dieSound, pointSound;


//preload carrega as midías
function preload() {
  //animação do Trex
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadAnimation("trex_collided.png");

  //imagem do solo
  imageSolo = loadImage("ground2.png");

  // imagem nuvens
  imageClouds = loadImage("cloud.png");
  imageCacto1 = loadImage("obstacle1.png");
  imageCacto2 = loadImage("obstacle2.png");
  imageCacto3 = loadImage("obstacle3.png");
  imageCacto4 = loadImage("obstacle4.png");
  imageCacto5 = loadImage("obstacle5.png");
  imageCacto6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  pointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");


}
//setup faz aconfiguração
function setup() {


  createCanvas(windowWidth,windowHeight)
  // criando as bordas
  edges = createEdgeSprites();

  //crie um sprite de trex
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collided", trexCollided);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 30)


  //sprite do solo
  solo = createSprite(width/2, height-30, width, 2);
  solo.addImage("solo", imageSolo);

  //criando o solo invisivel
  SoloInvisivel = createSprite(width/2, height-30, width, 2);
  SoloInvisivel.visible = false;

  //criando grupos de nuvem e cactos
  cloudsGp = new Group();
  cactosGp = new Group();

  gameOver = createSprite(width/2, height-120, width, 10);
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5;
  // deixando invisivel
  gameOver.visible = false;
  //criando o sprite do restart e deixando ele invisivel.
  restart = createSprite(width/2, height-90, width, 10);
  restart.addImage(restartImg);
  restart.scale = 0.06;
  restart.visible = false;

}
//draw faz o movimento, a ação do jogo
function draw() {
  background("#f0f9f7");

  // vendo se trex ta colidindo com cacto
  if (trex.isTouching(cactosGp)) {
    gameState = end;
    //dieSound.play();


  }

  //game state: estados do jogo
  if (gameState == play) {
    score += Math.round(getFrameRate() / 60);
    if (score > 0 && score % 100 == 0) {
      pointSound.play()

    }
    // fazero trex pular
    if (touches.length>0||keyDown("space") && trex.y > height-50) {
      trex.velocityY = -10;
      touches=[]
      jumpSound.play()
      // dando velocidade ao solo
    }
    solo.velocityX = -(15 + score / 100);
    //conferindo a rolagem do solo
    if (solo.x < 800) {
      solo.x = solo.width / 2;
    }
    createClouds();
    createCactos();
  }

  if (gameState == end) {
    trex.changeAnimation("collided", trexCollided);
    solo.velocityX = 0;
    cloudsGp.setVelocityXEach(0);
    cactosGp.setVelocityXEach(0);
    gameOver.visible = true;
    restart.visible = true;
    cactosGp.setLifetimeEach(-1)
    cloudsGp.setLifetimeEach(-1)

    if (records < score) {
      records = score

    }

    if (mousePressedOver(restart)) {
      gameState = play
      gameOver.visible = false
      restart.visible = false
      cactosGp.destroyEach()
      cloudsGp.destroyEach()
      trex.changeAnimation("running")
      score = 0

    }
  }

  //texto para vida
  fill("orange");
  stroke("red");
  textAlign(CENTER, TOP);
  textSize(18);
  text("Score " + score, width-150, height-180);
  text("Record " + records, width-150, height-165);

  // chamando a  função de gravidade
  gravity();

  //colisão do trex com as bordas
  trex.collide(SoloInvisivel);
  //console.log(trex.Y);

  //coordenadas do mouse na tela
  //text("X: " + mouseX + "/ Y: " + mouseY, mouseX, mouseY);
  drawSprites();

}

// função de gravidade
function gravity() {
  trex.velocityY += 0.5;
}
//funç~~ao de criar as nuvens
function createClouds() {
  if (frameCount % 40 == 0) {
    clouds = createSprite(width, random(height-186,height-100), 40, 10);
    clouds.velocityX = -(15 + score / 100);
    clouds.addImage(imageClouds);
    clouds.scale = random(0.3, 1.4);
    clouds.depth = trex.depth - 1;
    clouds.lifetime = 210;
    cloudsGp.add(clouds);
  }
}

//função de criar os cactos
function createCactos() {
  if (frameCount % 50 == 0) {
    cactos = createSprite(width, height-30,10, 50);
    cactos.velocityX = -(15 + score / 100);
    cactos.scale = 0.5;
    cactos.lifetime = 210;
    cactosGp.add(cactos);
    cactos.depth = trex.depth;

    var sorteioCactos = Math.round(random(1, 6));
    switch (sorteioCactos) {
      case 1: cactos.addImage(imageCacto1);
        break;
      case 2: cactos.addImage(imageCacto2);
        break;
      case 3: cactos.addImage(imageCacto3);
        break;
      case 4: cactos.addImage(imageCacto4);
        break;
      case 5: cactos.addImage(imageCacto5);
        break;
      case 6: cactos.addImage(imageCacto6);
        break;
    }

  }
}
