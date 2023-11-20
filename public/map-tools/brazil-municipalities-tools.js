const statesSvgPath = './map-tools/assets/brazil-states.svg'
const municipalitiesSvgPath = './map-tools/assets/municipalities-map.svg'

class MunicipalitiesMapBuilder {
  constructor() {
    this.rendered = false
    this.selector = ''
    this.onPathClick = ({code, description}) => {
      console.log('click code:', code, 'description', description)
    }
  }

  async renderMap(selector) {
    if(this.rendered) {
      console.error('Render map error: maps can only be rendered once')
      return
    }

    const path = await fetch(municipalitiesSvgPath).then(res => res.text())
    const containerElement = document.querySelector(selector)
    if(!containerElement) {
      console.error('Render map error: container element not found')
      return
    }
    this.selector = selector
    containerElement.innerHTML = path

    for (const pathElement of containerElement.querySelectorAll('path')) {
      const code = pathElement.getAttribute('citycode')
      const description = pathElement.getAttribute('description')
      if(!code) {
        continue
      }
      pathElement.addEventListener('click', () => this.onPathClick({
        code,
        description
      }))
    }

    // Finally
    this.rendered = true
  }
}

// const getPathElement = (code: string) => {
//   return chartContainerElement.value?.querySelector(`path[citycode="${code}"]`)
// }