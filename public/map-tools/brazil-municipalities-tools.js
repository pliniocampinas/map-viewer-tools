const statesSvgPath = './map-tools/assets/brazil-states.svg'
const municipalitiesSvgPath = './map-tools/assets/municipalities-map.svg'

async function renderMap(selector) {
  // const img = document.createElement('img')
  // img.src = municipalitiesSvgPath
  const path = await fetch(municipalitiesSvgPath).then(res => res.text())
  console.log('path', path)
  document.querySelector(selector).innerHTML = path
}