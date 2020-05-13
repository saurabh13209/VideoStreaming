import React from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <button style={{ display:"flex",flexDirection:"column",backgroundColor:"#24a0ed",width:"50%",padding:20,
        alignItems:"center",margin:0,position:"absolute",top:"40%",left:"25%"}} onClick={create}><h1 style={{color: 'white'}}>Create a Room</h1></button>
    );
};

export default CreateRoom;