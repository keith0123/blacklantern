import Phaser from "phaser";
import './styles/index.css';

const config = {
  title: "Keith Leon",
  banner: false,
  pixelArt: true,
  backgroundColor: 0xffffff,
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  autoCenter: true,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var ground;
var cursors;
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
  light = this.lights.addLight(400, 300, 200).setColor(0xffffff).setIntensity(10);
  ellipse = new Phaser.Geom.Ellipse(light.x, light.y, 20, 20);

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
  const bg = this.add.image(400, 300, "bg");
  bg.setPipeline('Light2D');

  // Ground
  ground = this.physics.add.staticSprite(400, 400, 'ground');

  // Player
  player = this.physics.add.sprite(400, 354, 'player');
  player.setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();
  // player.setPipeline('Light2D');
  this.physics.add.collider(player, ground);

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

  // "Attach" light to player
  ellipse.x = player.x - 5;
  ellipse.y = player.y -70;

  // controls event handlers
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
      player.anims.play('right', true);
  }
  else
  {
      player.setVelocityX(0);
      player.anims.play('turn', true);
  }
  
  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-120);
  }
}