const users = [];

// join user to chat

const userJoin=(id ,userName , room)=>{
    const user = {id ,userName , room };
    users.push(user);
    return user;
}


// Get current user
const getCurrentUser= (id) => {
    return users.find(user => user.id === id);
  }
  
  // User leaves chat
  const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
  
  // Get room users
  const getRoomUsers = (room)=> {
    return users.filter(user => user.room === room);
  }
  
  module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  };