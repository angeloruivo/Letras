// Copie TODO o código da resposta anterior, mas SUBSTITUA
// a função calculateLayout inteira por esta nova versão acima.
// O restante do código (setup, draw, mousePressed, LetterTile,
// drawMascot, drawBee, ..., drawZebra, windowResized) continua igual.

// Exemplo (cole o código completo anterior aqui, e depois cole a função
// calculateLayout nova por cima da antiga):

let letterTiles = [];
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let associations = {};
let currentState = 'startScreen';
let selectedAssociation = null;
let tileWidth, tileHeight, spacing, cols, rows, totalGridHeight; // <- Adicionado totalGridHeight aqui se não estava
let brightColors = [];

let brown, lightBrown, darkBrown, green, darkGreen, grey, lightGrey, pink, yellow, orange, red, blue, black, white;

function setup() {
  // ... (código setup inalterado) ...
  createCanvas(windowWidth, windowHeight);
  textFont('sans-serif');

  // Define cores (sem alterações aqui)
  brightColors = [
    color(255, 99, 71), color(255, 165, 0), color(255, 215, 0),
    color(50, 205, 50), color(30, 144, 255), color(147, 112, 219),
    color(255, 105, 180)
  ];
  brown = color(139, 69, 19); lightBrown = color(210, 180, 140); darkBrown = color(101, 67, 33);
  green = color(34, 139, 34); darkGreen = color(0, 100, 0); grey = color(128, 128, 128);
  lightGrey = color(211, 211, 211); pink = color(255, 192, 203); yellow = color(255, 255, 0);
  orange = color(255, 165, 0); red = color(255, 0, 0); blue = color(0, 0, 255);
  black = color(0); white = color(255);

  // --- Mapeamento Letra -> Objeto/Animal (COMPLETO - sem alterações aqui) ---
  associations = {
    'A': { name: 'Abelha', drawFunc: drawBee }, 'B': { name: 'Bola', drawFunc: drawBall },
    'C': { name: 'Cachorro', drawFunc: drawDog }, 'D': { name: 'Dado', drawFunc: drawDice },
    'E': { name: 'Elefante', drawFunc: drawElephant }, 'F': { name: 'Foca', drawFunc: drawSeal },
    'G': { name: 'Gato', drawFunc: drawCat }, 'H': { name: 'Hipopótamo', drawFunc: drawHippo },
    'I': { name: 'Ioiô', drawFunc: drawYoyo }, 'J': { name: 'Jacaré', drawFunc: drawAlligator },
    'K': { name: 'Kiwi', drawFunc: drawKiwiFruit }, 'L': { name: 'Leão', drawFunc: drawLion },
    'M': { name: 'Macaco', drawFunc: drawMonkey }, 'N': { name: 'Nuvem', drawFunc: drawCloud },
    'O': { name: 'Ovelha', drawFunc: drawSheep }, 'P': { name: 'Peixe', drawFunc: drawFish },
    'Q': { name: 'Queijo', drawFunc: drawCheese }, 'R': { name: 'Rato', drawFunc: drawMouse },
    'S': { name: 'Sol', drawFunc: drawSun }, 'T': { name: 'Tartaruga', drawFunc: drawTurtle },
    'U': { name: 'Uva', drawFunc: drawGrape }, 'V': { name: 'Vaca', drawFunc: drawCow },
    'W': { name: 'Wafer', drawFunc: drawWafer }, 'X': { name: 'Xícara', drawFunc: drawCup },
    'Y': { name: 'Yoga', drawFunc: drawYoga }, 'Z': { name: 'Zebra', drawFunc: drawZebra }
  };
}

// --- AJUSTES NO LAYOUT (FORÇANDO 4 COLUNAS) ---
function calculateLayout() {
  // Define explicitamente 4 colunas
  let desiredCols = 4;
  cols = desiredCols; // Define a variável global 'cols'

  let availableHeight = height * 0.9; // Usa 90% da altura para a grade
  let topMargin = height * 0.05; // Margem superior

  // Calcula espaçamento baseado no menor entre largura/altura
  spacing = max(10, min(width * 0.02, height * 0.02));

  // Calcula a largura do tile para caber 4 colunas + espaçamentos
  tileWidth = (width - (cols + 1) * spacing) / cols;

  // Calcula a altura do tile (ligeiramente retangular)
  tileHeight = tileWidth * 1.05;

  // Calcula quantas linhas serão necessárias
  rows = ceil(alphabet.length / cols); // 26 letras / 4 colunas = 7 linhas

  // Calcula a altura total que a grade ocuparia
  totalGridHeight = rows * (tileHeight + spacing) - spacing;

  // Se a grade calculada for mais alta que o espaço disponível,
  // reduz o tamanho dos tiles proporcionalmente para caber.
  if (totalGridHeight > availableHeight) {
    let scaleFactor = availableHeight / totalGridHeight;
    tileHeight *= scaleFactor * 0.98; // Reduz um pouco mais para garantir margem
    tileWidth = tileHeight / 1.05; // Mantém proporção
    totalGridHeight = rows * (tileHeight + spacing) - spacing; // Recalcula altura final com tiles menores
  }

  // Calcula posição inicial X para centralizar horizontalmente
  let totalGridWidth = cols * (tileWidth + spacing) - spacing;
  let startX = max(spacing, (width - totalGridWidth) / 2) + tileWidth / 2; // Garante margem esquerda

  // Calcula posição inicial Y (centraliza verticalmente se couber, senão começa na margem)
   let startY = topMargin + tileHeight / 2;
   if (totalGridHeight < availableHeight) {
        // Tenta centralizar verticalmente se houver espaço de sobra
        startY = (height - totalGridHeight) / 2 + tileHeight / 2;
   }
   // Garante que não comece colado no topo
   startY = max(startY, topMargin + tileHeight / 2);


   // Retorna os valores calculados para createLetterTiles usar
   // Note: cols, rows, tileWidth, tileHeight, spacing são globais ou já definidas
   // então só precisamos retornar startX e startY que são locais aqui.
   return { startX, startY };
}
// --- FIM DOS AJUSTES DE LAYOUT ---


function createLetterTiles() {
  // ... (código createLetterTiles inalterado) ...
  letterTiles = []; // Limpa antes de recriar

  // Obtém as posições calculadas
  const { startX, startY } = calculateLayout();

  let currentLet = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (currentLet < alphabet.length) {
        let letter = alphabet[currentLet];
        // Calcula a posição X e Y para este tile na grade
        let x = startX + c * (tileWidth + spacing);
        let y = startY + r * (tileHeight + spacing);
        let tileColor = random(brightColors);
        letterTiles.push(new LetterTile(letter, x, y, tileWidth, tileHeight, tileColor));
        currentLet++;
      }
    }
  }
}

function draw() {
  // ... (código draw inalterado) ...
  background(230, 245, 255); // Fundo azul ainda mais claro

  if (currentState === 'startScreen') {
    displayStartScreen();
  } else if (currentState === 'alphabetView') {
    for (let tile of letterTiles) {
      tile.display();
    }
     fill(50); textSize(max(16, height * 0.02)); textAlign(CENTER, TOP);
     text("Clique em uma letra!", width / 2, height * 0.02); // Margem dinâmica

  } else if (currentState === 'objectView') {
    if (selectedAssociation) {
      push();
      translate(width / 2, height * 0.45); // Área de desenho
      let scaleFactor = min(1.0, width / 500, height / 400); // Escala mais agressiva em telas menores
      scale(scaleFactor);
      selectedAssociation.drawFunc(); // Desenha o objeto
      pop();

      fill(0); textSize(max(28, height * 0.045)); textAlign(CENTER, CENTER);
      text(selectedAssociation.name, width / 2, height * 0.7); // Nome

      fill(100); textSize(max(18, height * 0.025)); textAlign(LEFT, TOP);
      text(`Letra: ${selectedAssociation.letter}`, width * 0.05, height * 0.05); // Letra no canto

      fill(100); textSize(max(15, height * 0.018)); textAlign(CENTER, BOTTOM);
      text("Clique para voltar", width / 2, height - height * 0.03); // Instrução voltar
    }
  }
}

function displayStartScreen() {
  // ... (código displayStartScreen inalterado) ...
    // Fundo simples para start screen
    background(173, 216, 230); // Light blue solid

    drawMascot(width / 2, height * 0.4, min(width * 0.25, height * 0.25, 180)); // Mascote ligeiramente maior

    fill(0, 51, 102); textAlign(CENTER, CENTER);
    textSize(max(28, min(width * 0.055, height * 0.055)));
    text("Aprender Letras e Animais", width / 2, height * 0.65);
    textSize(max(34, min(width * 0.065, height * 0.065)));
     fill(255, 87, 51);
     text("com Ruivo", width / 2, height * 0.75);

    fill(50); textSize(max(18, height * 0.025));
    text("Clique para começar!", width / 2, height * 0.9);
}

function mousePressed() {
  // ... (código mousePressed inalterado) ...
  if (currentState === 'startScreen') {
    currentState = 'alphabetView';
    // Chama createLetterTiles AQUI, que por sua vez chama calculateLayout
    createLetterTiles();
  } else if (currentState === 'alphabetView') {
    for (let tile of letterTiles) {
      if (tile.isClicked(mouseX, mouseY)) {
        if (associations[tile.char]) {
            selectedAssociation = associations[tile.char];
            selectedAssociation.letter = tile.char;
            currentState = 'objectView';
        } else {
            console.warn("Associação não definida para:", tile.char);
        }
        return;
      }
    }
  } else if (currentState === 'objectView') {
    currentState = 'alphabetView';
    selectedAssociation = null;
  }
}

// --- Classe LetterTile ---
// ... (código LetterTile inalterado) ...
class LetterTile {
  constructor(char, x, y, w, h, col) {
    this.char = char; this.x = x; this.y = y; this.w = w; this.h = h; this.color = col;
  }

  display() {
    push();
    translate(this.x, this.y);
    rectMode(CENTER);
    noStroke();
    // Sombra sutil
    fill(0, 0, 0, 40); rect(this.w * 0.05, this.h * 0.05, this.w, this.h, 8); // Sombra menor
    // Bloco principal
    fill(this.color); rect(0, 0, this.w, this.h, 8); // Menos arredondado

    fill(white); textSize(this.h * 0.65); // Letra um pouco maior
    textAlign(CENTER, CENTER); text(this.char, 0, this.h * 0.05);
    pop();
  }

  isClicked(mx, my) {
    return ( abs(mx - this.x) < this.w / 2 && abs(my - this.y) < this.h / 2 ); // Cálculo simplificado
  }
}

// ===========================================
// --- FUNÇÕES DE DESENHO (A - Z) ---
// ===========================================
// ... (todas as funções drawMascot, drawBee ... drawZebra inalteradas) ...
function drawMascot(x, y, size) { /* ... código do mascote inalterado ... */
  push();
  translate(x, y);
  rectMode(CENTER);
  noStroke();

  let headSize = size * 0.5;
  let bodyHeight = size * 0.5;
  let bodyWidth = size * 0.4;
  let hatHeight = size * 0.5;
  let hatWidth = size * 0.55;
  let hatBrimHeight = size * 0.08;
  let hatBrimWidth = size * 0.7;

  // Corpo (túnica azul)
  fill(60, 80, 200); // Azul mago
  rect(0, headSize * 0.5 + bodyHeight * 0.5, bodyWidth, bodyHeight, size * 0.1);

  // Cabeça
  fill(255, 220, 180); // Tom de pele
  ellipse(0, 0, headSize, headSize);

  // Cabelo "Ruivo" (pontas laterais)
  fill(255, 100, 0); // Laranja/Vermelho
  triangle(-headSize*0.4, -headSize*0.1, -headSize*0.6, headSize*0.2, -headSize*0.3, headSize*0.3);
  triangle( headSize*0.4, -headSize*0.1,  headSize*0.6, headSize*0.2,  headSize*0.3, headSize*0.3);


  // Chapéu
  fill(40, 40, 40); // Preto
  // Aba
  rect(0, -headSize * 0.4 + hatBrimHeight/2, hatBrimWidth, hatBrimHeight, size * 0.05);
  // Cone
  triangle(-hatWidth/2, -headSize * 0.4, hatWidth/2, -headSize * 0.4, 0, -headSize * 0.4 - hatHeight);

  // Olhos
  fill(white);
  ellipse(-headSize * 0.15, -headSize * 0.05, headSize * 0.2, headSize * 0.2);
  ellipse( headSize * 0.15, -headSize * 0.05, headSize * 0.2, headSize * 0.2);
  fill(black);
  ellipse(-headSize * 0.15, -headSize * 0.05, headSize * 0.1, headSize * 0.1);
  ellipse( headSize * 0.15, -headSize * 0.05, headSize * 0.1, headSize * 0.1);

   // Sorriso
   noFill();
   stroke(black);
   strokeWeight(max(1, size * 0.01));
   arc(0, headSize * 0.15, headSize * 0.3, headSize * 0.2, 0.1 * PI, 0.9 * PI);
   noStroke();

  pop();
}
function drawBee() { /* ... código inalterado ... */
  fill(yellow); ellipse(0, 0, 100, 60);
  fill(black);
  rect(-30, -28, 15, 56, 5); rect(0, -30, 15, 60, 5); rect(30, -28, 15, 56, 5);
  fill(173, 216, 230, 150); ellipse(-20, -50, 60, 40); ellipse(20, -50, 60, 40);
  fill(black); ellipse(-35, -5, 8, 8); ellipse(-23, -5, 8, 8);
}
function drawBall() { /* ... código inalterado ... */
  fill(red); ellipse(0, 0, 100, 100);
  fill(white); ellipse(-20, -20, 30, 15); // Brilho
}
function drawDog() { /* ... código inalterado ... */
  fill(brown); ellipse(0, 0, 100, 90); // Cabeça
  triangle(-50, -60, -70, 0, -30, -30); triangle( 50, -60,  70, 0,  30, -30); // Orelhas
  fill(lightBrown); ellipse(0, 20, 50, 40); // Focinho
  fill(black); ellipse(0, 15, 15, 10); // Nariz
  ellipse(-20, -10, 10, 15); ellipse( 20, -10, 10, 15); // Olhos
}
function drawDice() { /* ... código inalterado ... */
   fill(white); stroke(black); strokeWeight(4); rectMode(CENTER);
   square(0, 0, 100, 15);
   noStroke(); fill(black);
   ellipse(0, 0, 20, 20); ellipse(-30, -30, 20, 20); ellipse(30, 30, 20, 20); // Ex: 3
   rectMode(CORNER); // Reset
}
function drawElephant() { /* ... código inalterado ... */
  fill(grey);
  ellipse(0, 0, 140, 100); // Corpo
  ellipse(-60, -40, 80, 70); // Cabeça
  // Tromba
  noFill(); stroke(grey); strokeWeight(25);
  arc(-90, -20, 80, 100, HALF_PI - 0.2, PI + 0.2);
  noStroke(); fill(grey);
  // Orelha
  ellipse(-90, -50, 50, 70);
  // Olho
  fill(black); ellipse(-80, -45, 8, 8);
}
function drawSeal() { /* ... código inalterado ... */
  fill(lightGrey);
  ellipse(0, 10, 160, 80); // Corpo alongado
  ellipse(-70, -20, 60, 50); // Cabeça
  // Nadadeiras
  triangle(30, -10, 50, 40, 70, 30);
  triangle(-40, 40, -20, 50, 0, 40);
  // Cauda
  triangle(70, 0, 90, -15, 90, 15);
  // Olho e nariz
  fill(black);
  ellipse(-80, -25, 10, 10); // Olho
  ellipse(-95, -10, 8, 5); // Nariz
  // Bigodes (linhas)
  stroke(black); strokeWeight(1);
  line(-98, -10, -110, -12); line(-98, -8, -110, -8); line(-98, -6, -110, -4);
  noStroke();
}
function drawCat() { /* ... código inalterado ... */
  fill(orange); ellipse(0, 0, 90, 80); // Cabeça
  // Orelhas
  triangle(-40, -50, -10, -30, -40, -20);
  triangle( 40, -50,  10, -30,  40, -20);
  // Olhos
  fill(white); ellipse(-20, -5, 20, 25); ellipse(20, -5, 20, 25);
  fill(green); ellipse(-20, -5, 10, 15); ellipse(20, -5, 10, 15);
  fill(black); ellipse(-20, -5, 5, 8); ellipse(20, -5, 5, 8);
  // Nariz e boca
  fill(pink); triangle(0, 10, -5, 18, 5, 18);
  noFill(); stroke(black); strokeWeight(1.5);
  arc(0, 18, 15, 10, 0, PI); // Boca simplificada
  // Bigodes
  line(-10, 15, -40, 10); line(-10, 20, -40, 20); line(-10, 25, -40, 30);
  line( 10, 15,  40, 10); line( 10, 20,  40, 20); line( 10, 25,  40, 30);
  noStroke();
}
function drawHippo() { /* ... código inalterado ... */
  fill(180, 190, 210); // Cinza azulado
  ellipse(0, 20, 180, 100); // Corpo grande
  ellipse(0, -30, 120, 90); // Cabeça/Focinho
  // Narinas
  fill(150, 160, 180);
  ellipse(-25, -55, 20, 15);
  ellipse( 25, -55, 20, 15);
  // Orelhas
  ellipse(-50, -60, 25, 35);
  ellipse( 50, -60, 25, 35);
  // Olhos
  fill(black);
  ellipse(-35, -40, 10, 10);
  ellipse( 35, -40, 10, 10);
}
function drawYoyo() { /* ... código inalterado ... */
  fill(blue); ellipse(0, 0, 80, 80); // Corpo do ioiô
  fill(white); ellipse(0, 0, 20, 20); // Centro
  stroke(black); strokeWeight(2);
  line(0, -40, 0, -100); // Corda
  ellipse(0, -100, 15, 10); // Laço do dedo
  noStroke();
}
function drawAlligator() { /* ... código inalterado ... */
  fill(darkGreen);
  ellipse(0, 0, 180, 60); // Corpo
  // Cabeça/Focinho
  triangle(-90, 0, -150, -20, -150, 20);
  // Patas simples
  rect(-50, 25, 15, 20); rect(30, 25, 15, 20);
  // Olho
  fill(yellow); ellipse(-130, -15, 15, 15);
  fill(black); ellipse(-130, -15, 5, 5);
  // Dentes (triângulos pequenos)
  fill(white);
  for(let i = 0; i < 5; i++) {
      triangle(-145 + i*10, 15, -140 + i*10, 15, -142.5 + i*10, 20);
  }
}
function drawKiwiFruit() { /* ... código inalterado ... */
  fill(brown); ellipse(0, 0, 80, 100); // Casca marrom
  // Parte interna verde
  fill(152, 251, 152); // Verde claro
  ellipse(0, 0, 65, 85);
  // Centro branco
  fill(white); ellipse(0, 0, 25, 45);
  // Sementes pretas (pontos)
  fill(black);
  for(let i=0; i< 20; i++) {
      let angle = random(TWO_PI);
      let radius = random(15, 30);
      ellipse(cos(angle)*radius, sin(angle)*radius * 1.5, 2, 3); // Sementes ovais
  }
}
function drawLion() { /* ... código inalterado ... */
  // Juba
  fill(orange); ellipse(0, 0, 140, 140);
  // Cabeça
  fill(255, 218, 185); ellipse(0, 0, 90, 90); // Tom de pele/amarelo claro
  // Orelhas
  ellipse(-40, -40, 30, 30); ellipse(40, -40, 30, 30);
  // Focinho
  fill(white); ellipse(0, 20, 50, 35);
  // Nariz
  fill(darkBrown); triangle(0, 10, -10, 25, 10, 25);
  // Olhos
  fill(black); ellipse(-20, -5, 10, 12); ellipse(20, -5, 10, 12);
}
function drawMonkey() { /* ... código inalterado ... */
  // Cabeça
  fill(brown); ellipse(0, 0, 100, 95);
  // Parte clara do rosto
  fill(lightBrown);
  arc(0, 0, 85, 80, PI, TWO_PI); // Meia elipse inferior
  ellipse(0, 0, 85, 60); // Elipse central sobreposta
  // Orelhas
  ellipse(-50, 0, 40, 40); ellipse(50, 0, 40, 40);
  fill(brown); ellipse(-50, 0, 25, 25); ellipse(50, 0, 25, 25); // Centro orelha
  // Olhos
  fill(black); ellipse(-20, -15, 12, 15); ellipse(20, -15, 12, 15);
  // Nariz/Boca
  ellipse(0, 10, 8, 5); // Nariz
  noFill(); stroke(black); strokeWeight(1.5);
  arc(0, 20, 30, 20, 0.1*PI, 0.9*PI); // Sorriso
  noStroke();
}
function drawCloud() { /* ... código inalterado ... */
   fill(white); noStroke();
   ellipse(0, 0, 100, 50);
   ellipse(-40, 10, 70, 40);
   ellipse(40, 15, 80, 50);
   ellipse(0, 20, 60, 30);
}
function drawSheep() { /* ... código inalterado ... */
  // Lã (nuvem)
  fill(white); noStroke();
  ellipse(0, 0, 130, 90); ellipse(-50, 10, 80, 60); ellipse(50, 15, 90, 70); ellipse(0, -30, 70, 50);
  // Cabeça
  fill(lightGrey); ellipse(0, -20, 60, 70);
  // Orelhas
  ellipse(-30, -35, 20, 30); ellipse(30, -35, 20, 30);
  // Olhos
  fill(black); ellipse(-15, -25, 8, 10); ellipse(15, -25, 8, 10);
  // Patas simples
  rect(-40, 40, 15, 30); rect(-10, 45, 15, 30); rect(20, 40, 15, 30);
}
function drawFish() { /* ... código inalterado ... */
  fill(orange);
  // Corpo
  ellipse(0, 0, 120, 70);
  // Cauda
  triangle(60, 0, 90, -30, 90, 30);
  // Barbatana dorsal
  triangle(-20, -35, 20, -35, 0, -50);
  // Olho
  fill(white); ellipse(-35, -5, 20, 20);
  fill(black); ellipse(-38, -5, 8, 8);
  // Boca
  noFill(); stroke(black); strokeWeight(1.5);
  arc(-50, 10, 15, 10, 0, HALF_PI);
  noStroke();
}
function drawCheese() { /* ... código inalterado ... */
  fill(yellow); // Amarelo queijo
  // Forma principal (fatia)
  beginShape();
  vertex(-70, 40); vertex(70, 40); vertex(30, -40); vertex(-50, -30);
  endShape(CLOSE);
  // Buracos (círculos)
  fill(255, 230, 150);
  ellipse(0, 0, 25, 25); ellipse(-30, 10, 20, 20); ellipse(30, -5, 18, 18); ellipse(10, 25, 15, 15);
}
function drawMouse() { /* ... código inalterado ... */
  fill(grey);
  // Corpo
  ellipse(0, 10, 80, 110); // Corpo mais vertical
  // Cabeça
  ellipse(0, -40, 60, 50);
  // Orelhas grandes
  fill(pink); ellipse(-25, -65, 40, 40); ellipse(25, -65, 40, 40);
  fill(grey); ellipse(-25, -65, 30, 30); ellipse(25, -65, 30, 30);
  // Olhos
  fill(black); ellipse(-10, -45, 8, 8); ellipse(10, -45, 8, 8);
  // Nariz
  ellipse(0, -30, 8, 5);
  // Rabo
  noFill(); stroke(grey); strokeWeight(4);
  curve(0, 50, 30, 70, 60, 40, 80, 60); // Curva para o rabo
  noStroke();
}
function drawSun() { /* ... código inalterado ... */
  fill(yellow); noStroke();
  ellipse(0, 0, 100, 100); // Centro do sol
  // Raios (triângulos)
  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI / 12 * i;
    let x1 = cos(angle) * 60;
    let y1 = sin(angle) * 60;
    push(); translate(x1, y1); rotate(angle + HALF_PI);
    triangle(0, 0, -8, 30, 8, 30);
    pop();
  }
}
function drawTurtle() { /* ... código inalterado ... */
  // Casco
  fill(green); ellipse(0, 0, 140, 100);
  // Detalhes do casco
  fill(darkGreen);
  ellipse(0, 0, 30, 20); ellipse(-30, -20, 30, 20); ellipse(30, -20, 30, 20);
  ellipse(-40, 20, 30, 20); ellipse(40, 20, 30, 20); ellipse(0, 35, 30, 20);
  // Cabeça
  fill(green); ellipse(-70, -20, 50, 40);
  // Patas
  ellipse(-50, 45, 30, 20); ellipse(50, 45, 30, 20);
  ellipse(-70, 10, 20, 30); ellipse(70, 10, 20, 30);
  // Olho
  fill(black); ellipse(-80, -25, 8, 8);
}
function drawGrape() { /* ... código inalterado ... */
  let startX = -30, startY = -40; fill(128, 0, 128);
  ellipse(startX + 0, startY + 0, 30, 30); ellipse(startX + 25, startY + 0, 30, 30);
  ellipse(startX + 50, startY + 0, 30, 30); ellipse(startX + 12.5, startY + 25, 30, 30);
  ellipse(startX + 37.5, startY + 25, 30, 30); ellipse(startX + 25, startY + 50, 30, 30);
  stroke(brown); strokeWeight(4); line(startX + 25, startY - 15, startX + 25, startY - 30);
  fill(green); noStroke(); ellipse(startX + 35, startY - 30, 30, 20);
}
function drawCow() { /* ... código inalterado ... */
  fill(white); ellipse(0, 20, 160, 100); // Corpo
  fill(black); ellipse(-40, 10, 50, 30); ellipse(30, 30, 40, 40); ellipse(60, 0, 30, 20); // Manchas
  fill(white); ellipse(0, -50, 80, 70); // Cabeça
  fill(pink); ellipse(0, -35, 50, 35); // Focinho
  fill(black); ellipse(-10, -30, 8, 5); ellipse(10, -30, 8, 5); // Narinas
  fill(lightGrey); arc(-20, -80, 40, 40, PI, TWO_PI); arc(20, -80, 40, 40, PI, TWO_PI); // Chifres
  fill(white); ellipse(-45, -60, 20, 30); ellipse(45, -60, 20, 30); // Orelhas
  fill(black); ellipse(-20, -55, 10, 12); ellipse(20, -55, 10, 12); // Olhos
}
function drawWafer() { /* ... código inalterado ... */
  rectMode(CENTER); fill(245, 222, 179); rect(0, 0, 60, 100, 5); // Biscoito
  fill(darkBrown); rect(0, -20, 56, 15, 3); rect(0, 20, 56, 15, 3); // Recheio
  stroke(210, 180, 140); strokeWeight(1); // Textura
  for(let i = -25; i <= 25; i+= 10) { line(i, -50, i, 50); }
  for(let i = -45; i <= 45; i+= 10) { line(-30, i, 30, i); }
  noStroke(); rectMode(CORNER);
}
function drawCup() { /* ... código inalterado ... */
  fill(white); rect(-50, -30, 100, 70, 0, 0, 10, 10); // Corpo
  noFill(); stroke(white); strokeWeight(15); arc(50, 0, 40, 50, HALF_PI + 0.2, PI + HALF_PI - 0.2); // Asa
  fill(brown); ellipse(0, -30, 90, 25); // Conteúdo
  noStroke();
}
function drawYoga() { /* ... código inalterado ... */
    fill(lightBrown); ellipse(0, -60, 40, 40); // Cabeça
    fill(blue); rect(-10, -40, 20, 50); // Tronco
    stroke(lightBrown); strokeWeight(10); line(0, -30, -30, -70); line(0, -30, 30, -70); // Braços
    stroke(blue); strokeWeight(15); noFill(); arc(0, 30, 60, 40, PI - 0.5 , TWO_PI + 0.5); // Pernas
    noStroke();
}
function drawZebra() { /* ... código inalterado ... */
  fill(white); noStroke(); ellipse(0, 0, 150, 80); // Corpo
  ellipse(-70, -30, 60, 50); // Cabeça
  fill(black); // Listras
  rect(-40, -40, 10, 80, 2); rect(-15, -40, 10, 80, 2); rect(10, -40, 10, 80, 2);
  rect(35, -40, 10, 80, 2); rect(60, -30, 10, 60, 2);
  ellipse(-85, -40, 10, 15); // Orelha
  fill(white); stroke(black); strokeWeight(1); ellipse(-75, -30, 8, 8); // Olho
  noStroke();
}


// --- Adaptação ao Tamanho da Janela ---
// ... (código windowResized inalterado) ...
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalcula e recria apenas se não estiver na tela inicial
  if (currentState !== 'startScreen') {
      // Não precisa chamar calculateLayout explicitamente aqui
      // createLetterTiles chama calculateLayout internamente agora
      createLetterTiles();
  }
}
