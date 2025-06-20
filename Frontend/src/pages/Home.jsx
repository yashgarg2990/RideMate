import React  , {useEffect , useRef , useState} from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
 import LocationSearchPanel from '../components/LocationSearchPanel'
 import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import LiveTracking from '../components/LiveTracking'
import { useContext } from 'react'
import {UserDataContext} from '../context/UserContext'
import { useNavigate } from 'react-router-dom'


function Home() {
  const [pickup , setPickup] = useState('')
  const [destination , setDestination] = useState('')
  const [panelOpen , setPanelOpen] = useState(false)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null) 
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)

  const [ activeField, setActiveField ] = useState(null)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
  
  const [vehicleType  , setVehicleType] = useState(null)
  const [fare, setFare] = useState({})
  const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
  const [ waitingForDriver, setWaitingForDriver ] = useState(false)
  const [ride , setRide] = useState(null)
  const [isFindingTrip, setIsFindingTrip] = useState(false)

  
  const {user} = useContext(UserDataContext)

  const navigate = useNavigate()

   const submitHandler = async (e) => {
    e.preventDefault()
   }

  const handlePickupChange =  async(e) => { 
    setPickup(e.target.value)
    try {
       const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            console.log(response.data)
            setPickupSuggestions(response.data)
    }
    catch (error) {
        console.error('Error fetching pickup suggestions:', error);
        setPickupSuggestions([]);
  }

}


  const handleDestinationChange = async (e) => {
    setDestination(e.target.value)
      try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch(error) {
            // handle error

            console.error('Error fetching destination suggestions:', error);
            setDestinationSuggestions([]);
        }

  }
  async function findTrip() {
  if (!pickup || !destination) {
    alert('Please enter both pickup and destination locations.')  
    return
  } 
  if (!user) {
    alert('Please log in to find a trip.')  
    return
  }

  setIsFindingTrip(true) // Start loading

  try {
    console.log('Finding trip...')
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    console.log('Fare response:', response.data)

    if (response.data) {
      setFare(response.data)
      setVehiclePanel(true)
      setPanelOpen(false)
    } else {
      alert('Unable to find a trip. Please try again.')
      console.log('No fare data returned from the server.')
    }
  } catch (error) {
    alert('Something went wrong while finding a trip.')
    console.error(error)
  } finally {
    setIsFindingTrip(false) // Stop loading regardless of outcome
  }
}


  async function createRide() { 
    try {
      const response  =  await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,destination, vehicleType
      }, { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    console.log(response.data)
  }
  catch(error) {
    setConfirmRidePanel(true)
    setVehicleFound(false)
    console.error('Error creating ride:', error);
    alert('Failed to create ride. Please try again.');  
    }
  }


   useGSAP(function(){
    if(panelOpen) {
      gsap.to(panelRef.current, {
        height:'70%' ,
        duration: 0.5,
        padding : 24
    })
    gsap.to(panelCloseRef.current, {
      opacity: 1
    })

   } else {
    gsap.to(panelRef.current, { 
      height: 0,
      duration: 0.5,
      padding: 0
    })
    gsap.to(panelCloseRef.current, {
      opacity: 0
    })
   }
  }, [panelOpen])

  


  return (
    < div className=' h-screen relative overflow-hidden'>
                  <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                  <div className = 'h-screen w-screen'>
                    <LiveTracking />
                  </div>
                  <div className = 'flex flex-col justify-end h-screen absolute top-0 w-full'>
                    <div className='h-[30%] px-6 py-6 bg-white relative mb-10'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
  onClick={findTrip}
  disabled={isFindingTrip}
  className='bg-black text-white px-4 py-2 rounded-lg mt-3 mb-2 w-full flex items-center justify-center gap-2'
>
  {isFindingTrip ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Finding trips for you...
    </>
  ) : (
    'Find Trip'
  )}
</button>

                </div>
                <div ref={panelRef} className='bg-white h-0'>
                  <LocationSearchPanel
                    suggestions = {activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                    setPanelOpen = {setPanelOpen}
                    setVehiclePanel = {setVehiclePanel}
                    setPickup = {setPickup}
                    setDestination = {setDestination}
                    activeField = {activeField}
                  />
                  
                </div>
                  </div>
 <div 
  ref={vehiclePanelRef}
  className={`fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12 
    transition-transform duration-500 ease-in-out
    ${vehiclePanel ? 'translate-y-0' : 'translate-y-full'}`}
>
                <VehiclePanel
                    setVehicleType={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div> 

     <div 
  ref={confirmRidePanelRef}
  className={`fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12 
    transition-transform duration-500 ease-in-out 
    ${confirmRidePanel ? 'translate-y-0' : 'translate-y-full'}`}
>
  <ConfirmRide 
    createRide={createRide}
    pickup={pickup}
    destination={destination}
    fare={fare}
    vehicleType={vehicleType}
    setConfirmRidePanel={setConfirmRidePanel}
    setVehicleFound={setVehicleFound}
  />
</div>

<div 
  ref={vehicleFoundRef}
  className={`fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12 
    transition-transform duration-500 ease-in-out 
    ${vehicleFound ? 'translate-y-0' : 'translate-y-full'}`}
>
  <LookingForDriver
    createRide={createRide}
    pickup={pickup}
    destination={destination}
    fare={fare}
    vehicleType={vehicleType}
    setVehicleFound={setVehicleFound}
  />
</div>



      



      Home page for user 
    </div>
  )
}

export default Home
