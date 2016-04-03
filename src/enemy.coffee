game = null
enemies = null

load = (game) ->
  game.load.spritesheet 'enemy.fire', 'img/red.bmp', 1, 1
  game.load.spritesheet 'enemy.water', 'img/blue.bmp', 1, 1
  game.load.spritesheet 'enemy.wind', 'img/silver.bmp', 1, 1
  game.load.spritesheet 'enemy.earth', 'img/green.bmp', 1, 1

create = (g) ->
  game = g
  enemies = game.add.group()

spawn = (position, type, path) ->
  key = "enemy.#{type}"
  enemy = enemies.create position.x, position.y, key
  enemy.scale.set 100, 100
  enemy.update = createUpdate enemy, path
  enemy

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
  load: load
  create: create
  spawn: spawn
