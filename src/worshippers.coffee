whichSprite = (i) ->
  if i is 0
    'worshipper.elder'
  else
    'worshipper'

toX = (i, period = 4) ->
  Math.PI * 2 * (i/period)

params = (x: Math.cos(toX i), y: Math.sin(toX i), sprite: whichSprite(i) for i in [0..3])
positions = (x: Math.cos(toX i, 100), y: Math.sin(toX i, 100) for i in [0..100])

worshippers = null
create = (game) ->
  worshippers = game.add.group()
  params.forEach (p) ->
    worshipper = worshippers.create p.x, p.y, p.sprite
    worshipper.scale.set 0.5, 0.5
    if p.sprite is 'worshipper.elder'
      worshipper.animations.add 'cast'
  worshippers.pivot.set 0, 0
  worshippers.scale.set 100, 100
  worshippers.position.set 100, 100

move = (i) ->
  angle = i * 360
  worshippers.angle = angle
  worshippers.forEach (worshipper) ->
    worshipper.angle = -angle

cast = ->
  elder = worshippers.children[0]
  # cast at 30 fps, don't loop
  elder.animations.play 'cast', 30, false

module.exports =
  create: create
  move: move
  cast: cast
