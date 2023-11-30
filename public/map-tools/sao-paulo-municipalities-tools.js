import mapBuildingTools from './map-building-tools.js'
const municipalitiesSvgPath = './map-tools/assets/sp-state-municipalities.svg'

class SaoPauloMunicipalitiesMapBuilder {
  constructor(params) {
    mapBuildingTools.construct(this, params)
  }

  async render() {
    return mapBuildingTools.render(this, {
      codeAttribute: 'citycode',
      svgPath: municipalitiesSvgPath,
    })
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

export { SaoPauloMunicipalitiesMapBuilder }