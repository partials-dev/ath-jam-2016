game = null
enemies = null

load = (game) ->
  game.load.atlasJSONArray('enemy.minion', 'img/enemies/minion.png', 'img/enemies/minion.json')
  game.load.atlasJSONArray('enemy.boss', 'img/enemies/boss.png', 'img/enemies/boss.json')

create = (g) ->
  game = g
  enemies = game.add.group()

spawn = (type, path) ->
  key = "enemy.#{type}"
  enemy = enemies.create path[0].x, path[0].y, key
  #enemy.scale.set 10, 10
  enemy.update = createUpdate enemy, path
  enemy.speed = 1
  enemy

window.spawn = spawn

updateEnemies = ->
  enemies.forEach (enemy) ->
    enemy.update()

createUpdate = (enemy, path) ->
  pi = 0
  enemyAlive = true
  i = 0
  update = ->
    i++
    i = i % 3
    return unless i is 0
    if pi < path.length
      enemy.x = path[pi].x
      enemy.y = path[pi].y
      pi += enemy.speed
      undefined
    else if enemyAlive
      enemyAlive = false
      enemy.destroy()
      enemy.damage

module.exports =
  load: load
  create: create
  spawn: spawn
  updateEnemies: updateEnemies
