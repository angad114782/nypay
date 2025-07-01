import React from 'react'

function Button2({img, text, onClick}) {
  return (
    <button className='t-shadow1 t-filter1 bgt-black flex items-center rounded-full p-1' onClick={onClick}>
      <img src={`/asset/${img}`} alt="dollar" className='img-fluid'/>
      <p className='text-xs text-white ps-2 pe-4'>{text}</p>
    </button>
  )
}

export default Button2;



