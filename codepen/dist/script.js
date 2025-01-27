const c = document.querySelector("#c");
const ctx = c.getContext("2d");

c.style.width = c.width = window.innerWidth;
c.style.height = c.height = window.innerHeight;

// Определите параметры шестиугольника
const hexRadius = 5; // Радиус шестиугольника
const hexHeight = Math.sqrt(3) * hexRadius; // Высота шестиугольника

const palette = [
  "#ffb6c1", // Light Pink
  "#ff69b4", // Hot Pink
  "#ff1493", // Deep Pink
  "#db7093", // Pale Violet Red
  "#ff82ab" // Light Hot Pink
];

const makeCtx = (w, h) => {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  c.width = w;
  c.height = h;

  return ctx;
};

function drawHexagon(x, y, color, ctx) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 2 + (Math.PI / 3) * i;
    const xOffset = x + hexRadius * Math.cos(angle);
    const yOffset = y + hexRadius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(xOffset, yOffset);
    } else {
      ctx.lineTo(xOffset, yOffset);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  // ctx.stroke();
}

function drawTruchetTile(x, y, variation, ctx) {
  const circle = hexRadius / 3;

  if (variation === 0) {
    drawHexagon(x, y, palette[0], ctx);

    ctx.fillStyle = palette[1];

    const angle = Math.PI / 3;

    ctx.beginPath();
    ctx.moveTo(
      x + Math.cos(angle) * hexRadius,
      y + Math.sin(angle) * hexRadius
    );
    ctx.lineTo(
      x + Math.cos(angle + Math.PI) * hexRadius,
      y + Math.sin(angle + Math.PI) * hexRadius
    );
    ctx.lineTo(
      x + hexRadius + Math.cos(angle + Math.PI) * hexRadius,
      y - hexRadius + Math.sin(angle + Math.PI) * hexRadius
    );
    ctx.lineTo(
      x + hexRadius + Math.cos(angle) * hexRadius,
      y - hexRadius + Math.sin(angle) * hexRadius
    );
    ctx.fill();

    ctx.fillStyle = palette[1];

    ctx.beginPath();
    ctx.arc(x - hexRadius * 0.87, y + hexRadius * 0.5, circle, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = palette[0];

    ctx.beginPath();
    ctx.arc(x + hexRadius * 0.87, y - hexRadius * 0.5, circle, 0, Math.PI * 2);
    ctx.fill();
  } else if (variation === 1) {
    drawHexagon(x, y, palette[0], ctx);

    ctx.fillStyle = palette[1];

    for (let i = 0; i < 3; i++) {
      const angle = Math.PI / 6 + (Math.PI / 1.5) * i;

      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * hexRadius,
        y + Math.sin(angle) * hexRadius,
        circle,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  } else if (variation === 2) {
    drawHexagon(x, y, palette[4], ctx);

    ctx.fillStyle = palette[0];

    ctx.beginPath();
    ctx.arc(x, y, circle, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "destination-in";

  drawHexagon(x, y, "red", ctx); // Белый фон шестиугольника

  ctx.globalCompositeOperation = undefined;
}

const tile0Ctx = makeCtx(hexHeight, hexRadius * 2);
drawTruchetTile(hexHeight / 2, hexRadius, 0, tile0Ctx);

const tile1Ctx = makeCtx(hexHeight, hexRadius * 2);
drawTruchetTile(hexHeight / 2, hexRadius, 1, tile1Ctx);

const tile2Ctx = makeCtx(hexHeight, hexRadius * 2);
drawTruchetTile(hexHeight / 2, hexRadius, 2, tile2Ctx);

const drawGrid = (c, r, cols, rows, get) => {
  for (let row = r; row < rows; row++) {
    for (let col = c; col < cols; col++) {
      const x = Math.floor(col * hexHeight + (row % 2) * hexRadius * 0.85);
      const y = Math.floor(row * (hexRadius * 1.5));
      const variation = Math.floor(Math.random() * 2); // Случайный вариант

      ctx.resetTransform();
      ctx.translate(x + hexHeight / 2, y + hexRadius);

      const angle = col % 2 ? (row % 2 ? 2 : 2) : row % 2 ? 2 : 4;

      const tiles = [
        tile0Ctx.canvas,
        tile1Ctx.canvas,

        tile1Ctx.canvas,
        tile2Ctx.canvas,
        tile2Ctx.canvas
      ];

      const s = get(col, row);
      const enthropy = Math.floor(s * tiles.length) % tiles.length;

      const tile = tiles[enthropy];

      ctx.rotate((Math.PI / 3) * angle);
      ctx.drawImage(tile, -hexHeight / 2, -hexRadius);
    }
  }
};

const animate = (time) => {
  requestAnimationFrame(animate);

  const rows = Math.ceil(c.height / (1.5 * hexRadius));
  const cols = Math.ceil(c.width / hexHeight);
  const border = 10;
  const hborder = border / 2;
  const pattern = 7;

  drawGrid(0, 0, cols, rows, (col, row) => 0.3);

  drawGrid(
    2,
    2,
    cols - 2,
    rows - 2,
    (col, row) => 1 + Math.sin(col / 1) + (1 + Math.cos(row / 1))
  );

  drawGrid(6, 6, cols - 6, rows - 6, (col, row) => 0);

  drawGrid(8, 8, cols - 8, rows - 8, (col, row) => 0.7);

  drawGrid(
    border,
    border,
    cols - border,
    rows - border,
    (col, row) => 1 + Math.sin(col / 5) + (1 + Math.cos(row / 5))
  );
};

animate(0);