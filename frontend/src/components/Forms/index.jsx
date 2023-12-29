import React from 'react'
import "./index.css"
import CreateRoomForm from "./CreateRoomForm"
import JoinRoomForm from "./JoinRoomForm"
function Forms() {
  return (
    <div className='row h-100 pt-5'>
        <div className='col-md-4 mt-5 form-box py-3 p-5 border border-2 rounded-2 mx-auto d-flex       flex-column align-items-center'>
            <h1 className='text-primary fw-bold'>Create room</h1>
            <CreateRoomForm/>
        </div>
        <div className='col-md-4 mt-5 form-box py-3 p-5 border border-2 rounded-2 mx-auto d-flex       flex-column align-items-center'>
            <h1 className='text-primary fw-bold'>Join Room</h1>
            <JoinRoomForm/>
            </div>
    </div>
  )
}

export default Forms