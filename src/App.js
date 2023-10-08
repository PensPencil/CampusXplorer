import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {useJsApiLoader, GoogleMap, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api'
import { SkeletonText } from '@chakra-ui/react/dist/chakra-ui-react.cjs'
import { useRef, useState } from 'react'

const center = {lat: 12.822950, lng: 80.044826}
function App() {

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState( /** @type google.maps.Map */(null))
  const [directionResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const[duration, setDuration] = useState('')


  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */

  const destinationRef = useRef()


  if(!isLoaded){
    return <SkeletonText />
  }

  async function calculateRoute(){
    if(originRef.current.value === '' || destinationRef.current.value === ''){
      return 
    }
    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService()
    const results = await directionService.route({
      origin: originRef.current.value, 
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute(){
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }


  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>

        <GoogleMap center={center} zoom = {17} mapContainerStyle={{width: '100%', height: '100%'}} onLoad={(map) => setMap(map)}> 

        <Marker position={center} />
        {directionResponse && <DirectionsRenderer directions={directionResponse}/>}

          
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4} 
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='modal'
      >
        <HStack spacing={4}>
          <Autocomplete>
          <Input type='text' placeholder='Origin' ref = {originRef}/>
          </Autocomplete>

          <Autocomplete>
          <Input type='text' placeholder='Destination' ref = {destinationRef}/>
          </Autocomplete>
          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
