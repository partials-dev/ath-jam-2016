metronome = require './metronome'
duplicates = require './duplicates'
health = require './health'
mana = require './mana'
music = require './music'
midi = require './midi'

player = null
cursors = null
SPEED = 300
onCast = new Phaser.Signal()
manaCosts =
  fire: 10
  water: 10
  earth: 10
  wind: 10

cast = ->
  hitInfo = metronome.isHit()
  if hitInfo?
    onCast.dispatch hitInfo...
    music.cast.succeed()
  else
    music.cast.fail()

load = (game) ->

  game.load.atlasJSONArray('player', 'img/player/player.png', 'img/player/player.json')

create = (game) ->
  # sprite
  player = game.add.sprite 0.3 * game.width, 0.8 * game.height, 'player'
  player.anchor.set 0.5
  player.scale.set 0.1, 0.1

  health.create game
  mana.create game

  # physics
  game.physics.arcade.enable player
  player.body.bounce.y = 0.2
  player.body.collideWorldBounds = true

  # animation
  player.animations.add 'left', [0, 1], 10, true
  player.animations.add 'right', [0, 1], 10, true
  player.animations.add 'up', [0, 1], 10, true
  player.animations.add 'down', [0, 1], 10, true
  #player.animations.add 'resting', [0, 1, 2], 10, true
  #player.animations.play 'resting'

  player.animations.add 'summon.fire', [3, 4, 5], 10, false
  player.animations.add 'summon.water', [3, 4, 5], 10, false
  player.animations.add 'summon.wind', [3, 4, 5], 10, false
  player.animations.add 'summon.earth', [3, 4, 5], 10, false
  cursors = game.input.keyboard.createCursorKeys()

  # input
  space = game.input.keyboard.addKey Phaser.Keyboard.SPACEBAR
  space.onDown.add cast
  midi.signal.add (pitch) ->
    switch pitch
      when 48 then cast()
        
movementScheme =
  left:
    dimension: 'x'
    speed: -SPEED
  right:
    dimension: 'x'
    speed: SPEED
  up:
    dimension: 'y'
    speed: -SPEED
  down:
    dimension: 'y'
    speed: SPEED

getPressedDirections = (keys) ->
  pressed = (direction for own direction, key of keys when key.isDown)
  midiPressed = (direction for own direction, key of midi.movementState when key.isDown )
  
  pressed.concat midiPressed
  

move = ->
  player.body.velocity.x = 0
  player.body.velocity.y = 0

  # scale back speed in each direction
  # if player is pressing more than
  # one key
  pressed = getPressedDirections cursors
  divisor = pressed.length + 1
  pressed.forEach (direction) ->
    scheme = movementScheme[direction]
    player.body.velocity[scheme.dimension] = scheme.speed / divisor
    player.animations.play direction
  if pressed.length is 0
    # stand still
    player.animations.stop()
    player.frame = 4

summon = (element) ->
  cost = manaCosts[element]
  if (mana.current() - cost) > 0
    #player.animations.play "summon.#{element}"
    mana.spend cost
    duplicates.spawn element, player.body.center
    music.duplicateSummoned element

module.exports =
  load: load
  create: create
  move: move
  sprite: -> player
  onCast: onCast
  summon: summon
