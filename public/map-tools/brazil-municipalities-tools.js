const statesSvgPath = './map-tools/assets/brazil-states.svg'
const municipalitiesSvgPath = './map-tools/assets/municipalities-map.svg'

class MunicipalitiesMapBuilder {
  constructor() {
    this.rendered = false
    this.selector = ''
  }

  async renderMap(selector) {
    if(this.rendered) {
      console.error('Render map error: maps can only be rendered once')
      return
    }

    const path = await fetch(municipalitiesSvgPath).then(res => res.text())
    document.querySelector(selector).innerHTML = path

    this.rendered = true
  }
}