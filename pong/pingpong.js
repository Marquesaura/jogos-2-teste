// Bolinha
let xBolinha = 300;
let yBolinha = 200;
let tamBolinha = 20;
let xvel = 5;
let yvel = 5;

// Raquete jogador 1
let xRaquete1 = 10;
let yRaquete1 = 150;
let largura = 10;
let altura = 90;

// Raquete jogador 2
let xRaquete2 = 580;
let yRaquete2 = 150;
let velOponente = 5;
let modo2jog = false;

// Placar
let pontos1 = 0;
let pontos2 = 0;
let maxPontos = 5;
let fim = false;

function setup() {
  createCanvas(600, 400);
  let btn = createButton('Reiniciar');
  btn.position(10, 410);
  btn.mousePressed(reiniciarJogo);
  let modo = createButton('Modo 2 Jogadores');
  modo.position(100, 410);
  modo.mousePressed(()=>{modo2jog = !modo2jog; reiniciarJogo();});
}

function draw() {
  background(0, 128, 0); // mesa verde
  textSize(32);
  fill(255);
  textAlign(CENTER, TOP);
  text(pontos1, width/4, 20);
  text(pontos2, 3*width/4, 20);

  if (fim) {
    fill('#fffbe9');
    rect(100, 100, 400, 200, 30);
    fill('#43a047');
    textSize(36);
    textAlign(CENTER, CENTER);
    text(pontos1 > pontos2 ? 'Jogador 1 venceu!' : 'Jogador 2 venceu!', width/2, height/2);
    noLoop();
    return;
  }

  // Bolinha
  circle(xBolinha, yBolinha, tamBolinha);
  xBolinha += xvel;
  yBolinha += yvel;

  // Rebote nas bordas
  if (yBolinha + tamBolinha / 2 > height || yBolinha - tamBolinha / 2 < 0) {
    yvel *= -1;
  }

  // Pontuação
  if (xBolinha + tamBolinha / 2 > width) {
    pontos1++;
    checarFim();
    resetarBolinha(-1);
  }
  if (xBolinha - tamBolinha / 2 < 0) {
    pontos2++;
    checarFim();
    resetarBolinha(1);
  }

  // Raquete jogador 1
  rect(xRaquete1, yRaquete1, largura, altura);
  if (keyIsDown(87)) yRaquete1 -= 6; // W
  if (keyIsDown(83)) yRaquete1 += 6; // S

  // Raquete jogador 2
  rect(xRaquete2, yRaquete2, largura, altura);
  if (modo2jog) {
    if (keyIsDown(UP_ARROW)) yRaquete2 -= 6;
    if (keyIsDown(DOWN_ARROW)) yRaquete2 += 6;
  } else {
    if (yBolinha < yRaquete2 + altura / 2) {
      yRaquete2 -= velOponente;
    } else {
      yRaquete2 += velOponente;
    }
  }

  // Colisão jogador 1
  if (
    xBolinha - tamBolinha / 2 < xRaquete1 + largura &&
    yBolinha > yRaquete1 &&
    yBolinha < yRaquete1 + altura
  ) {
    xvel *= -1;
    xBolinha = xRaquete1 + largura + tamBolinha / 2;
  }

  // Colisão jogador 2
  if (
    xBolinha + tamBolinha / 2 > xRaquete2 &&
    yBolinha > yRaquete2 &&
    yBolinha < yRaquete2 + altura
  ) {
    xvel *= -1;
    xBolinha = xRaquete2 - tamBolinha / 2;
  }
}

function checarFim() {
  if (pontos1 >= maxPontos || pontos2 >= maxPontos) {
    fim = true;
  }
}

function resetarBolinha(direcao) {
  xBolinha = width/2;
  yBolinha = height/2;
  xvel = 5 * direcao;
  yvel = random([-5,5]);
}

function reiniciarJogo() {
  pontos1 = 0;
  pontos2 = 0;
  fim = false;
  xBolinha = width/2;
  yBolinha = height/2;
  xvel = 5 * (random()<0.5?-1:1);
  yvel = random([-5,5]);
  yRaquete1 = 150;
  yRaquete2 = 150;
  loop();
}
