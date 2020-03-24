  
// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();



function setUserId({sID, message}) {
    //debugger;
    vm.socketID = sID;
}

 // remove login screen
function loggin(){
    vm.styleObject.display = "none";
  };

function runDisconnectMessage(packet) {
    //debugger;
    console.log(packet);
}

function appendNewMessage(msg) {

    // take the incoming message and push it into the Vue instance 
    // into the messages array
    vm.messages.push(msg);
}

// this is our main Vue instance
const vm = new Vue({
    data: {
        styleObject: {
            display: 'flex'
        },
        socketID: "",    
        messages: [],
        message: ""
        
    },

    methods: {
        dispatchMessage() {
            // emit a message event and send the message to the server
            console.log('handle send message');

            socket.emit('chat_message', { 
                content: this.message
                // || is called a double pipe operator or an "or" operator
                // if this.nickName is set, use it as the value
                // or just make name "anonymous"
            })

            this.message = "";
        },
        add_user(){
            console.log('handle send name');

            socket.emit('add user', { 
                username: this.username
            })

            this.message = "";
        }
},

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
}).$mount("#app");


// some event handling -> these events are coming from the server
socket.addEventListener('connected', setUserId);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage); 
socket.addEventListener('login', loggin);
socket.addEventListener('user_left', logoff);