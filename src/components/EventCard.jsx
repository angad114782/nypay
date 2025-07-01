import React from 'react'

function EventCard({onclick, eventImg}) {
  return (
    <button onClick={onclick}>
        <img src={`/asset/${eventImg}`} alt="event"  className='min-w-[196px] h-auto'/>
    </button>
  )
}

export default EventCard
