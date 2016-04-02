params = [
    x: 0.5
    y: 0
    sprite: 'standing-stones.fire'
  ,
    x: 1
    y: 0.5
    sprite: 'standing-stones.metal'
  ,
    x: 0.5
    y: 1
    sprite: 'standing-stones.wood'
  ,
    x: 0
    y: 0.5
    sprite: 'standing-stones.water'
]

standingStones = null
create = (game) ->
  standingStones = game.add.group()
  params.forEach (p) ->
    stone = standingStones.create p.x, p.y, p.sprite, 1
    stone.scale.setTo 0.5, 0.5
    stone.animations.add 'beat', [2, 1], 4, false 
    stone.animations.add 'cast', [3, 1], 4, false
  standingStones.scale.set 100, 100
  standingStones

onBeat = (beat) ->
  standingStones.children[beat].animations.play 'beat'

onCast = () ->
  standingStones.children[beat].animation.play 'cast'

module.exports =
  create: create
  onBeat: onBeat
  onCast: onCast
