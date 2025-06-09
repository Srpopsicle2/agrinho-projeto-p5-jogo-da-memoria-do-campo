//Variaveis Do Codigo
let cardImages = [];
let imageNames = [
  'img1.png', 'img2.png', 'img3.jpg', 'img4.jpg',
  'img5.jpg', 'img6.jpg', 'img7.png', 'img8.png',
  'img9.jpg', 'img10.jpg', 'img11.jpg', 'img12.jpg',
  'img13.jpg', 'img14.jpg', 'img15.jpg', 'img16.jpg'
];

let flipSound, wrongSound, winSound;
let cards = [];
let flipped = [];
let matchedPairs = 0;
let totalPairs = 8;
let cols = 4;
let rows = 4;
let cardW = 70;
let cardH = 70;
let spacing = 15;
let IsTurning = false;

//Carregar Ativos Importantes
function preload() {
  for (let i = 0; i < imageNames.length; i++) {
    let img = loadImage(`images/${imageNames[i]}`);
    cardImages.push(img);
  }
  flipSound = loadSound('sounds/flip.mp3');
  wrongSound = loadSound('sounds/wrong.mp3');
  winSound = loadSound('sounds/win.mp3');
}

//Criar O Canvas

function setup() {
  createCanvas(cols * (cardW + spacing) + spacing, rows * (cardH + spacing) + spacing);
  //Ativar A Função Iniciar O Jogo
  startGame();
}

// Iniciar O Jogo
function startGame() {
  cards = [];
  flipped = [];
  matchedPairs = 0;
  winPlayed = false;
  let allCards = [];
  for (let i = 0; i < cardImages.length; i += 2) {
    let pairId = i / 2;
    allCards.push({ img: cardImages[i], id: pairId });
    allCards.push({ img: cardImages[i + 1], id: pairId });
  }
  //Embaralhar Cartas
  shuffle(allCards, true);
  let index = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let posX = spacing + x * (cardW + spacing);
      let posY = spacing + y * (cardH + spacing);
      cards.push(new Card(posX, posY, cardW, cardH, allCards[index]));
      index++;
    }
  }
}

//Verificação Continua
function draw() {
  background(220);
  for (let card of cards) {
    card.show();
  }
  if (matchedPairs == totalPairs) {
    textSize(32);
    fill(0, 150, 0);
    textAlign(CENTER, CENTER);
    text('Você venceu!', width / 2, height / 2);
    winSound.play();
    winPlayed = true;
    //Reniciar Partida
    setTimeout(startGame, 5000);
  }
}

//Habilitar Clicar Nas Cartas
function EnableClickCard() {
  IsTurning = false;
}


//Detectar Se O Mouse Tocou Em Algo Mais especificamente cartas
function mousePressed() {
  for (let card of cards) {
    if (!IsTurning && card.contains(mouseX, mouseY) && !card.flipped && !card.matched) {
      //Desabilitar O Clique De Cartas
      IsTurning = true;
      card.flip();
      flipSound.play();
      flipped.push(card);
      //Habillitar O Clique De Cartas
      setTimeout(EnableClickCard, 805);
      if (flipped.length === 2) {
        //Checar Se O Par Está Certo
        setTimeout(checkMatch, 800);
      }
      break;
    }
  }
}

//Detectar se o par está certo

function checkMatch() {
  if (flipped[0].data.id === flipped[1].data.id) {
    flipped[0].matched = true;
    flipped[1].matched = true;
    matchedPairs+= 1;
  } else {
    flipped[0].flip();
    flipped[1].flip();
    wrongSound.play();
  }
  flipped = [];
}

//Criar A Classe Da Carta Para Ser Utilizado Em Outras Funções

class Card {
  constructor(x, y, w, h, data) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.data = data;
    this.flipped = false;
    this.matched = false;
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }

  flip() {
    this.flipped = !this.flipped;
  }

  show() {
    stroke(0);
    if (this.flipped || this.matched) {
      image(this.data.img, this.x, this.y, this.w, this.h);
    } else {
      fill(180);
      rect(this.x, this.y, this.w, this.h);
    }
  }
}