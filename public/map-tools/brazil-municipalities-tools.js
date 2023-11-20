const statesSvgPath = './map-tools/assets/brazil-states.svg'
const municipalitiesSvgPath = './map-tools/assets/municipalities-map.svg'

class MunicipalitiesMapBuilder {
  constructor({containerSelector, onPathClick, selectedPathClass}) {
    this.rendered = false
    this.containerSelector = containerSelector
    this.selectedPathClass = selectedPathClass
    this.onPathClick = onPathClick || (({code, description}) => {
      console.log('click code:', code, 'description', description)
    })
    this.pathElementsMap = {}
    this.selectedCode = ''
  }

  async render() {
    if(this.rendered) {
      console.error('Render map error: maps can only be rendered once')
      return
    }

    const path = await fetch(municipalitiesSvgPath).then(res => res.text())
    const containerElement = document.querySelector(this.containerSelector)
    if(!containerElement) {
      console.error('Render map error: container element not found')
      return
    }
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
      this.pathElementsMap[code] = pathElement
    }

    // Finally
    this.rendered = true
    return this
  }

  toogleSelectPath(code) {
    if(this.selectedCode) {
      const prevElement = this.pathElementsMap[this.selectedCode]
      prevElement.classList.remove(this.selectedPathClass)
    }

    if(this.selectedCode == code) {
      this.selectedCode = ''
      return
    }

    const element = this.pathElementsMap[code]
    if(!element) {
      console.warn('Path not found for code', code)
    }
    if(!this.selectedPathClass) {
      console.warn('There is no selectedPathClass configured')
    }
    element.classList.add(this.selectedPathClass)
    this.selectedCode = code
  }
}