enemy = require './enemy'
moveEnemies = require './move-enemies'

spawnPoints = [
    location: x: 0.2, y: 0.0
    path: moveEnemies.path1
    waves: [
        time: 0 #1000 * 10
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
    location: x: 1.0, y: 0.3
    path: moveEnemies.path2
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
SPAWN_DELAY = 500

load = (game) ->
  enemy.load game

spawnGroup = (type, number, path) ->
  s = -> enemy.spawn type, path
  while number >= 0
    setTimeout s, number * SPAWN_DELAY
    number -= 1

spawnGroups = (wave, path) ->
  spawnGroup type, number, path for own type, number of wave.enemies

scheduleSpawnPoint = (spawnPoint) ->
  path = spawnPoint.path()
  spawnPoint.waves.forEach (wave) ->
    c = -> spawnGroups wave, path
    setTimeout c, wave.time

scheduleSpawnPoints = ->
  spawnPoints.forEach (spawnPoint) ->
    scheduleSpawnPoint spawnPoint

create = (g) ->
  game = g
  enemy.create game
  scheduleSpawnPoints()

update = ->
  enemy.updateEnemies()

module.exports =
  load: load
  create: create
  update: update
  s1: spawnPoints[0].location
  s2: spawnPoints[1].location
