const fillTable = (cities) => {
  const tableBody = document.querySelector('#sample-table tbody')
  tableBody.innerHTML = ''
  cities.forEach(city => {
    const row = document.createElement('tr')
    const codeCell = document.createElement('td')
    codeCell.innerHTML = city.code
    const valueCell = document.createElement('td')
    valueCell.innerHTML = city.value
    row.appendChild(codeCell)
    row.appendChild(valueCell)
    tableBody.appendChild(row)
  })
}

const clearColorLabels = () => {
  const labelsContainer = document.querySelector('#map-labels')
  labelsContainer.innerHTML = '-- No Labels --'
}

const fillColorLabels = (colorMap) => {
  const labelsContainer = document.querySelector('#map-labels')
  labelsContainer.innerHTML = ''

  Object.keys(colorMap).forEach(key => {
    const lineDiv = document.createElement('div')
    lineDiv.classList.add('line-div')

    const labelDiv = document.createElement('div')
    labelDiv.classList.add('label-div')
    labelDiv.innerHTML = key
    lineDiv.appendChild(labelDiv)

    const colorDiv = document.createElement('div')
    colorDiv.classList.add('color-div')
    colorDiv.style.backgroundColor = colorMap[key]
    lineDiv.appendChild(colorDiv)
    labelsContainer.appendChild(lineDiv)
  })
}