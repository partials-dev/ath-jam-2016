enemy = require './enemy'
moveEnemies = require './move-enemies'

spawnPoints = [
    location: x: 0.11, y: 0.0
    path: moveEnemies.path1
    waves: [
        time: 1000 * 10
        enemies:
          minion: 5
      ,
        time: 1000 * 40
        enemies:
          minion: 8
      ,
        time: 1000 * 60
        enemies:
          minion: 10
    ]
  ,
    location: x: 1.0, y: 0.33
    path: moveEnemies.path2
    waves: [
        time: 1000 * 20
        enemies:
          minion: 5
      ,
        time: 1000 * 40
        enemies:
          minion: 8
      ,

        time: 1000 * 60
        enemies:
          minion: 5
          boss: 1
    ]
]

game = null
enemies = null
SPAWN_DELAY = 750

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
