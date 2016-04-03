spawnPoints = [
    location: x: 200, y: 200
    waves: [
        time: 1000 * 10
        enemies:
          fire: 5
          wind: 3
      ,
        time: 1000 * 20
        enemies:
          fire: 5
          wind: 3
    ]
  ,
    location: x: 100, y: 100
    waves: [
        time: 1000 * 10
        enemies:
          fire: 5
          wind: 3
      ,
        time: 1000 * 20
        enemies:
          fire: 5
          wind: 3
    ]
]

game = null
enemies = null
SPAWN_DELAY = 200

load = (game) ->
  game.load.spritesheet 'enemy.fire', 'img/red.bmp', 1, 1
  game.load.spritesheet 'enemy.water', 'img/blue.bmp', 1, 1
  game.load.spritesheet 'enemy.wind', 'img/silver.bmp', 1, 1
  game.load.spritesheet 'enemy.earth', 'img/green.bmp', 1, 1

spawnGroup = (type, position, number) ->
  spawn = ->
    enemy = enemies.create position.x, position.y, "enemy.#{type}"
    enemy.scale.set 100, 100
  while number >= 0
    setTimeout spawn, number * SPAWN_DELAY
    number -= 1

spawnGroups = (position, wave) ->
  spawnGroup type, position, number for own type, number of wave.enemies

scheduleSpawnPoint = (spawnPoint) ->
  spawnPoint.waves.forEach (wave) ->
    c = -> spawnGroups spawnPoint.location, wave
    setTimeout c, wave.time

scheduleSpawnPoints = ->
  spawnPoints.forEach (spawnPoint) ->
    scheduleSpawnPoint spawnPoint

create = (g) ->
  game = g
  enemies = game.add.group()
  scheduleSpawnPoints()

module.exports =
  load: load
  create: create
