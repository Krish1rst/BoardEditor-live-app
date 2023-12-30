import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateRoomForm({uuid,socket,setUser}) {

const [roomId, setRoomId]=useState(uuid());
const [name,setName]=useState("");

const navigate = useNavigate();

const handleCreateRoom=(e)=>{
  e.preventDefault();
  const roomData = {
    name,
    roomId,
    userId: uuid(),
    host: true,
    presenter: true,
  };
  setUser(roomData);
  navigate(`/${roomId}`);
  socket.emit('userJoined',roomData);
}

  return (
   <form className='form col-md-12 mt-5'>
    <div className='form-group'>
      <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className='form-control my-2' placeholder='Enter your name'/>
    </div>
    <div className="form-group border">
      <div className="input-group d-flex align-items-center justify-content-center">
        <input type="text"className='form-control my-2 border-0'value={roomId} placeholder='Generate room code' />
        <div className='input-group-append'>
            <button className='btn btn-primary btn-sm me-1'type='button' onClick={()=>setRoomId(uuid())}>generate</button>
            <button className="btn btn-outline-danger btn-sm me-2"type='button'>copy</button>
      </div>
      </div>
    </div>
    <button type='submit' onClick={handleCreateRoom} className='mt-4 btn btn-primary btn-block form-control'>
      Generate room id
    </button>
   </form>
  )
}

export default CreateRoomForm