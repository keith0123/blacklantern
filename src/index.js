import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import './styles/index.css';

const config = {
  gameTitle: "Keith Leon",
  type: Phaser.AUTO,
  parent: "game",
  width: 800,
  height: 600,
  autoCenter: true,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("logo", logoImg);
}

function create() {
  const logo = this.add.image(400, 150, "logo");

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });

  // Create Text Overlay
  const contentBoxOverlay = document.createElement("div");
  contentBoxOverlay.setAttribute("class", "content-box_overlay");
  contentBoxOverlay.innerHTML = "Keith Leon";
  document.getElementById("game").appendChild(contentBoxOverlay);
}