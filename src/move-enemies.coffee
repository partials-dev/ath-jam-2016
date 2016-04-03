bmd = null
enemy = null
pi = 0
path = []
game = null
health = 10

# enemy lane params
pathIsVisible = 1
base =
  x: 0.5
  y: 0
spawn =
  x: 0.5
  y: 1
lane =
  x: [spawn.x, 0.7, 0.3, base.x]
  y: [spawn.y, 0.6, 0.4, base.y]

scaleLane = (lane)->
  lane.x = (n * game.width for n in lane.x)
  lane.y = (n * game.height for n in lane.y)
  console.log lane

create = (g) ->
  game = g
  bmd = game.add.bitmapData(game.width, game.height)
  bmd.addToWorld()
  enemy = game.add.sprite(0, 0, 'enemy')
  enemy.scale.set 50, 50
  enemy.anchor.set 0.5
  plot()

plot = ->
  bmd.clear()
  path = []
  x = 1 / game.width
  i = 0
  scaleLane(lane)
  while i <= 1
    px = game.math.catmullRomInterpolation(lane.x, i)
    py = game.math.catmullRomInterpolation(lane.y, i)
    path.push
      x: px
      y: py
    bmd.rect px, py, 1, 1, "rgba(255, 255, 255, #{pathIsVisible})"
    i += x
  p = 0
  while p < lane.x.length
    bmd.rect lane.x[p] - 3, lane.y[p] - 3, 6, 6, "rgba(255, 0, 0, #{pathIsVisible})"
    p++

update = ->
  enemy.x = path[pi].x
  enemy.y = path[pi].y
  pi++
  if pi >= path.length
    enemy.kill()
    health -= 1
    console.log health

module.exports =
  update: update
  create: create
