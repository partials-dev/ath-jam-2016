params = [
    x: 0.5
    y: 0
    sprite: 'standing-stone.fire'
  ,
    x: 1
    y: 0.5
    sprite: 'standing-stone.metal'
  ,
    x: 0.5
    y: 1
    sprite: 'standing-stone.wood'
  ,
    x: 0
    y: 0.5
    sprite: 'standing-stone.water'
]

create = (game) ->
  standingStones = game.add.group()
  params.forEach (p) ->
    stone = standingStones.create p.x, p.y, p.sprite
    stone.scale.setTo 0.5, 0.5
  standingStones.scale.set 100, 100
  standingStones

module.exports =
  create: create
