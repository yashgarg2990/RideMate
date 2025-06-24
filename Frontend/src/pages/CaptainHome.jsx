import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import axios from 'axios';
import { useState , useRef } from 'react';
import {SocketContext} from '../context/SocketContext'
import { useEffect } from 'react';
function CaptainHome() {
   const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)
  const { captain } = useContext(CaptainDataContext);
  const socket = useContext(SocketContext)
  console.log("in captain home will render captain context here in console to check ")
  console.log(captain)

  useEffect(() => {
    socket.emit('join' , {
      userId : captain._id , 
      userType : 'captain'
    })

    const updateLocation = () => {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          socket.emit('update-location-captain' , {
            userId : captain._id ,
            location : {
              ltd : position.coords.latitude ,
              lng : position.coords.longitude
            }
          })
        })
      }
    }
    const locationInterval = setInterval(updateLocation , 10000)
    updateLocation()
  },[])

    socket.on('new-ride', (data) => {

        setRide(data)
        setRidePopupPanel(true)

    })

  async function confirmRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm` , {
      rideId : ride._id , 
      captainId : captain._id ,
    } ,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
   setRidePopupPanel(false) 
   setConfirmRidePopupPanel(true)
  }


  return (
    <div className='h-screen'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
        <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
        <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className='h-3/5'>
        <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Captain Cover" />
      </div>

      <div className='h-2/5 p-6'>
        {/* Only render if captain is present */}
        {captain ? (
          <CaptainDetails />
        ) : (
          <p className="text-center text-gray-500">Loading Captain Details...</p>
        )}
      </div>

        <div
      ref={ridePopupPanelRef}
      className={`
        fixed w-full z-10 bottom-0 bg-white px-3 py-10 pt-12
        transition-transform duration-500 ease-in-out
        ${ridePopupPanel ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <RidePopUp
        ride={ride}
        setRidePopupPanel={setRidePopupPanel}
        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        confirmRide={confirmRide}
      />
    </div>

       <div ref={confirmRidePopupPanelRef} className={`fixed w-full h-screen z-10 bottom-0  bg-white px-3 py-10 pt-12
       transition-transform duration-500 ease-in-out
       ${confirmRidePopupPanel ? 'translate-y-0' : 'translate-y-full'}
       `}>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>

    </div>
  );
}

export default CaptainHome;
