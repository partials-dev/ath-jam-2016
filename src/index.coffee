Phaser = require './phaser'

GAME_WIDTH = $(window).width()
GAME_HEIGHT = $(window).height()

preload = ->
  game.load.image 'background', 'img/background.png'
  game.load.image 'bmo', 'img/bmo-sad.png'
create = ->
  game.add.sprite 0, 0, 'bmo'
update = ->

game = new Phaser.Game GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, '', preload: preload, create: create, update: update
