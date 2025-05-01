const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x,
      background.y,
      background.width,
      background.height
    );

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x + background.width,
      background.y,
      background.width,
      background.height
    );
  },
};

const ground = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  draw() {
    context.drawImage(
      sprites,
      ground.spriteX,
      ground.spriteY,
      ground.width,
      ground.height,
      ground.x,
      ground.y,
      ground.width,
      ground.height
    );

    context.drawImage(
      sprites,
      ground.spriteX,
      ground.spriteY,
      ground.width,
      ground.height,
      ground.x + ground.width,
      ground.y,
      ground.width,
      ground.height
    );
  },
};

function hasCollision(flappyBird, ground) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const groundY = ground.y;
  return flappyBirdY >= groundY;
}

function createFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    speed: 0,
    jump() {
      flappyBird.speed = -4.6;
    },
    update() {
      if (hasCollision(flappyBird, ground)) {
        changeScreen(SCREENS.START);
        flappyBird.y = 50;
        return;
      }
      flappyBird.speed = flappyBird.speed + flappyBird.gravity;
      flappyBird.y = flappyBird.y + flappyBird.speed;
    },
    draw() {
      context.drawImage(
        sprites,
        flappyBird.spriteX,
        flappyBird.spriteY,
        flappyBird.width,
        flappyBird.height,
        flappyBird.x,
        flappyBird.y,
        flappyBird.width,
        flappyBird.height
      );
    },
  };

  return flappyBird;
}

const startScreen = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      startScreen.sX,
      startScreen.sY,
      startScreen.w,
      startScreen.h,
      startScreen.x,
      startScreen.y,
      startScreen.w,
      startScreen.h
    );
  },
};
const globals = {};
let activeScreen = {};

function changeScreen(newScreen) {
  activeScreen = newScreen;

  if(newScreen.starts) {
    newScreen.starts();
  }
}

const SCREENS = {
  START: {
    starts() {
      globals.flappyBird = createFlappyBird();
    },
    draw() {
      background.draw();
      ground.draw();
      globals.flappyBird.draw();
      startScreen.draw();
    },
    click() {
      changeScreen(SCREENS.GAME);
    },
    update() {},
  },
  GAME: {
    draw() {
      background.draw();
      ground.draw();
      globals.flappyBird.draw();
    },
    click() {
      globals.flappyBird.jump();
    },
    update() {
      globals.flappyBird.update();
    },
  },
};

function loop() {
  activeScreen.draw();
  activeScreen.update();
  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (activeScreen.click) {
    activeScreen.click();
  }
});

changeScreen(SCREENS.START);
loop();
