import React from 'react'
import notFound from '../assets/notFound.png'

function pageNotFound() {
  return (
<div className="h-screen w-full bg-sky-100 flex flex-col justify-center items-center">
    <img src={notFound} alt="404 Not Found" className="w-1/2 h-auto" />
    <div className="text-center mt-4">
        <h1 className="text-4xl font-extrabold">PAGE NOT FOUND</h1>
        <p className="mt-2 text-xl">We've looked everyone, but the page does not exist.</p>
    </div>
</div>


  )
}

export default pageNotFound
