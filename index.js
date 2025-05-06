let frames = 0;
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

function hasCollision(flappyBird, ground) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const groundY = ground.y;
  return flappyBirdY >= groundY;
}

function createGround() {
  const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const groundMovement = 1;
      const repeat = ground.width / 2;
      const movement = ground.x - groundMovement;
      ground.x = movement % repeat;
    },
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

  return ground;
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
      if (hasCollision(flappyBird, globals.ground)) {
        changeScreen(SCREENS.GAME_OVER);
        flappyBird.y = 50;
        return;
      }
      flappyBird.speed = flappyBird.speed + flappyBird.gravity;
      flappyBird.y = flappyBird.y + flappyBird.speed;
    },
    movements: [
      { spriteX: 0, spriteY: 0 }, // wings up
      { spriteX: 0, spriteY: 26 }, // wings middle
      { spriteX: 0, spriteY: 52 }, // wings down
    ],
    actualFrame: 0,
    updateFrame() {
      const frameInterval = 10;
      const passInterval = frames % frameInterval;
      if(passInterval === 0){
        const incrementBase = 1;
        const increment = incrementBase + flappyBird.actualFrame;
        const repeatBase = flappyBird.movements.length;
        flappyBird.actualFrame = increment % repeatBase;
      }
    },
    draw() {
      flappyBird.updateFrame();
      const {spriteX, spriteY} = flappyBird.movements[flappyBird.actualFrame];
      context.drawImage(
        sprites,
        spriteX,
        spriteY,
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

const gameOverMessage = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: canvas.width / 2 - 226 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      gameOverMessage.sX,
      gameOverMessage.sY,
      gameOverMessage.w,
      gameOverMessage.h,
      gameOverMessage.x,
      gameOverMessage.y,
      gameOverMessage.w,
      gameOverMessage.h
    );
  },
};
const globals = {};
let activeScreen = {};

function changeScreen(newScreen) {
  activeScreen = newScreen;

  if (newScreen.starts) {
    newScreen.starts();
  }
}

function createPipe() {
  const pipe = {
    width: 52,
    height: 400,
    ground: {
      spriteX: 0,
      spriteY: 169,
    },
    sky: {
      spriteX: 52,
      spriteY: 169,
    },
    space: 80,
    
    draw() {
      pipe.pairs.forEach(function(pair){
      const yRandom = pair.y;
      const spaceBetweenPipes = 90;

      const pipeSkyX = pair.x;
      const pipeSkyY = yRandom;
        context.drawImage(
          sprites,
          pipe.sky.spriteX, pipe.sky.spriteY,
          pipe.width, pipe.height,
          pipeSkyX, pipeSkyY,
          pipe.width, pipe.height,
        )
  
        const pipeGroundX = pair.x;
        const pipeGroundY = pipe.height + spaceBetweenPipes + yRandom;
        context.drawImage(
          sprites,
          pipe.ground.spriteX, pipe.ground.spriteY,
          pipe.width, pipe.height,
          pipeGroundX, pipeGroundY,
          pipe.width, pipe.height,
        )

        pair.pipeSky = {
          x: pipeSkyX,
          y: pipe.height + pipeSkyY,
        }
        pair.groundPipe = {
          x: pipeGroundX,
          y: pipeGroundY,
        }

      })
    },
    hasCollisionWithFlappyBird(pair) {
      const flappyBirdHead = globals.flappyBird.y;
      const flappyBirdFeet = globals.flappyBird.y + globals.flappyBird.height;
      if(globals.flappyBird.x + globals.flappyBird.width >= pair.x) {
        if(flappyBirdHead <= pair.pipeSky.y) {
          return true;
        }
        if(flappyBirdFeet >= pair.groundPipe.y) {
          return true;
        }
      }
      return false;
    },
    pairs: [],
    update() {
      const passed100frames = frames % 100 === 0;
      if(passed100frames){
        pipe.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        })
      }

      pipe.pairs.forEach(function(pair){
        pair.x = pair.x - 2;

        if(pipe.hasCollisionWithFlappyBird(pair)) {
          changeScreen(SCREENS.GAME_OVER)
        }

        if(pair.x + pipe.width <= 0) {
          pipe.pairs.shift();
        }
      })


    }
  };
  return pipe;
};

function createScore() {
  const score = {
    points: 0,
    draw() {
      context.font = '35px "VT323"';
      context.textAlign = 'right';
      context.fillStyle= "white";
      context.fillText(`${score.points}`, canvas.width - 10, 35);
    },
    update(){
      const frameInterval = 20;
      const passInterval = frames % frameInterval;
      if(passInterval) {
        score.points = score.points + 1;
      }
    },

  }

  return score;
}

const SCREENS = {
  START: {
    starts() {
      globals.flappyBird = createFlappyBird();
      globals.ground = createGround();
      globals.pipe = createPipe();
    },
    draw() {
      background.draw();
      globals.flappyBird.draw();
      globals.ground.draw();
      startScreen.draw();
    },
    click() {
      changeScreen(SCREENS.GAME);
    },
    update() {
      globals.ground.update();
    },
  },
  GAME: {
    starts() {
      globals.score = createScore();
    },
    draw() {
      background.draw();
      globals.pipe.draw();
      globals.ground.draw();
      globals.flappyBird.draw();
      globals.score.draw();
    },
    click() {
      globals.flappyBird.jump();
    },
    update() {
      globals.pipe.update();
      globals.ground.update();
      globals.flappyBird.update();
    },
  },
  GAME_OVER: {
    draw(){
      gameOverMessage.draw();
    },
    update(){},
    click(){
      changeScreen(SCREENS.START);
    }
  }
};

function loop() {
  activeScreen.draw();
  activeScreen.update();
  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (activeScreen.click) {
    activeScreen.click();
  }
});

changeScreen(SCREENS.START);
loop();
