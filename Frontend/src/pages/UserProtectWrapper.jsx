import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({ children }) => {
  // Retrieve the token stored in localStorage after login
  const token = localStorage.getItem('token')

  // Hook from React Router to programmatically navigate
  const navigate = useNavigate()

  // Get user data and a method to update it from context
  const { user, setUser } = useContext(UserDataContext)

  // Track whether we're still loading the user's profile
  const [isLoading, setIsLoading] = useState(true)

  // Runs only once when the component mounts
  useEffect(() => {
    // If token doesn't exist, redirect the user to the login page
    if (!token) {
      navigate('/login')
      return // Stop further execution
    }

    // Token exists, validate it by fetching the user's profile
    axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}` // Send token in the header
      }
    })
      .then(response => {
        // If server returns status 200 (OK), token is valid
        if (response.status === 200) {
          // Save the returned user data to context
          setUser(response.data)

          // Set loading to false so protected content can render
          setIsLoading(false)
        }
      })
      .catch(err => {
        // If token is invalid or request fails
        console.log(err)

        // Remove the invalid token from localStorage
        localStorage.removeItem('token')

        // Redirect user to login page
        navigate('/login')
      })

  }, [token]) // Re-run this effect if the token changes

  // While we are still fetching the user profile, show loading indicator
  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  // Once authenticated and profile is loaded, show the protected children
  return (
    <>
      {children}
    </>
  )
}

export default UserProtectWrapper
