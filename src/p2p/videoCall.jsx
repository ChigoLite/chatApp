import React, { useEffect } from 'react';
import { useGlobalHooks } from '../context';
const VideoCall=()=>{
    const{localStream,remoteStream,activeCall,endCall}=useGlobalHooks()
return(
    <>
    {/* Video Call UI */}
{
  activeCall && (

  <div className="fixed inset-0 bg-gray-800 flex flex-col items-center justify-center space-y-4 p-4 z-50">
    <div className="flex space-x-4">
    
      <video  className="rounded-lg shadow-lg w-1/2" ref={video => video && (video.srcObject = localStream)} autoPlay playsInline muted />
      <video  className="rounded-lg shadow-lg w-1/2" ref={video => video && (video.srcObject = remoteStream)} autoPlay playsInline />
    </div>


    {/* End Call Button */}
    <button onClick={endCall} className="btn btn-error btn-lg mt-4">
      End Call
    </button>
  </div>
  )
}



    </>
)

}

export default VideoCall;