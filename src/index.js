import Phaser from "phaser";
import bg from "./assets/bg.png"
import bg_n from "./assets/bg_n.png"
import sprites from "./assets/sprites.png"
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
var platforms;
var cursors;

const game = new Phaser.Game(config);

function preload() {

  this.load.image("bg", [bg,bg_n]);
  this.load.spritesheet('player', sprites, {frameWidth: 196, frameHeight: 196});
  
}

function create() {
  this.lights.enable().setAmbientColor(0x000000);
  var light = this.lights.addLight(400, 300, 200).setColor(0xffffff).setIntensity(2);

  const bg = this.add.image(400, 300, "bg");
  bg.setPipeline('Light2D');

  player = this.physics.add.sprite(100, 400, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  cursors = this.input.keyboard.createCursorKeys();

  // Create Text Overlay
  const contentBoxOverlay = document.createElement("div");
  contentBoxOverlay.setAttribute("class", "content-box_overlay");
  contentBoxOverlay.innerHTML = "Keith Leon";
  document.getElementById("game").appendChild(contentBoxOverlay);
}

function update(){
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
  }
  else
  {
      player.setVelocityX(0);
  }
  
  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-330);
  }
}