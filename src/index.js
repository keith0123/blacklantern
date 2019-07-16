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
var pedestal;
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
  this.load.atlas({key: 'pedestal', textureURL: 'pedestal.png', atlasURL: 'pedestal.json'});
}

function create() {

  // manually set value to work around bug
  this.cameras.main.backgroundColor.setTo(255,255,255);

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
  player.setDepth(2);

  // mask
  mask = this.add.image(neglight.x, neglight.y, 'neglight').setVisible(false);
  mask.setScale(.75);

  // pedestal
  pedestal = this.physics.add.sprite(player.x - 150, ground.y - 15, 'pedestal');
  var pedMask = new Phaser.Display.Masks.BitmapMask(this, mask);
  pedestal.mask = pedMask;
  pedestal.body.setSize(100);
  pedestal.body.setAllowGravity(false);
  pedestal.body.moves = false;
  pedestal.setDepth(1);
  var pedOverlap = this.physics.add.overlap(player, pedestal, pedSwitch, null, this);
  
  function pedSwitch (player, pedestal) {
    pedestal.setInteractive();
  }
  
  pedestal.on('overlapend', ()=>{
    pedestal.disableInteractive();
  });

  pedestal.setInteractive({ useHandCursor: true })
  .on('pointerdown', (pointer) =>{
    if(!pointer.rightButtonDown()){
      if(this.cameras.main.backgroundColor.rgba == 'rgba(0,0,0,0)' 
      || this.cameras.main.backgroundColor.rgba == 'rgba(0,0,0,1)'){
        this.cameras.main.backgroundColor.setTo(255,255,255);
        pedestal.mask = pedMask;
      }else{
        this.cameras.main.backgroundColor.setTo(0,0,0);
        pedestal.clearMask();
      }
      pedestal.anims.play('pedActivate');
    }
  });

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
    frames: this.anims.generateFrameNames('player', {prefix: 'sprite_idle ', start: 0, end: 5}),
    frameRate: 2.5,
    repeat: -1
  });

  this.anims.create({
    key: 'pedActivate',
    frames: this.anims.generateFrameNumbers('pedestal', {start: 3, end: 0}),
    frameRate: 10,
  });

  // Text and Buttons
  const nameText = this.add.text((player.x - 110), (ground.y - nameTextHeight), "Keith Leon", 
  { fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
    color: '#ffffff',
    fontSize: '45px' 
  })

  const titleText = this.add.text( nameText.getCenter().x, (nameText.y - 200), "Futurist & Developer", 
  { fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
    color: '#ffffff',
    fontSize: '30px' 
  })
  titleText.x = (nameText.getCenter().x - titleText.width/2);

  const text = [
    "I’m a self-motivated generalist",
    "who converts coffee & ideas into",
    "into practical, scalable solutions."
  ]
  const summaryText = this.add.text((player.x - 60), (nameText.y + 250), 
  text, 
  { fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
    color: '#ffffff',
    fontSize: '20px',
  }).setLineSpacing(10);
  summaryText.x = (nameText.getCenter().x - summaryText.width/2);

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

  // Control prompt images & Animations
  keyImages.leftKeyImg = this.add.image(gitBut.x - 50, (ground.y + 100), 'leftKeyImg');
  keyImages.leftKeyMovTween = this.tweens.add({
    targets: keyImages.leftKeyImg,
    x: '-=40',
    ease: 'Cubic', // 'Cubic', 'Elastic', 'Bounce', 'Back', 'Linear', Power2
    duration: 1150,
    repeat: -1,
    yoyo: true
  });

  keyImages.rightKeyImg = this.add.image(gitBut.x + 50, (ground.y + 100), 'rightKeyImg');
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

  // pedestal

    // Treat 'embedded' as 'touching' also
  if (pedestal.body.embedded){
    pedestal.body.touching.none = false;
  }

  var touching = !pedestal.body.touching.none;
  var wasTouching = !pedestal.body.wasTouching.none;
  
  if (!touching && wasTouching){
    pedestal.emit("overlapend");
  }

  // Remove controls prompt after playermoves
  if(player.body.velocity.x > 0 || player.body.velocity.x < 0){
    keyImages.keyFadeTween.resume();
  }

  // Controls event handlers
  // "Attach" neglight to player
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