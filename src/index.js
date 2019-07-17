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
var keyImages = {};
var snapNegLight = false;
var obelisks = {};
var mask;
const negLightHeight = 50;
const nameTextHeight = 145;
const playerSpawnHeight = 49;

const game = new Phaser.Game(config);

function preload() {

  this.load.path = ('./assets/');
  this.load.image('neglight', 'neg-light.png');
  this.load.image('linkBut', 'linkedin-logo.png');
  this.load.image('gitBut', 'github-logo.png');
  this.load.image('envBut', 'envelope.png');
  this.load.image('leftKeyImg', 'left_key.png');
  this.load.image('rightKeyImg', 'right_key.png');
  this.load.atlas({key: 'player', textureURL: 'sprite.png', atlasURL: 'sprite.json'});
  this.load.image('ground', 'ground.png');
  this.load.atlas({key: 'obelisk', textureURL: 'obelisk.png', atlasURL: 'obelisk.json'});
}

function create() {

    // manually set value to work around bug
  this.cameras.main.backgroundColor.setTo(255,255,255);

  //==== Negative Light
  neglight = this.add.image(game.scale.width/2, game.scale.height/1.63, 'neglight');
  neglight.setDepth(1);
    
  //==== Ground
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

  //==== Player
  player = this.physics.add.sprite(game.scale.width/2 + 5, (ground.y-playerSpawnHeight), 'player');
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, ground);
  player.setDepth(3);

    // Scale Negative Light to Player Sprite
  neglight.displayWidth = (player.width * 10);
  neglight.displayHeight = neglight.displayWidth;  

  //==== mask
  mask = this.add.image(neglight.x, neglight.y, 'neglight').setVisible(false);
  mask.setScale(.75);
  var obeliskMask = new Phaser.Display.Masks.BitmapMask(this, mask);

  //==== Obelisks
  obelisks.tweens = {};

  obelisks.tweens.white = this.tweens.add({
    targets: obelisks, 
    completeDelay: 900,
    repeat: 0,
    paused: true,
    onComplete: () => {
      this.cameras.main.backgroundColor.setTo(255,255,255);
      obelisks.obelisk0.sprite.mask = obeliskMask;
      obelisks.obelisk1.sprite.mask = obeliskMask;
      summaryText.setVisible(false);
      titleText.setVisible(false);
    }
  });

  obelisks.tweens.black = this.tweens.add({
    targets: obelisks, 
    completeDelay: 900,
    repeat: 0,
    paused: true,
    onComplete: () => {
      this.cameras.main.backgroundColor.setTo(0,0,0);
      obelisks.obelisk0.sprite.clearMask();
      obelisks.obelisk1.sprite.clearMask();
      summaryText.setVisible(true);
      titleText.setVisible(true);
    }
  });

    // obelisk0
  obelisks.obelisk0 = {};

  obelisks.obelisk0.sprite = this.physics.add.sprite(player.x - 150, ground.y - 40, 'obelisk');
  obelisks.obelisk0.sprite.mask = obeliskMask;
  obelisks.obelisk0.sprite.body.setSize(100);
  obelisks.obelisk0.sprite.body.setAllowGravity(false);
  obelisks.obelisk0.sprite.body.moves = false;
  obelisks.obelisk0.sprite.setDepth(2);
  this.physics.add.overlap(player, obelisks.obelisk0.sprite, obelisk0Switch, null, this);
  
  function obelisk0Switch (player, obelisk) {
    obelisks.obelisk0.sprite.setInteractive();
  }
  
  obelisks.obelisk0.sprite.on('overlapend', ()=>{
    obelisks.obelisk0.sprite.disableInteractive();
  });

  obelisks.obelisk0.sprite.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown()){
      if(this.cameras.main.backgroundColor.rgba == 'rgba(0,0,0,0)' 
      || this.cameras.main.backgroundColor.rgba == 'rgba(0,0,0,1)'){
        obelisks.obelisk0.sprite.anims.play('obeliskActivate');
        obelisks.tweens.white.play();
      }else{
        obelisks.obelisk0.sprite.anims.play('obeliskActivate');
        obelisks.tweens.black.play();
      }
    }
  });

    // obelisks1
  obelisks.obelisk1 = {};

  obelisks.obelisk1.sprite = this.physics.add.sprite(player.x + 140, ground.y - 40, 'obelisk');
  obelisks.obelisk1.sprite.mask = obeliskMask;
  obelisks.obelisk1.sprite.body.setSize(100);
  obelisks.obelisk1.sprite.body.setAllowGravity(false);
  obelisks.obelisk1.sprite.body.moves = false;
  obelisks.obelisk1.sprite.setDepth(2);
  this.physics.add.overlap(player, obelisks.obelisk1.sprite, obelisk1Switch, null, this);
    
  function obelisk1Switch (player, obelisk) {
    obelisks.obelisk1.sprite.setInteractive();
  }
    
  obelisks.obelisk1.sprite.on('overlapend', ()=>{
    obelisks.obelisk1.sprite.disableInteractive();
  });
  
  obelisks.obelisk1.sprite.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown()){
      if(this.cameras.main.backgroundColor.rgba == 'rgba(0,0,0,0)' 
      || this.cameras.main.backgroundColor.rgba == 'rgba(0,0,0,1)'){
        obelisks.obelisk1.sprite.anims.play('obeliskActivate');
        obelisks.tweens.white.play();
      }else{
        obelisks.obelisk1.sprite.anims.play('obeliskActivate');
        obelisks.tweens.black.play();
      }
    }
  });

  //==== Flicker Effect
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

  //==== Controls
  cursors = this.input.keyboard.createCursorKeys();

  wasd = {
    'w': this.input.keyboard.addKey('W'),
    'a': this.input.keyboard.addKey('A'),
    's': this.input.keyboard.addKey('S'),
    'd': this.input.keyboard.addKey('D')
  }

  //==== Animations
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
    frames: this.anims.generateFrameNames('player', {prefix: 'sprite_idle ', start: 0, end: 5}),
    frameRate: 2.5,
    repeat: -1
  });

  this.anims.create({
    key: 'obeliskActivate',
    frames: this.anims.generateFrameNames('obelisk', {prefix: 'obelisk_activation ', start: 0, end: 8}),
    frameRate: 10,
  });

  this.anims.create({
    key: 'obeliskIdle',
    frames: this.anims.generateFrameNames('obelisk', {prefix: 'obelisk_idle ', start: 0, end: 3}),
    frameRate: 4,
    yoyo: true,
    repeat: -1
  });

  //==== Text and Buttons
  const nameText = this.add.text((player.x - 110), (ground.y - nameTextHeight), "Keith Leon", 
  { fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
    color: '#ffffff',
    fontSize: '45px' 
  }).setDepth(2);

  const titleText = this.add.text( nameText.getCenter().x, (nameText.y - 85), "Futurist & Developer", 
  { fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
    color: '#ffffff',
    fontSize: '30px' 
  }).setVisible(false).setDepth(2);
  titleText.x = (nameText.getCenter().x - titleText.width/2);

  const text = [
    "  I’m a self-motivated generalist",
    "who converts coffee & ideas into",
    "    practical, scalable solutions."
  ]
  const summaryText = this.add.text((player.x - 60), (nameText.y + 145), 
  text, 
  { fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
    color: '#ffffff',
    fontSize: '15px',
  }).setLineSpacing(10).setVisible(false).setDepth(2);;
  summaryText.x = (nameText.getCenter().x - summaryText.width/2);

  const gitBut = this.add.image((nameText.x + (nameText.width / 2)), (nameText.y - 20), 'gitBut');
  gitBut.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown())
      window.location.href = 'https://github.com/keithleon';
  }).setDepth(2);

  const linkBut = this.add.image(gitBut.x - 40, (nameText.y - 20), 'linkBut');
  linkBut.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown())
      window.location.href = 'https://www.linkedin.com/in/keith-leon/';
  }).setDepth(2);

  const envBut = this.add.image(gitBut.x + 40, (nameText.y - 20), 'envBut');
  envBut.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown())
      window.location.href = 'mailto:keithileon@gmail.com';
  }).setDepth(2);

  //==== Control prompt images & Animations
  keyImages.leftKeyImg = this.add.image(gitBut.x - 30, (ground.y + 15), 'leftKeyImg');
  keyImages.leftKeyImg.setDepth(3);
  keyImages.leftKeyMovTween = this.tweens.add({
    targets: keyImages.leftKeyImg,
    x: '-=40',
    ease: 'Cubic',
    duration: 1150,
    repeat: -1,
    yoyo: true
  });

  keyImages.rightKeyImg = this.add.image(gitBut.x + 30, (ground.y + 15), 'rightKeyImg');
  keyImages.rightKeyImg.setDepth(3);
  keyImages.rightKeyTween = this.tweens.add({
    targets: keyImages.rightKeyImg,
    x: '+=40',
    ease: 'Cubic',
    duration: 1150,
    repeat: -1,
    yoyo: true
  });

  keyImages.keyFadeTween = this.tweens.add({
    targets: [keyImages.leftKeyImg, keyImages.rightKeyImg], 
    ease: 'Power2',
    delay: 0,
    alpha: 0,
    repeat: 0,
    paused: true,
    onComplete: () => {
      keyImages.leftKeyImg.destroy(true);
      keyImages.rightKeyImg.destroy(true);
    }
  });
}

function update(){

  mask.x = neglight.x;
  mask.y = neglight.y;

  var deadZone = [player.x-20, player.x+20];

  var pointerAngle  = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.input.activePointer.x, this.input.activePointer.y, player.x, player.y));

  if(pointerAngle >= 35 && pointerAngle <= 155){
    var shouldJump = true;
  }else{
    var shouldJump = false;
  }

  //==== Obelisks

    // Determine If Interactable
    // Treat 'embedded' as 'touching' also

    // obelisk0
  if (obelisks.obelisk0.sprite.body.embedded){
    obelisks.obelisk0.sprite.body.touching.none = false;
  }

  var touching = !obelisks.obelisk0.sprite.body.touching.none;
  var wasTouching = !obelisks.obelisk0.sprite.body.wasTouching.none;
  
  if (!touching && wasTouching){
    obelisks.obelisk0.sprite.emit("overlapend");
  }

      // idle animation
  if (obelisks.obelisk0.sprite.anims.getCurrentKey() === 'obeliskActivate' && obelisks.obelisk0.sprite.anims.getProgress() < 1)
  {}
  else{obelisks.obelisk0.sprite.anims.play('obeliskIdle', true)}

    // obelisk1
  if (obelisks.obelisk1.sprite.body.embedded){
    obelisks.obelisk1.sprite.body.touching.none = false;
  }
  
  var touching1 = !obelisks.obelisk1.sprite.body.touching.none;
  var wasTouching1 = !obelisks.obelisk1.sprite.body.wasTouching.none;
    
  if (!touching1 && wasTouching1){
    obelisks.obelisk1.sprite.emit("overlapend");
  }

      // idle animation
  if (obelisks.obelisk1.sprite.anims.getCurrentKey() === 'obeliskActivate' && obelisks.obelisk1.sprite.anims.getProgress() < 1)
  {}
  else{obelisks.obelisk1.sprite.anims.play('obeliskIdle', true)}

  //==== Controls event handlers & "Attach" neglight to player

    // Remove controls prompt after playermoves
  if(player.body.velocity.x > 0 || player.body.velocity.x < 0){
    keyImages.keyFadeTween.resume();
  }

  if (cursors.left.isDown ||  wasd.a.isDown || 
    ((this.input.activePointer.isDown && (this.input.activePointer.x < player.x)) && 
    (this.input.activePointer.x < deadZone[0] || this.input.activePointer.x > deadZone[1])))
  {
    flickerTimer.paused = true;
    snapNegLight = true;

    neglight.x = player.x + 15;
    neglight.y = player.y - negLightHeight;

    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown || wasd.d.isDown || 
    ((this.input.activePointer.isDown && (this.input.activePointer.x > player.x)) && 
    (this.input.activePointer.x < deadZone[0] || this.input.activePointer.x > deadZone[1])))
  {
    flickerTimer.paused = true;
    snapNegLight = true;

    neglight.x = player.x - 15;
    neglight.y = player.y - negLightHeight;

    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else
  {
    flickerTimer.paused = false;

    if(snapNegLight){
      neglight.x = player.x - 5;
      neglight.y = player.y - negLightHeight;
      snapNegLight = false;
    }

    ellipse.x = player.x - 5;
    ellipse.y = player.y - negLightHeight;

    player.setVelocityX(0);
    player.anims.play('idle', true);
  }
  
  if ((cursors.up.isDown || wasd.w.isDown || 
    (this.input.activePointer.isDown && shouldJump && this.input.activePointer.y < player.y - 30)) && 
    player.body.touching.down)
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

/*
The MIT License

Permission is hereby granted, free of charge, 
to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to 
deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom 
the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice 
shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/