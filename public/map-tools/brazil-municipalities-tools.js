const statesSvgPath = './map-tools/assets/brazil-states.svg'
const municipalitiesSvgPath = './map-tools/assets/municipalities-map.svg'

const getDeciles = (values) => {
  const orderedValues = values.slice().sort((a,b) => a - b)
  const deciles = []
  for (let nthDecile = 1; nthDecile <= 10; nthDecile++) {
    const decileIndex = Math.ceil(orderedValues.length * (nthDecile / 10)) - 1
    deciles.push(orderedValues[decileIndex])
  }

  return deciles
}

const getDecileIndex = (decils, value) => {
  for (let index = 0; index < decils.length; index++) {
    const decilUpperValue = decils[index];
    if(value <= decilUpperValue) {
      return index
    }
  }
  return 0
}

class MunicipalitiesMapBuilder {
  constructor({containerSelector, onPathClick, selectedPathClass}) {
    this.rendered = false
    this.containerSelector = containerSelector
    this.selectedPathClass = selectedPathClass
    this.onPathClick = onPathClick || ((code, {description}) => {
      console.log('click code:', code, 'description', description)
    })
    this.pathElementsMap = {}
    this.selectedCode = ''
    this.currentData = []
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
      pathElement.addEventListener('click', () => this.onPathClick(code, {
        description,
        ...(this.currentData?.find(d => d.code == code)??{})
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

  colorizeRdYlGn(codesAndValues) {
    this.currentData = codesAndValues
    const RdYlGn10 = ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]
    const deciles = getDeciles(codesAndValues.map(d => d.value))
    codesAndValues.forEach(element => {
      const decileIndex = getDecileIndex(deciles, element.value)
      this.pathElementsMap[element.code]?.setAttribute("fill", RdYlGn10[decileIndex])
    })
  }

  colorizeCategories(codesAndValues, { customPallete } = {}) {
    this.currentData = codesAndValues
    const categoricalPallete = customPallete?? ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]
    const uniqueValues = [...new Set(codesAndValues.map(d => d.value))]
    if(uniqueValues.length > categoricalPallete.length) {
      console.warn('There are more unique values than colors in the pallete, there will be repeated colors')
    }

    const colorMap = {}
    uniqueValues.forEach((v, i) => colorMap[v] = categoricalPallete[i%categoricalPallete.length])

    codesAndValues.forEach((element, index) => {
      const color = colorMap[element.value]
      if (!color) {
        return
      }
      this.pathElementsMap[element.code]?.setAttribute("fill", color)
    })

    return colorMap
  }
}