Phaser = require './phaser'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()

preload = ->
  game.load.image 'background', 'img/background.png'
  game.load.image 'bmo', 'img/bmo-sad.png'

DELAY = 100
create = ->
  game.add.sprite 0, 0, 'bmo'
  i = 0
  quarterNote = ->
    i++
    currentTime = performance.now()
    timeElapsed = currentTime - startTime
    difference = timeElapsed - (i * DELAY)
    console.log "Difference: #{difference}"

  game.time.events.loop DELAY, quarterNote
  startTime = performance.now()

update = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update

