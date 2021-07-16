const form = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { userName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

var socket = io();

// join chat room
socket.emit('joinRoom' ,{userName , room});

// get room and users
socket.on('roomUsers' , ({room , users})=>{
  outputRoomName(room);
  outputUsers(users)
});

socket.on('message' , (message)=>{
  outputMessage(message);

  
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.input.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chat message', msg);

  // Clear input
  e.target.elements.input.value = '';
  e.target.elements.input.focus();
});


// Output message to DOM
const outputMessage=(message)=> {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.userName+" ";
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}




// Add room name to DOM
const outputRoomName=(room)=> {
  roomName.innerText = room;
}

// Add users to DOM
const outputUsers=(users)=> {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.userName;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});