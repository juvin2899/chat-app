const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

//get username and room name
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

//join chat room

socket.emit("joinRoom", params);

//get room ans users
socket.on("roomUsers", ({ room, users }) => {
    outputRoom(room);
    console.log(users);
    outputUsers(users);
  
});

// message from server
socket.on("message", (message) => {
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  const inputField = e.target.querySelector("input");
  const message = inputField.value;

  //emit message to server
  socket.emit("chatMessage", message);

  //clear input
  inputField.value = "";
  inputField.focus();
});

//output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
  chatMessages.appendChild(div);
}

//add room name to dom
function outputRoom(room){
    document.getElementById("room-name").innerHTML=room;
}

// //add user list to dom
function outputUsers(users){

    const userlist=document.getElementById("users")
    userlist.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `
}