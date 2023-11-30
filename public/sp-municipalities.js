import { SaoPauloMunicipalitiesMapBuilder } from './map-tools/sao-paulo-municipalities-tools.js'
import { fillTable, clearColorLabels, fillColorLabels } from './commons.js'

let onFillDetails = (details) => {}
let clearDetails = () => document.querySelector('#city-details').innerHTML = ''

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

const mapBuilder = new SaoPauloMunicipalitiesMapBuilder(buildParameters);
mapBuilder
  .render()
  .then(() => colorWithGdp())

const colorWithGdp = async () => {
  const codesAndStates = (await fetch('./sample-data/municipalities-codes.json')
    .then(res => res.json()))
    .filter(d => d.stateAcronym === 'SP')
    .map(d => d.code)
    
  const sampleData = (await fetch('./sample-data/gdp-per-capita-2019.json')
    .then(res => res.json()))
    .filter(d => codesAndStates.includes(d.code))
    .map(d => ({
      code: d.code,
      value: d.gdpPerCapitaBrl2019
    }))
  
  fillTable(sampleData)
  mapBuilder.colorizeRdYlGn(sampleData)
  clearColorLabels()
  clearDetails()
  onFillDetails = ({code}) => document.querySelector('#city-details').innerHTML = `
    <span>GDP: </span>
    <span>${sampleData.find(d => d.code == code)?.value}</span>
  `
}

document.querySelector('.switch-view-button[view-name="gdp-per-capita"]').addEventListener('click', colorWithGdp)