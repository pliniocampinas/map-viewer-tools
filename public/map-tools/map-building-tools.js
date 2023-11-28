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

export default {
  async render({
    containerElement,
    onPathClick,
    codeAttribute,
    svgPath,
  }) {
    const svgText = await fetch(svgPath).then(res => res.text())
    containerElement.innerHTML = svgText

    const pathElementsMap = {}

    for (const pathElement of containerElement.querySelectorAll('path')) {
      const code = pathElement.getAttribute(codeAttribute)
      if(!code) {
        continue
      }
      pathElement.addEventListener('click', () => onPathClick({
        code,
        pathElement,
      }))
      pathElementsMap[code] = pathElement
    }

    return pathElementsMap
  },

  colorizeRdYlGn(pathElementsMap, codesAndValues) {
    const RdYlGn10 = ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]
    const deciles = getDeciles(codesAndValues.map(d => d.value))
    codesAndValues.forEach(element => {
      const decileIndex = getDecileIndex(deciles, element.value)
      pathElementsMap[element.code]?.setAttribute("fill", RdYlGn10[decileIndex])
    })
  },

  colorizeCategories(pathElementsMap, codesAndValues, { customPallete } = {}) {
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
      pathElementsMap[element.code]?.setAttribute("fill", color)
    })

    return colorMap
  },

  toogleSelectPath(builderInstance, code) {
    if(builderInstance.selectedCode) {
      const prevElement = builderInstance.pathElementsMap[builderInstance.selectedCode]
      prevElement.classList.remove(builderInstance.selectedPathClass)
    }

    if(builderInstance.selectedCode == code) {
      builderInstance.selectedCode = ''
      return
    }

    const element = builderInstance.pathElementsMap[code]
    if(!element) {
      console.warn('Path not found for code', code)
    }
    if(!builderInstance.selectedPathClass) {
      console.warn('There is no selectedPathClass configured')
    }
    element.classList.add(builderInstance.selectedPathClass)
    builderInstance.selectedCode = code
  },
}