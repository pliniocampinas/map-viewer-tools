import { MunicipalitiesMapBuilder } from './map-tools/brazil-municipalities-tools.js'
import { fillTable, clearColorLabels, fillColorLabels } from './commons.js'

let onFillDetails = (details) => {}
let clearDetails = () => document.querySelector('#city-details').innerHTML = '';
(async () => {
  const buildParameters = {
    containerSelector: '#municipalities-map', 
    selectedPathClass: 'path--selected',
    onPathClick: (details) => {
      console.log('custom click details:', details)
      if(!mapBuilder.togglePath(details.code)) {
        document.querySelector('#city-name').innerHTML = 'Select a city'
        clearDetails()
        return
      }
      document.querySelector('#city-name').innerHTML = details.pathElement.getAttribute('description')
      onFillDetails(details)
    }, 
  }

  const mapBuilder = new MunicipalitiesMapBuilder(buildParameters)
  await mapBuilder.render()

  window.mapBuilder = mapBuilder
  await colorWithGdp()
})()

const colorWithGdp = async () => {
  const sampleData = (await fetch('./sample-data/gdp-per-capita-2019.json')
    .then(res => res.json()))
    .map(d => ({
      code: d.code,
      value: d.gdpPerCapitaBrl2019
    }))
  
  fillTable(sampleData)
  window.mapBuilder.colorizeRdYlGn(sampleData)
  clearColorLabels()
  clearDetails()
  onFillDetails = ({code}) => document.querySelector('#city-details').innerHTML = `
    <span>GDP: </span>
    <span>${sampleData.find(d => d.code == code)?.value}</span>
  `
}

const colorWithMunicipalitiesStates = async () => {
  const sampleData = (await fetch('./sample-data/municipalities-codes.json')
    .then(res => res.json()))
    .map(d => ({
      code: d.code,
      value: d.stateAcronym
    }))

  fillTable(sampleData)
  const customPallete = ["#b30000", "#7c1158", "#4421af", "#1a53ff", "#0d88e6", "#00b7c7", "#5ad45a", "#8be04e", "#ebdc78"]
  const colorMap = window.mapBuilder.colorizeCategories(sampleData, {customPallete})
  console.log('colorMap', colorMap)
  fillColorLabels(colorMap, (code) => {
    console.log('code', code)
    const codes = sampleData
      .filter(d => d.value == code)
      .map(d => d.code)
    window.mapBuilder.selectPaths(codes)
    console.log('codes', codes)
  })
  clearDetails()
  onFillDetails = ({code}) => document.querySelector('#city-details').innerHTML = `
    <span>State: </span>
    <span>${sampleData.find(d => d.code == code)?.value}</span>
  `
}

document.querySelector('.switch-view-button[view-name="gdp-per-capita"]').addEventListener('click', colorWithGdp)
document.querySelector('.switch-view-button[view-name="municipalities-states"]').addEventListener('click', colorWithMunicipalitiesStates)