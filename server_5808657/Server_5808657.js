var io = require('socket.io')(process.env.PORT || 3000);
var shortId = require('shortid');



console.log("server started");

var playerCount = 0;
var players = [];
 //random number
 var num = Math.floor(Math.random() * 100);
 console.log(num);

io.on("connection",function(socket)
{
    //--------------------------------------
    var thisPlayerId = shortId.generate();
    var player = {
        id:thisPlayerId,
        destination:{
        x:0,
        y:0    
        },
        lastPosition:{
            x:0,
            y:0
        },
        lastMoveTime : 0
    };
    players[thisPlayerId] = player;
    
    console.log("client connected, id = ", thisPlayerId);
   
   socket.emit('register', {id:thisPlayerId});
    socket.broadcast.emit('spawn', {id:thisPlayerId});
    socket.broadcast.emit('requestPosition');
    
    for(var playerId in players){
        if(playerId == thisPlayerId)
            continue;
        socket.emit('spawn', players[playerId]);
    };

//---------------------------------------

   

    console.log("client connected");

    socket.broadcast.emit("spawn");
    playerCount++;

    for(i=0;i<playerCount;i++)
    {
        socket.emit("spawn");
       
       // console.log("spawn exsiting player");
    }

    //recive number form player
    socket.on("send",function(data)
    {
        //console.log("10");
        console.log(data);

     
        
        //win
        if(data==num)
        {
            console.log("win");

            socket.emit("win");

            socket.on("sendID",function(id){
                console.log(id);
                for(var playerId in players){
                    if(playerId == thisPlayerId)
                    {
                    socket.emit("winID", {winID:thisPlayerId});
                    //socket.broadcast.emit("winID",{winID:thisPlayerId});
                    console.log("this player is win");
                    console.log({winID:thisPlayerId});
                    }
                    else 
                    {
                        socket.emit("lose");
                    }
                                 
                };
            });
           
            

            num = Math.floor(Math.random() * 100);
            console.log(num);

       

        }
        else if(data>num)
        {
            console.log("Too much value");
            socket.emit("TooMuchValue");
        }
        else if(data<num)
        {
            console.log("Too less value");
            socket.emit("TooLessValue");
        }
    });

    socket.on("disconnect",function()
    {
        console.log("client disconnect");
        playerCount--;
    });
});

