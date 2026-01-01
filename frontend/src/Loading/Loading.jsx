import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Loading = () => {
    const [loading, setLoading] = useState(true)
  return (
    <div>
        {
            loading &&
            <img className='size-30' src={assets.loading} alt="" />
        }
    </div>
  )
}

export default Loading