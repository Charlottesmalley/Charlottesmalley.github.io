const c = document.querySelector('#c');
const ctx = c.getContext('2d');

const ratio = window.innerHeight / window.innerWidth;
const width = window.innerWidth
const height = window.innerHeight

c.height = Math.max(900, window.innerHeight)
c.width = c.height / ratio

c.style.width = '100vw';
c.style.height = '100vh';

function pseudoRandom(seed) {
  return Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
}

function noise(x, y) {
  const seed = x * 137 + y * 149; // Генерация уникального числа
  return pseudoRandom(seed) % 1; // Возвращаем значение от 0 до 1
}

const stepAngle = (Math.PI * 2) / 3;

const getThread = (i) => {
  return ({
    lastPoint: {
      x: (c.width / 2) + Math.cos((Math.PI / 10) * i) * i * 3,
      y: (c.height / 2) + Math.sin((Math.PI / 10) * i) * i * 3,
    },
    angle: (Math.PI / 3) + (stepAngle * i)
  })
}

const threads = []

for (let i = 0; i < 256; i++) {
  threads.push(getThread(i))
}

const palette = [
  '#FF9F00',
  '#FF6F00',
  '#D84B16',
  '#C94431',
  '#A73356',
  '#6D2449',
  '#341E41',
  '#1F1239',
  '#0A0D30',
]

// https://www.asciiart.eu/art-and-design/mona-lisa
const monaLisa = `
                                  _______
                           _,,ad8888888888bba,_
                        ,ad88888I888888888888888ba,
                      ,88888888I88888888888888888888a,
                    ,d888888888I8888888888888888888888b,
                   d88888PP"""" ""YY88888888888888888888b,
                 ,d88"'__,,--------,,,,.;ZZZY8888888888888,
                ,8IIl'"                ;;l"ZZZIII8888888888,
               ,I88l;'                  ;lZZZZZ888III8888888,
             ,II88Zl;.                  ;llZZZZZ888888I888888,
            ,II888Zl;.                .;;;;;lllZZZ888888I8888b
           ,II8888Z;;                 ';;;;;''llZZ8888888I8888,
           II88888Z;'                        .;lZZZ8888888I888b
           II88888Z; _,aaa,      .,aaaaa,__.l;llZZZ88888888I888
           II88888IZZZZZZZZZZ,  .ZZZZZZZZZZZZZZ;llZZ88888888I888,
           II88888IZZ<'(@@>Z|  |ZZZ<'(@@>ZZZZ;;llZZ888888888I88I
          ,II88888;   '""" ;|  |ZZ; '"""     ;;llZ8888888888I888
          II888888l            ';;          .;llZZ8888888888I888,
         ,II888888Z;           ;;;        .;;llZZZ8888888888I888I
         III888888Zl;    ..,   ';;       ,;;lllZZZ88888888888I888
         II88888888Z;;...;(_    _)      ,;;;llZZZZ88888888888I888,
         II88888888Zl;;;;;' '--'Z;.   .,;;;;llZZZZ88888888888I888b
         ]I888888888Z;;;;'   ";llllll;..;;;lllZZZZ88888888888I8888,
         II888888888Zl.;;"Y88bd888P";;,..;lllZZZZZ88888888888I8888I
         II8888888888Zl;.; '"PPP";;;,..;lllZZZZZZZ88888888888I88888
         II888888888888Zl;;. ';;;l;;;;lllZZZZZZZZZW88888888888I88888
         'II8888888888888Zl;.    ,;;lllZZZZZZZZWMZ88888888888I88888
          II8888888888888888ZbaalllZZZZZZZZZWWMZZZ8888888888I888888,
          'II88888888888888888b"WWZZZZZWWWMMZZZZZZI888888888I8888888
           'II88888888888888888;ZZMMMMMMZZZZZZZZllI888888888I8888888
            'II8888888888888888 ';lZZZZZZZZZZZlllll888888888I8888888,
             II8888888888888888, ';lllZZZZllllll;;.Y8888888I8888888888b,
            ,II8888888888888888b   .;;lllllll;;;.;..88888888I8888888888,
            II8888888888888888b   .;;lllllll;;;.;..88888888I88888888888
           ,d8888888888888888,    .;lllllll;;;..88888888I8888888888888
         ,ad8888888888888888,    .;;lllllll;;;..Y88888888I88888888888888
       ,d88888888888888888,     .;;lllllll;;;...d8888888I888888888888888
     ,d888888888888888888,     .;;;lllllll;;;..;8888888I8888888888888888
   ,d88888888888888888888,     .;;;lllllll;;;...8888888I88888888888888888
  ,d888888888888888888888,    .;;;lllllll;;;...d8888888I888888888888888888
 ,d88888888888888888888888,   .;;lllllll;;;....d8888888I8888888888888888888
 88888888888888888888888888,  .;;;lllllll;;;..;d8888888I88888888888888888888
 8888888888888888888888888888b..;;;lllllll;;..d8888888I888888888888888888888
 8888888888888888888888888888888baallllllll...d8888888I888888888888888888888
 8888888888888888888888888888888888ZZZZZZZZ....d8888888I888888888888888888888
 888888888888888888888888888888888ZZZZZZZZZ....d8888888I888888888888888888888
 8888888888888888888888888888888ZZZZZZZZZZZZZZ...d8888888I88888888888888888888
 888888888888888888888888888888ZZZZZZZZZZZZZZZ....d8888888I888888888888888888888
 8888888888888888888888888888ZZZZZZZZZZZZZZZZZ....d8888888I888888888888888888888
`.split('\n').slice(1);

const symbols = ` .-'":_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpPOGbUAKXHm8RD#$Bg0MNWQ%&@`;

ctx.fillStyle = 'rgba(0, 0, 0, 1)';
ctx.fillRect(0, 0, c.width, c.height);

const animate = (time) => {
  requestAnimationFrame(animate);
  
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, c.width, c.height);
  
  ctx.lineWidth = 1;
  
  // exit
  let prevColor = '#000000';
  for (let y = 1; y < monaLisa.length; y++) {
    for (let x = 0; x < 76; x++) {
      const padding = ((c.width - 760) / 2);
      const letter = monaLisa[y][x] ?? ' ';
      const level =  1.256 - (symbols.indexOf(letter) / symbols.length);
      const size = 20;

      ctx.beginPath();
      
      const colors = [
        35, 55, 75, 95, 115, 135, 155, 175, 195, 215
      ];
      
      const e = (Math.cos((x + time / 10000) * 10) + Math.sin((y + time / 10000) * 10));
      const deg = 220 + colors[Math.floor(e * colors.length)];

      // Draw squares instead of circles
      const squareSize = level * 10; // Control the size of the square

      ctx.fillStyle = `hsl(${deg}deg, 60%, ${20 + level * 40}%)`;
      ctx.fillRect(padding + (x * 10), y * 20, squareSize, squareSize);
      
      prevColor = ctx.fillStyle;
    }
  }
}

animate(0);