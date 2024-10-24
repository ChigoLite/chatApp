import React, { useEffect } from 'react';
import { useGlobalHooks } from '../context';
const AnswerCall=()=>{
    const{local,remote,activeCall,incomingCall,setActiveCall}=useGlobalHooks()
    
    console.log(local)
return(
    <>
    {/* Video Call UI */}
  <div className="fixed inset-0 bg-gray-800 flex flex-col items-center justify-center space-y-4 p-4 z-50">
    <div className="flex space-x-4">
      {/* Local Video */}
      <video ref={local} className="rounded-lg shadow-lg w-1/2" autoPlay muted></video>
      
      {/* Remote Video */}
      <video ref={remote} className="rounded-lg shadow-lg w-1/2" autoPlay></video>
    </div>

    {/* End Call Button */}
    <button className="btn btn-error btn-lg mt-4">
      End Call
    </button>
  </div>


    </>
)

}

export default AnswerCall;