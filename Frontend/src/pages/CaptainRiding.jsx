import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.rideD;

  console.log(" Currently in captainRiding compionent printing rideData")
  console.log(rideData)

  return (
    <div className="h-screen relative flex flex-col justify-end">

      {/* Top Navbar */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-[50]">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="logo"
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Yellow Ride Info Panel */}
      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10 z-[10] cursor-pointer"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="p-1 text-center w-[90%] absolute top-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">{'4 KM away'}</h4>
        <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>

      {/* Finish Ride Panel (Bottom Sheet) */}
      <div
        ref={finishRidePanelRef}
        className={`fixed w-full z-[100] bottom-0 bg-white px-3 py-10 pt-12 transition-transform duration-500 ease-in-out ${
          finishRidePanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <FinishRide
          ride={rideData}
          setFinishRidePanel={setFinishRidePanel}
        />
      </div>

      {/* Map Background */}
      <div className="h-screen fixed w-screen top-0 z-[-1]">
        <LiveTracking />
      </div>
    </div>
  );
};

export default CaptainRiding;
