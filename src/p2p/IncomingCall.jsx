import React,{useState,useEffect} from 'react';
import { useGlobalHooks } from '../context';
const IncomingCall=()=>{
    const {acceptCall,activeCall,incomingCall,setActiveCall}=useGlobalHooks()
    const [incomingCallActive, setIncomingCallActive] = useState(false);

    useEffect(() => {
      if (incomingCall.current) {
        setIncomingCallActive(true); // Show incoming call UI when a call is received
      }
    }, [incomingCall.current]);

    const rejectCall = () => {
      if (incomingCall.current) {
        incomingCall.current.close(); // Close the call and reject it
        console.log('Call rejected');
      }
  
      // Set the incomingCall to null and update the call state
      incomingCall.current = null;
      setActiveCall(false); 
      setIncomingCallActive(false)
    };
    
    return(
<>        {/* Incoming Call UI */}
        {!activeCall && incomingCall.current ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4">Incoming Call</h2>
        <p className="mb-6">You have an incoming call from <span className="font-semibold"> a Friend</span></p>
  
        <div className="flex justify-around">
          {/* Accept Button */}
          <button onClick={acceptCall} className="btn btn-success btn-lg">
            Accept
          </button>
          
          {/* Decline Button */}
          <button onClick={rejectCall} className="btn btn-error btn-lg">
            Decline
          </button>
        </div>
      </div>
    </div>
): null}
</>
)
  
}

export default IncomingCall;