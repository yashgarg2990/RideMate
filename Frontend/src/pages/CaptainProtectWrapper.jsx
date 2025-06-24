import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { Navigate } from 'react-router-dom'

const CaptainProtectWrapper = ({ children }) => {
  const { captain } = useContext(CaptainDataContext)
  const token = localStorage.getItem('token')
  

  if (!token || !captain) {
    return <Navigate to="/captain-login" />
  }

  return <>{children}</>
}

export default CaptainProtectWrapper
