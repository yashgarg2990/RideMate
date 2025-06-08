import React  , {useEffect , useRef , useState} from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
// import LocationSearchPanel from '../components/LocationSearchPanel'




import { useContext } from 'react'
import {UserDataContext} from '../context/UserContext'
import { useNavigate } from 'react-router-dom'


function Home() {
  const [pickup , setPickup] = useState('')
  const [destination , setDestination] = useState('')
  const [panelOpen , setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const [ activeField, setActiveField ] = useState(null)





  const navigate = useNavigate()

   const submitHandler = async (e) => {
    e.preventDefault()
   }

  const handlePickupChange =  async(e) => { 
    setPickup(e.target.value)
  }
  const handleDestinationChange = async (e) => {
    setDestination(e.target.value)
  }
  const findTrip = () => {
  console.log('Finding trip with:', pickup, destination);
  // You can add your API call logic here
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

  

  const {user} = useContext(UserDataContext)
  return (
    <div className=' h-screen relative overflow-hidden'>
                  <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                  <div className = 'h-screen w-screen'>
                    Live Tracking wala component
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
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 mb-2 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                  Location search panel component 
                  
                </div>
                  </div>

      Home page for user 
    </div>
  )
}

export default Home
