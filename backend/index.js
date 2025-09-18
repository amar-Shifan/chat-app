import express from 'express';
import http, { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';

let app = express();
let server = createServer();

const io = Server(server , {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET' , 'POST']
    },
});

app.use(cors());
app.use(express.json());

app.get('/' ,(req,res)=>{
    res.send('Chat App Backend is Running')
})

io.on('connection' , (socket) => {
    console.log('A User connected : ' , socket.id)

    socket.on("sendMessage" , (data) => {
        console.log('Message Recieved : ' , data);
        io.emit("recieveMessage : " , data)
    })

    socket.on("disconnect" , () => {
        console.log('User disconnected : ' , socket.id)
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT , () => {
    console.log(`Sever running on http://localhost:${PORT}`)
})