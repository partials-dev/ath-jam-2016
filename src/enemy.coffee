game = null
enemies = null

healthByType =
  minion: 5
  boss: 50

damageByElement =
  fire: 5
  wind: 1
  water: 0
  earth: 3

FREEZE_DURATION = 5000

load = (game) ->
  game.load.atlasJSONArray('enemy.minion', 'img/enemies/minion.png', 'img/enemies/minion.json')
  game.load.atlasJSONArray('enemy.boss', 'img/enemies/boss.png', 'img/enemies/boss.json')

create = (g) ->
  game = g
  enemies = game.add.physicsGroup Phaser.Physics.ARCADE

spawn = (type, path) ->
  key = "enemy.#{type}"
  enemy = enemies.create path[0].x, path[0].y, key
  #enemy.scale.set 10, 10
  enemy.scale.set 0.1, 0.1
  enemy.update = createUpdate enemy, path
  enemy.speed = 1
  enemy.health = healthByType[type]
  enemy.unfreezeTime = 0
  enemy.hitBy = (element) ->
    console.log "hit by #{element}"
    enemy.health -= damageByElement[element]
    console.log "health: #{enemy.health}"
    if element is 'water'
      enemy.unfreezeTime = game.time.time + FREEZE_DURATION
    enemy.kill() if enemy.health <= 0
  enemy

updateEnemies = ->
  enemies.forEach (enemy) ->
    enemy.update()

createUpdate = (enemy, path) ->
  pi = 0
  enemyAlive = true
  i = 0
  update = ->
    i++
    unfrozen = game.time.time > enemy.unfreezeTime
    if unfrozen
      i = i % 3
    else
      i = i % 6
    return unless i is 0
    if pi < path.length
      enemy.x = path[pi].x - 20
      enemy.y = path[pi].y - 50
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
  enemies: -> enemies
  updateEnemies: updateEnemies
