tempo = 120 # bpm
beatDuration = 60000 / tempo

lastBeatAt = null
lastMeasureStartedAt = null
beat = -1

nextBeat = ->
  if beat is 3
    0
  else
    beat + 1

create = (game) ->
  met = new Phaser.Signal()

  updateBeat = () ->
    beat = nextBeat()
    met.dispatch(beat)
    lastBeatAt = performance.now()
    if beat is 0
      lastMeasureStartedAt = lastBeatAt

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

closestBeat = (offset = 0) ->
  now = performance.now() + offset
  toLast = now - lastBeatAt
  toNext = now - nextBeatAt()
  if Math.abs(toNext) < Math.abs(toLast)
    beat: nextBeat(), ms: toNext
  else
    beat: beat, ms: toLast

# if close enough to beat
# return that beat's number
# else return undefined
isHit = ->
  closest = closestBeat()
  if Math.abs(closest.ms) < beatDuration / 6
    [closest.beat, closest.ms]

module.exports =
  create: create
  beatDuration: beatDuration
  nextBeatAt: nextBeatAt
  lastBeatAt: -> lastBeatAt
  lastMeasureStartedAt: -> lastMeasureStartedAt
  nextMeasureStartsAt: nextMeasureStartsAt
  progressThroughMeasure: progressThroughMeasure
  closestBeat: closestBeat
  isHit: isHit
