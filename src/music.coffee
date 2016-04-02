game = null
create = (g) ->
  game = g

onBeat = (beat) ->
  if beat is 0
    game.sound.play 'background'

module.exports =
  create: create
  onBeat: onBeat
