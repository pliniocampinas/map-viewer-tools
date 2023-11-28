import { StatesMapBuilder } from './map-tools/brazil-states-tools.js'
import { fillTable } from './commons.js'

let onFillDetails = (details) => {}
let clearDetails = () => document.querySelector('#state-details').innerHTML = '';
(async () => {
  let selectedCode = ''
  const buildParameters = {
    containerSelector: '#states-map', 
    selectedPathClass: 'path--selected',
    onPathClick: (details) => {
      console.log('custom click code:', details)
      selectedCode = selectedCode == details.code? '': details.code
      mapBuilder.toogleSelectPath(details.code)
      if(!selectedCode) {
        document.querySelector('#state-name').innerHTML = 'Select a state'
        clearDetails()
        return
      }
      document.querySelector('#state-name').innerHTML = details.code
      onFillDetails(details)
    }, 
  }

  const mapBuilder = new StatesMapBuilder(buildParameters)
  await mapBuilder.render()

  window.mapBuilder = mapBuilder
  await colorWithGdp()
})()

const colorWithGdp = async () => {
  const sampleData = (await fetch('./sample-data/state-gdp-per-capita-2019.json')
    .then(res => res.json()))
    .map(d => ({
      code: d.sigla_uf,
      value: d.pib_per_capita_brl,
      description: d.unidade_federativa
    }))
  
  fillTable(sampleData)
  window.mapBuilder.colorizeRdYlGn(sampleData)
  clearDetails()
  onFillDetails = ({code}) => document.querySelector('#state-details').innerHTML = `
    <span>GDP: </span>
    <span>${sampleData.find(d => d.code == code)?.value}</span>
  `
}

document.querySelector('.switch-view-button[view-name="state-gdp"]').addEventListener('click', colorWithGdp)