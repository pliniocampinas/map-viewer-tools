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

const toggleLabel = (key) => {
  const label = document.querySelector(`.block-div[label-key="${key}"]`)
  console.log('label', label)
  if(!label.hasAttribute('label-selected')) {
    label.setAttribute('label-selected', true)
    return
  }
  label.removeAttribute('label-selected')
}

export const fillColorLabels = (colorMap, onClick) => {
  const labelsContainer = document.querySelector('#map-labels')
  labelsContainer.innerHTML = ''

  Object.keys(colorMap).forEach(key => {
    const blockDiv = document.createElement('div')
    blockDiv.classList.add('block-div')

    const labelDiv = document.createElement('div')
    labelDiv.classList.add('label-div')
    labelDiv.innerHTML = key
    blockDiv.appendChild(labelDiv)

    const colorDiv = document.createElement('div')
    colorDiv.classList.add('color-div')
    colorDiv.style.backgroundColor = colorMap[key]
    blockDiv.appendChild(colorDiv)
    blockDiv.addEventListener('click', () => onClick(key, () => toggleLabel(key)))
    blockDiv.setAttribute('label-key', key)
    labelsContainer.appendChild(blockDiv)
  })
}