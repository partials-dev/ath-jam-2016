metronome = require './metronome'
params = [
    x: 0.5
    y: 0
    sprite: 'standing-stone.fire'
    img: 'img/fire-stone.bmp'
  ,
    x: 1
    y: 0.5
    sprite: 'standing-stone.wind'
    img: 'img/metal-stone.bmp'
  ,
    x: 0.5
    y: 1
    sprite: 'standing-stone.earth'
    img:'img/wood-stone.bmp'
  ,
    x: 0
    y: 0.5
    sprite: 'standing-stone.water'
    img: 'img/water-stone.bmp'
]

spriteKeys = params.map (p) -> p.sprite

standingStones = null
load = (game) ->
  params.forEach (p) ->
    game.load.spritesheet p.sprite, p.img, 8, 8

create = (game) ->
  standingStones = game.add.group()
  params.forEach (p) ->
    stone = standingStones.create p.x, p.y, p.sprite, 1
    stone.scale.setTo 0.025, 0.025
    stone.animations.add 'beat', [2, 1], 4, false
    stone.animations.add 'cast', [3, 1], 4, false
  standingStones.scale.set 300, 300
  standingStones

onBeat = (beat) ->
  standingStones.children[beat].animations.play 'beat'

onCast = (beat) ->
  standingStones.children[beat].animation.play 'cast'

module.exports =
  create: create
  load: load
  onBeat: onBeat
  onCast: onCast
  spriteKeys: spriteKeys
