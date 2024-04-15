import React, { useEffect } from "react";
import { useState } from "react";

function Chat({socket,username,room}) {
    const [currentMessage,setCurrentMessage] = useState("");
    const [messageList,setMessageList] = useState([]);

    const sendMessage = async () => {
        if(currentMessage !== ""){
            const messageData = {
                room:room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
        
            await socket.emit("send_message",messageData);
            setMessageList((list) => [...list, messageData]);
        }
    }

    useEffect(() => {   
        socket.on("receive_message",(data)=>{
            console.log(data);
            setMessageList((list) => [...list, data]);
        });

        // Clean up the event listener when the component is unmounted
        return () => {
            socket.off("receive_message");
        };
    },[socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live chat </p>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent)=>{
                    return <div className="message"  id={username==messageContent.author ? "you" :"other"}>
                        <div> 
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                                </div>
                            <div className="message-meta">
                                <p id="author">{messageContent.author}</p>
                                <span id="time">{messageContent.time}</span>
                            </div>
                         </div>
                        </div>
                }
                )}
            </div>
            <div className="chat-footer"></div>
            <input type="text" placeholder="Type a message..." onChange={(event) => setCurrentMessage(event.target.value)} />
            <button onClick={sendMessage}>
            &#9658;
            </button>
        </div>
    );
}

export default Chat;