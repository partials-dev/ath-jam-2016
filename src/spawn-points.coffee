enemy = require './enemy'

spawnPoints = [
    location: x: 0.2, y: 0.0
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
    location: x: 1.0, y: 0.3
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
  enemy.load game

spawnGroup = (type, position, number, path) ->
  s = -> enemy.spawn position, type, path
  while number >= 0
    setTimeout s, number * SPAWN_DELAY
    number -= 1

spawnGroups = (position, wave, path) ->
  spawnGroup type, position, number, path for own type, number of wave.enemies

scheduleSpawnPoint = (spawnPoint) ->
  #path = ???
  spawnPoint.waves.forEach (wave) ->
    c = -> spawnGroups spawnPoint.location, wave, path
    setTimeout c, wave.time

scheduleSpawnPoints = ->
  spawnPoints.forEach (spawnPoint) ->
    scheduleSpawnPoint spawnPoint

create = (g) ->
  game = g
  enemy.create game
  scheduleSpawnPoints()

update = ->


module.exports =
  load: load
  create: create
  s1: spawnPoints[0].location
  s2: spawnPoints[1].location
