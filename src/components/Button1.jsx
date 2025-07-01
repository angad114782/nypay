import React from 'react'

function Button1({bg, color, text, onclick}) {
  return (
    <button className={`${bg} ${color} text-sm py-[10px] px-4 rounded-full font-semibold`} onClick={onclick}>
        {text}
    </button>
  )
}

export default Button1
