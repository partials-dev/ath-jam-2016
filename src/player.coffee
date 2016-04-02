player = null
cursors = null
SPEED = 300

create = (game) ->
  # sprite
  player = game.add.sprite 200, 200, 'player'
  player.scale.set 50, 50

  # physics
  game.physics.arcade.enable player
  player.body.bounce.y = 0.2
  player.body.collideWorldBounds = true

  # animation
  player.animations.add 'left', [0, 1, 2], 10, true
  player.animations.add 'right', [3, 4, 5], 10, true
  cursors = game.input.keyboard.createCursorKeys()

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
  pressed

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
    # Stand still
    player.animations.stop()
    player.frame = 4

  #if cursors.left.isDown
    ## Move to the left
    #player.body.velocity.x = -SPEED
    #player.animations.play 'left'
  #else if cursors.right.isDown
    ## Move to the right
    #player.body.velocity.x = SPEED
    #player.animations.play 'right'
  #else if cursors.up.isDown
    #player.body.velocity.y = -SPEED
    #player.animations.play 'up'
  #else if cursors.down.isDown
    #player.body.velocity.y = SPEED
    #player.animations.play 'down'
  #else

  # Allow the player to jump if they are touching the ground.
  #if cursors.up.isDown && player.body.touching.down
      #player.body.velocity.y = -350

module.exports =
  create: create
  move: move
  sprite: player
