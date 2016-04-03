bmd = null
enemy = null
path = []
game = null
health = 10

# enemy lane params
pathIsVisible = 1
base =
  x: 0.3
  y: 1
spawn1 =
  x: 0.2
  y: 0.0
spawn2 =
  x: 1.0
  y: 0.3

path1 =
    x: [spawn1.x, 0.2, 0.3, 0.3, base.x]
    y: [spawn1.y, 0.3, 0.4, 0.7, base.y]

path2 =
  x: [spawn2.x, 0.3, base.x]
  y: [spawn2.y, 0.3, base.y]

getPath1 = (spawnPosition) ->
  path1

getPath2 = (spawnPosition) ->
  path2

scaleLane = (l) ->
  lane.x = (n * game.width for n in lane.x)
  lane.y = (n * game.height for n in lane.y)
  return l

load = (game) ->
  game.load.spritesheet 'enemy', 'img/blue.bmp', 1, 1

create = (g, s1, s2) ->
  game = g
  bmd = game.add.bitmapData(game.width, game.height)
  spawn1 = s1
  spawn2 = s2
  bmd.addToWorld()
  enemy = game.add.sprite(0, 0, 'enemy')
  enemy.scale.set 50, 50
  enemy.anchor.set 0.5
  enemy.damage = 2
  enemy.speed = 10
  plot path1
  plot path2

plot = (lane)->
  bmd.clear()
  path = []
  x = 1 / game.width
  i = 0
  scaleLane lane

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
  return lane

createUpdate = (enemy, path) ->
  pi = 0
  enemyAlive = true
  update = ->
    if pi < path.length
      enemy.x = path[pi].x
      enemy.y = path[pi].y
      pi += enemy.speed
      undefined
    else if enemyAlive
      enemyAlive = false
      enemy.destroy()
      console.log "Health: #{health}"
      enemy.damage

module.exports =
  update: update
  load: load
  create: create
