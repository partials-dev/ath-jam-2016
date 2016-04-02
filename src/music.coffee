metronome = require './metronome'
game = null

duplicates = {}
background = null

create = (g) ->
  game = g
  background = game.add.audio 'background'
  duplicates.fire = game.add.audio 'duplicate.fire', 0
  duplicates.water = game.add.audio 'duplicate.water', 0
  duplicates.wind = game.add.audio 'duplicate.wind', 0
  duplicates.earth = game.add.audio 'duplicate.earth', 0

onBeat = (beat) ->
  if beat is 0
    background.play()
    sound.play() for own element, sound of duplicates

load = (game) ->
  game.load.audio 'background', 'sound/test.mp3'
  game.load.audio 'duplicate.fire', 'sound/dup-1.mp3'
  game.load.audio 'duplicate.wind', 'sound/dup-2.mp3'
  game.load.audio 'duplicate.earth', 'sound/dup-3.mp3'
  game.load.audio 'duplicate.water', 'sound/dup-4.mp3'

duplicateSummoned = (element) ->
  duplicates[element].fadeIn 50

module.exports =
  load: load
  create: create
  onBeat: onBeat
  duplicateSummoned: duplicateSummoned
