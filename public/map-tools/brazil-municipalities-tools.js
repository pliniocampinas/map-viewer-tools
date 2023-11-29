import mapBuildingTools from './map-building-tools.js'
const municipalitiesSvgPath = './map-tools/assets/municipalities-map.svg'

class MunicipalitiesMapBuilder {
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

  selectPaths(codes) {
    return mapBuildingTools.selectPaths(this, codes)
  }

  clearSelectedPaths(codes) {
    mapBuildingTools.clearSelectedPaths(this, codes)
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

export { MunicipalitiesMapBuilder }