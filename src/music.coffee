metronome = require './metronome'
game = null

duplicates = {}
cast = {}
background = null

create = (g) ->
  game = g
  background = game.add.audio 'background'

  # duplicates
  duplicates.fire = game.add.audio 'duplicate.fire', 0
  duplicates.water = game.add.audio 'duplicate.water', 0
  duplicates.wind = game.add.audio 'duplicate.wind', 0
  duplicates.earth = game.add.audio 'duplicate.earth', 0

  # casting
  cast.succeed = game.add.audio 'cast.succeed'
  cast.fail = game.add.audio 'cast.fail'

dupBeat = 0
dupLength = (4 * 16) - 1

bgBeat = 0
bgLength = (64 * 4) - 1
onBeat = (beat) ->
  if dupBeat is 0
    sound.play() for own element, sound of duplicates

  if bgBeat is 0
    background.play()

  dupBeat++
  dupBeat = dupBeat % dupLength

  bgBeat++
  bgBeat = bgBeat % bgLength

load = (game) ->
  game.load.audio 'background', 'sound/bg.wav'

  # duplicates
  game.load.audio 'duplicate.fire', 'sound/fire.wav'
  game.load.audio 'duplicate.wind', 'sound/wind.wav'
  game.load.audio 'duplicate.earth', 'sound/earth.wav'
  game.load.audio 'duplicate.water', 'sound/water.wav'

  # casting
  game.load.audio 'cast.succeed', 'sound/cast.mp3'
  game.load.audio 'cast.fail', 'sound/cast-fail.mp3'

duplicateSummoned = (element) ->
  duplicates[element].fadeIn 50

castSucceed = ->
  cast.succeed.play()

castFail = ->
  cast.fail.play()

module.exports =
  load: load
  create: create
  onBeat: onBeat
  duplicateSummoned: duplicateSummoned
  cast:
    succeed: castSucceed
    fail: castFail
