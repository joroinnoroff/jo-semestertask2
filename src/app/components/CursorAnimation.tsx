import React from 'react'
import Lottie from 'lottie-react'
import animationData from '../../assets/animations/cursorAni.json'
interface Props { }

const CursorAnimation = () => {
  return <div>
    <div id='cursorAni' className="flex flex-col justify-between lg:justify-between w-full md:max-w-xs">
      {/* Your component content */}
      <Lottie animationData={animationData} />
    </div>
  </div>
}

export default CursorAnimation