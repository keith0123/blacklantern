import Phaser from "phaser";
import './styles/index.scss';

const config = {
  title: "Keith Leon",
  banner: false,
  pixelArt: true,
  backgroundColor: 0x000000,
  type: Phaser.AUTO,
  parent: "game",
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  autoCenter: true, 
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game',
    width: '100%',
    height: 600
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var ground;
var cursors;
var leftKey;
var rightKey;
var light;
var ellipse;

const game = new Phaser.Game(config);

function preload() {

  this.load.path = ('./assets/');
  this.load.image("bg", ['bg.png','bg_n.png']);
  this.load.multiatlas('player', 'sprites.json');
  this.load.image('ground', 'ground.png')
}

function create() {

  // Lights
  this.lights.enable().setAmbientColor(0x000000);
  light = this.lights.addLight(game.scale.height/2, game.scale.width/2, Math.max((game.scale.width/10), 150)).setColor(0xffffff).setIntensity(10);
  ellipse = new Phaser.Geom.Ellipse(light.x, light.y, 15, 15);

  // Flicker Effect
  this.time.addEvent({
    delay: 250,
    callback: function ()
    {
        Phaser.Geom.Ellipse.Random(ellipse, light);
    },
    callbackScope: this,
    repeat: -1
  });

  // Background
  const bg = this.add.image(game.scale.width/2, game.scale.height/2, "bg");
  bg.displayWidth = game.scale.width;
  bg.setPipeline('Light2D');

  // Ground
  ground = this.physics.add.staticSprite(game.scale.width/2, game.scale.height/1.45, 'ground');
  ground.displayWidth = game.scale.width;
  ground.refreshBody();

  // Player
  player = this.physics.add.sprite(game.scale.width/2, game.scale.height/1.57, 'player');
  player.setCollideWorldBounds(true);
  // player.setPipeline('Light2D');
  this.physics.add.collider(player, ground);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();
  leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

  // Animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNames('player', {prefix:'sprite', start: 72, end: 77}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: this.anims.generateFrameNames('player', {prefix:'sprite', start: 1}),
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNames('player', {prefix:'sprite', start: 78, end: 83}),
    frameRate: 10,
    repeat: -1
  });

  // Text Overlay
  const contentBoxOverlay = document.createElement("div");
  contentBoxOverlay.setAttribute("class", "content-box_overlay");
  contentBoxOverlay.innerHTML = "Keith Leon";
  document.getElementById("game").appendChild(contentBoxOverlay);
}

function update(){

  // Controls event handlers
  // "Attach" light to player
  if (cursors.left.isDown)
  {
    ellipse.x = player.x - 20;
    ellipse.y = player.y - 70;

    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
    ellipse.x = player.x + 20;
    ellipse.y = player.y - 70;

    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else
  {
    ellipse.x = player.x - 5;
    ellipse.y = player.y - 70;

    player.setVelocityX(0);
    player.anims.play('turn', true);
  }
  
  if (cursors.up.isDown && player.body.touching.down)
  {
    player.setVelocityY(-120);
  }

  // Force Light position ahead of player when they move
  if(Phaser.Input.Keyboard.JustDown(leftKey))
  {
    light.x = player.x - 20;
    light.y = player.y - 70;
  }
  else if(Phaser.Input.Keyboard.JustDown(rightKey))
  {
    light.x = player.x + 20;
    light.y = player.y - 70;
  }
}