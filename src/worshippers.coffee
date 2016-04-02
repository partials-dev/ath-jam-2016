metronome = require './metronome'

whichSprite = (i) ->
  if i is 2
    'worshipper.elder'
  else
    'worshipper'

toX = (i, period = 4) ->
  Math.PI * 2 * (i/period)

params = (x: Math.sin(toX i), y: Math.cos(toX i), sprite: whichSprite(i) for i in [0..3])

worshippers = null
create = (game) ->
  worshippers = game.add.group()
  params.forEach (p) ->
    worshipper = worshippers.create p.x, p.y, p.sprite, 1
    worshipper.scale.set 0.5, 0.5
    if p.sprite is 'worshipper.elder'
      worshipper.animations.add 'cast', [3, 1], 5, false
  worshippers.pivot.set 0, 0
  worshippers.scale.set 100, 100
  worshippers.position.set 170, 160

move = (i) ->
  angle = i * 360
  worshippers.angle = angle
  if metronome.isHit()
    worshippers.scale.set 110, 110
  else
    worshippers.scale.set 90, 90
  worshippers.forEach (worshipper) ->
    worshipper.angle = -angle

embiggen = true
cast = ->
  elder = worshippers.children[2]
  # cast at 30 fps, don't loop
  elder.animations.play 'cast', false
  #embiggen = !embiggen
  #if embiggen
    #elder.scale.set 0.7
  #else
    #elder.scale.set 0.3

module.exports =
  create: create
  move: move
  cast: cast
