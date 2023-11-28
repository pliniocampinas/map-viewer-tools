import mapBuildingTools from './map-building-tools.js'

const statesSvgPath = './map-tools/assets/brazil-states.svg'

class StatesMapBuilder {
  constructor({containerSelector, onPathClick, selectedPathClass}) {
    this.rendered = false
    this.containerSelector = containerSelector
    this.selectedPathClass = selectedPathClass
    this.onPathClick = onPathClick || (details => {
      console.log('click details:', details)
    })
    this.pathElementsMap = {}
    this.currentData = []
    this.selectedCodes = []
  }

  async render() {
    if(this.rendered) {
      console.error('Render map error: maps can only be rendered once')
      return
    }

    const containerElement = document.querySelector(this.containerSelector)
    if(!containerElement) {
      console.error('Render map error: container element not found')
      return
    }

    this.pathElementsMap = await mapBuildingTools.render({
      containerElement,
      codeAttribute: 'statecode',
      onPathClick: this.onPathClick,
      svgPath: statesSvgPath,
    })

    // Finally
    this.rendered = true
    return this
  }

  togglePath(code) {
    return mapBuildingTools.togglePath(this, code)
  }

  colorizeRdYlGn(codesAndValues) {
    this.currentData = codesAndValues
    mapBuildingTools.colorizeRdYlGn(this.pathElementsMap, codesAndValues)
  }

  colorizeCategories(codesAndValues, { customPallete } = {}) {
    this.currentData = codesAndValues
    const colorMap = mapBuildingTools.colorizeCategories(this.pathElementsMap, codesAndValues, {customPallete})
    return colorMap
  }
}

export { StatesMapBuilder }