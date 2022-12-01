import { useEffect, useState } from 'react'
import './App.scss'
import Species from './Species'

const API_URL = 'https://swapi.dev/api/films/2/'
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
}
const CM_TO_IN_CONVERSION_RATIO = 2.54

const fetchSpeciesData = async (URL) => {
  const speciesURLs = await fetch(URL)
    .then(resp => resp.json())
    .then(data => data.species)
  return Promise.all(
    speciesURLs.map(url => fetch(url.replace('http:', 'https:'))
      .then(resp => resp.json()))
  )
}

const convertCMtoIN = (cm) => {
  return Math.round(cm / CM_TO_IN_CONVERSION_RATIO) + '\"'
}

function App() {
  const [speciesData, setSpeciesData] = useState()
  const [loadingMessage, setLoadingMessage] = useState('Loading Species Listing...')

  useEffect(() => {
    fetchSpeciesData(API_URL)
      .then(data => setSpeciesData(data))
      .catch(e => {
        setLoadingMessage('Error trying to load Species Listing!')
        throw new Error(e)
      })
  }, [])

  const getSpecimenImage = (spacimenName) => {
    return SPECIES_IMAGES[
      spacimenName.toLowerCase().split(/[\s']+/)[0]
    ]
  }

  if (speciesData) {
    const species = speciesData.map(
      ({ name, classification, designation, language, average_height, films }) => {
        const height = average_height !== "n/a" ? convertCMtoIN(average_height) : average_height
        const image = getSpecimenImage(name)
        const numFilms = films.length
        const props = { name, classification, designation, language, height, image, numFilms }

        return <Species key={name} {...props} />
      })

    return (
      <div className="App">
        <h1>Empire Strikes Back - Species Listing</h1>
        <div className="App-species">
          {species}
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <h1>{loadingMessage}</h1>
    </div>
  )

}

export default App
