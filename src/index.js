import Phaser from "phaser";
import './styles/index.scss';

const config = {
  title: "Keith Leon",
  banner: false,
  pixelArt: true,
  backgroundColor: 0xffffff,
  type: Phaser.AUTO,
  parent: "game",
  disableContextMenu: true,
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
const negLightHeight = 50; // 70
const nameTextHeight = 50; // 20
const playerSpawnHeight = 100; // 20

const game = new Phaser.Game(config);

function preload() {

  this.load.path = ('./assets/');
  this.load.image('neglight', 'neg-light.png');
  this.load.image('linkBut', 'linkedin-logo.png');
  this.load.image('gitBut', 'github-logo.png');
  this.load.image('envBut', 'envelope.png');
  this.load.atlas({key: 'player', textureURL: 'sprite.png', atlasURL: 'sprite.json'});
  this.load.image('ground', 'ground.png');
}

function create() {

  // Negative Light
  neglight = this.add.image(game.scale.width/2, game.scale.height/1.63, 'neglight');
    
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
  player = this.physics.add.sprite(game.scale.width/2, (ground.y-playerSpawnHeight), 'player');
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, ground);
  // player.setSize(33, 91)

  // Scale Negative Light to Player Sprite
  neglight.displayWidth = (player.width * 10);
  neglight.displayHeight = neglight.displayWidth;

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

  // Animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNames('player', {prefix:'sprite_run_l ', start: 0, end: 5}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNames('player', {prefix:'sprite_run_r ', start: 0, end: 5}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNames('player', {prefix: 'sprite_idle ',start: 0, end: 5}),
    frameRate: 2.5,
    repeat: -1
  });

  // Text and Buttons
  const nameText = this.add.text((player.x - 110), (player.y - nameTextHeight), "Keith Leon", 
  { fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
  color: '#ffffff',
  fontSize: '45px' 
  })

  const gitBut = this.add.image((nameText.x + (nameText.width / 2)), (nameText.y - 20), 'gitBut');
  gitBut.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown())
      window.location.href = 'https://github.com/keithleon';
  })

  const linkBut = this.add.image(gitBut.x - 40, (nameText.y - 20), 'linkBut');
  linkBut.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown())
      window.location.href = 'https://www.linkedin.com/in/keith-leon/';
  })

  const envBut = this.add.image(gitBut.x + 40, (nameText.y - 20), 'envBut');
  envBut.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown())
      window.location.href = 'mailto:keithileon@gmail.com';
  })
}

function update(){

  var deadZone = [player.x-20, player.x+20];

  var pointerAngle  = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.input.activePointer.x, this.input.activePointer.y, player.x, player.y));

  if(pointerAngle >= 45 && pointerAngle <= 145){
    var shouldJump = true;
  }else{
    var shouldJump = false;
  }

  // Controls event handlers
  // "Attach" neglight to player
  if (cursors.left.isDown ||  wasd.a.isDown || 
    ((this.input.activePointer.isDown && (this.input.activePointer.x < player.x)) && (this.input.activePointer.x < deadZone[0] || this.input.activePointer.x > deadZone[1]))
    )
  {
    flickerTimer.paused = true;

    neglight.x = player.x - 20;
    neglight.y = player.y - negLightHeight;

    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown || wasd.d.isDown || 
    ((this.input.activePointer.isDown && (this.input.activePointer.x > player.x)) && (this.input.activePointer.x < deadZone[0] || this.input.activePointer.x > deadZone[1]))
    )
  {
    flickerTimer.paused = true;

    neglight.x = player.x + 20;
    neglight.y = player.y - negLightHeight;

    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else
  {
    flickerTimer.paused = false;

    ellipse.x = player.x - 5;
    ellipse.y = player.y - negLightHeight;

    player.setVelocityX(0);
    // player.anims.play('turn', true);
    player.anims.play('idle', true);
  }
  
  if ((cursors.up.isDown || wasd.w.isDown || (this.input.activePointer.isDown && shouldJump && this.input.activePointer.y < player.y - 30)) && player.body.touching.down)
  {
    flickerTimer.paused = true;

    player.setVelocityY(-120);
  }

  if(!player.body.touching.down)
  {
    flickerTimer.paused = true;

    neglight.y = player.y - negLightHeight;
  }
}