game = null

# enemy lane params
pathIsVisible = 1

path1 = null
path2 = null

getPath1 = (spawnPosition) ->
  path1

getPath2 = (spawnPosition) ->
  path2

scaleLane = (lane) ->
  lane.x = (n * game.width for n in lane.x)
  lane.y = (n * game.height for n in lane.y)
  return lane

load = (game) ->
  game.load.spritesheet 'enemy', 'img/blue.bmp', 1, 1

create = (g, base, s1, s2) ->
  game = g
  bmd1 = game.add.bitmapData(game.width, game.height)
  bmd2 = game.add.bitmapData(game.width, game.height)
  bmd1.addToWorld()
  bmd2.addToWorld()
  path1 =
    x: [s1.x, 0.2, 0.3, 0.3, base.x]
    y: [s1.y, 0.3, 0.4, 0.7, base.y]
  path2 =
    x: [s2.x, 0.3, base.x]
    y: [s2.y, 0.3, base.y]
  plot path1, bmd1
  plot path2, bmd2

plot = (lane, bmd)->
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
  createUpdate: createUpdate
  load: load
  create: create
