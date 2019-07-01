import Phaser from "phaser";
import bg from "./assets/bg.png"
import bg_n from "./assets/bg_n.png"
import sprites from "./assets/sprites.png"
import sprites_n from "./assets/sprites_n.png"
import spritesJSON from "./assets/sprites.json"
import ground_png from "./assets/ground.png"
import './styles/index.css';

const config = {
  title: "Keith Leon",
  banner: false,
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

const game = new Phaser.Game(config);

function preload() {

  // this.load.path = ('./assets/');
  this.load.image("bg", [bg,bg_n]);
  this.load.atlas('player', sprites, spritesJSON);
  this.load.image('ground', ground_png)
}

function create() {
  // Lights
  this.lights.enable().setAmbientColor(0x000000);
  var light = this.lights.addLight(400, 300, 200).setColor(0xffffff).setIntensity(10);

  // Background
  const bg = this.add.image(400, 300, "bg");
  bg.setPipeline('Light2D');

  // Ground
  ground = this.physics.add.staticGroup();
  ground.create(400, 300, 'ground');

  // Player
  player = this.physics.add.sprite(400, 400, 'player');
  player.setBounce(0.2);
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
    frames: this.anims.generateFrameNames('player', {prefix:'sprite', start: 78, end: 82}),
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
      player.setVelocityY(-330);
  }
}