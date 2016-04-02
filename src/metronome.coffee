tempo = 50 # bpm
beatDuration = 60000 / tempo

lastBeatAt = null
lastMeasureStartedAt = null
beat = 0

create = (game) ->
  met = new Phaser.Signal()

  updateBeat = () ->
    met.dispatch(beat)
    lastBeatAt = performance.now()

    if beat is 0
      lastMeasureStartedAt = performance.now()

    if beat is 3
      beat = 0
    else
      beat++

  game.time.events.loop beatDuration, updateBeat
  met

nextBeatAt = ->
  lastBeatAt + beatDuration

nextMeasureStartsAt = ->
  lastMeasureStartedAt + (beatDuration * 4)

progressThroughMeasure = ->
  measureDuration = nextMeasureStartsAt() - lastMeasureStartedAt
  positionInMeasure = performance.now() - lastMeasureStartedAt
  positionInMeasure / measureDuration

msToClosestBeat = (offset) ->
  now = performance.now() + offset
  toLast = now - lastBeatAt
  toNext = now - nextBeatAt()
  if Math.abs(toNext) < Math.abs(toLast)
    toNext
  else
    toLast

isHit = ->
  ms = msToClosestBeat(0)
  Math.abs(ms) < beatDuration / 8

module.exports =
  create: create
  beatDuration: beatDuration
  nextBeatAt: nextBeatAt
  lastBeatAt: -> lastBeatAt
  lastMeasureStartedAt: -> lastMeasureStartedAt
  nextMeasureStartsAt: nextMeasureStartsAt
  progressThroughMeasure: progressThroughMeasure
  msToClosestBeat: msToClosestBeat
  isHit: isHit
