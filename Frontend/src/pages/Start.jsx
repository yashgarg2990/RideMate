import React from 'react'
import { Link } from 'react-router-dom'
import bgImage from '../assets/i1.png' // adjust path as needed

const Start = () => {
  return (
    <div>
      <div
        className='h-screen pt-8 flex justify-between flex-col w-full bg-cover bg-center'
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <img
          className='w-16 ml-8'
          src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417"
          alt=""
        />
        <div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>Get Started with Uber</h2>
          <Link
            to='/login'
            className='flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5'
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start
