metronome = require './metronome'

params = [
    x: 0
    y: -100
    sprite: 'standing-stone.fire'
    img: 'img/stones/fire-stone.png'
    json: 'img/stones/fire-stone.json'
  ,
    x: 100
    y: 0
    sprite: 'standing-stone.wind'
    img: 'img/stones/wind-stone.png'
    json: 'img/stones/wind-stone.json'
  ,
    x: 0
    y: 100
    sprite: 'standing-stone.earth'
    img:'img/stones/earth-stone.png'
    json: 'img/stones/earth-stone.json'
  ,
    x: -100
    y: 0
    sprite: 'standing-stone.water'
    img: 'img/stones/water-stone.png'
    json: 'img/stones/water-stone.json'
]

spriteKeys = params.map (p) -> p.sprite

standingStones = null
load = (game) ->
  params.forEach (p) ->
    game.load.atlasJSONArray(p.sprite, p.img, p.json)

create = (game) ->
  standingStones = game.add.group()
  center =
    x: 0.28 * game.width
    y: 0.7 * game.height
  console.log center
  params.forEach (p) ->
    stone = standingStones.create center.x + p.x, center.y + p.y, p.sprite, 1
    stone.scale.setTo 0.2, 0.2
    stone.animations.add 'beat', [2, 1], 4, false
    stone.animations.add 'cast', [3, 1], 4, false
  #standingStones.scale.set 0.2, 0.2
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
