import Phaser from "phaser";
import './styles/index.scss';

const config = {
  title: "Keith Leon",
  banner: false,
  pixelArt: true,
  backgroundColor: 0xffffff,
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
    height: '100%'
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  audio: {
    noAudio: true
  }
};

var player;
var ground;
var cursors;
var wasd;
var neglight;
var ellipse;
var flickerTimer;

const game = new Phaser.Game(config);

function preload() {

  this.load.path = ('./assets/');
  this.load.image("neglight", 'neg-light.png')
  this.load.multiatlas('player', 'sprites.json');
  this.load.image('ground', 'ground.png')
}

function create() {

  // Negative Light
  neglight = this.add.image(game.scale.width/2, game.scale.height/1.63, 'neglight');
  // neglight.displayWidth = Math.max((game.scale.width/5.5), 240);

  // Ground
  if(window.matchMedia("(max-height: 399px)").matches){
    ground = this.physics.add.staticSprite(game.scale.width/2, game.scale.height/1.33, 'ground');
  }else if(window.matchMedia("(max-height: 799px)").matches){
    ground = this.physics.add.staticSprite(game.scale.width/2, game.scale.height/1.5, 'ground');
  }else if(window.matchMedia("(max-height: 1199px)").matches){
    ground = this.physics.add.staticSprite(game.scale.width/2, game.scale.height/1.65, 'ground');
  }else if(window.matchMedia("(min-height: 1200px)").matches){
    ground = this.physics.add.staticSprite(game.scale.width/2, game.scale.height/2, 'ground');
  }

  ground.displayWidth = game.scale.width;
  ground.refreshBody();

  // Player
  player = this.physics.add.sprite(game.scale.width/2, (ground.y-20), 'player');
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, ground);

  // Scale Negative Light to Player Sprite
  neglight.displayWidth = (player.height * 9);
  neglight.displayHeight = neglight.displayWidth;

  // // Lighting
  // player.setPipeline('Light2D');
  // this.lights.enable().setAmbientColor(0xffffff);
  // var lamp = this.lights.addLight(neglight.x, neglight.y, 200).setColor(0xffffff).setIntensity(5);

  // Flicker Effect
  ellipse = new Phaser.Geom.Ellipse(neglight.x, neglight.y, 5, 5);
  flickerTimer = this.time.addEvent({
    delay: 300,
    callback: function ()
    {
        Phaser.Geom.Ellipse.Random(ellipse, neglight);
    },
    callbackScope: this,
    repeat: -1
  });

  // Controls
  cursors = this.input.keyboard.createCursorKeys();

  wasd = {
    'w': this.input.keyboard.addKey('W'),
    'a': this.input.keyboard.addKey('A'),
    's': this.input.keyboard.addKey('S'),
    'd': this.input.keyboard.addKey('D')
  }

  // this.input.on(Phaser.Input.Events.POINTER_MOVE, function(pointer){
  //   console.log('test')
  // })

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

  // HTML Overlay
  const gitLink = document.createElement('a');
  gitLink.setAttribute('href', 'https://github.com/keithleon');
  const gitImg = document.createElement('img');
  gitImg.setAttribute('src', 'assets/github-logo.png');
  gitLink.appendChild(gitImg);

  const linkdenLink = document.createElement('a');
  linkdenLink.setAttribute('href', 'https://www.linkedin.com/in/keith-leon/');
  const linkdenImg = document.createElement('img');
  linkdenImg.setAttribute('src', 'assets/linkedin-logo.png');
  linkdenLink.appendChild(linkdenImg);

  const envelLink = document.createElement('a');
  envelLink.setAttribute('href', 'mailto:keithileon@gmail.com');
  const envelImg = document.createElement('img');
  envelImg.setAttribute('src', 'assets/envelope.png');
  envelLink.appendChild(envelImg);

  const iconOverlay = document.createElement("div");
  iconOverlay.setAttribute("class", "icon_overlay");

  iconOverlay.appendChild(linkdenLink);
  iconOverlay.appendChild(gitLink);
  iconOverlay.appendChild(envelLink);

  const contentBoxOverlay = document.createElement("div");
  contentBoxOverlay.setAttribute("class", "content-box_overlay");

  const nameText = document.createElement('div')
  nameText.setAttribute('class', 'nameText');
  nameText.innerHTML ="Keith Leon";

  contentBoxOverlay.appendChild(iconOverlay);
  contentBoxOverlay.appendChild(nameText);
  document.getElementById("game").appendChild(contentBoxOverlay);
}

function update(){

  // Controls event handlers
  // "Attach" neglight to player
  if (cursors.left.isDown ||  wasd.a.isDown)
  {
    flickerTimer.paused = true;

    neglight.x = player.x - 20;
    neglight.y = player.y - 70;

    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown || wasd.d.isDown)
  {
    flickerTimer.paused = true;

    neglight.x = player.x + 20;
    neglight.y = player.y - 70;

    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else
  {
    flickerTimer.paused = false;

    ellipse.x = player.x - 5;
    ellipse.y = player.y - 70;

    player.setVelocityX(0);
    player.anims.play('turn', true);
  }
  
  if ((cursors.up.isDown || wasd.w.isDown) && player.body.touching.down)
  {
    flickerTimer.paused = true;

    player.setVelocityY(-120);
  }

  if(!player.body.touching.down)
  {
    flickerTimer.paused = true;

    neglight.y = player.y - 70;
  }
}