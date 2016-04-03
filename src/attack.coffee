fire = (enemy) ->
  console.log 'attacking with fire'

water = (enemy) ->
  console.log 'attacking with water'

earth = (enemy) ->
  console.log 'attacking with earth'

wind = (enemy) ->
  console.log 'attacking with wind'

module.exports =
  fire: fire
  water: water
  wind: wind
  earth: earth
