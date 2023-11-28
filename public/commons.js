export const fillTable = (items) => {
  const tableBody = document.querySelector('#sample-table tbody')
  tableBody.innerHTML = ''
  items.forEach(item => {
    const row = document.createElement('tr')
    const codeCell = document.createElement('td')
    codeCell.innerHTML = item.code
    const valueCell = document.createElement('td')
    valueCell.innerHTML = item.value
    row.appendChild(codeCell)
    row.appendChild(valueCell)
    tableBody.appendChild(row)
  })
}

export const clearColorLabels = () => {
  const labelsContainer = document.querySelector('#map-labels')
  labelsContainer.innerHTML = '-- No Labels --'
}

export const fillColorLabels = (colorMap, onClick) => {
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
    lineDiv.addEventListener('click', () => onClick(key))
    lineDiv.setAttribute('code', key)
    labelsContainer.appendChild(lineDiv)
  })
}