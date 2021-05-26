const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    //to remove spaces..trim and to convert it to lower case
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user called below
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username //same room and same name
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user } //when everythings end well we will return user property in place of error property
}


const removeUser = (id) => { //removing the user with the given id
    const index = users.findIndex((user) => user.id === id)//selecting the index of that user if present 

    if (index !== -1) {
        return users.splice(index, 1)[0] //allow to remove user from an array via index and '1' here means remove only 1 element which is present at that index
        //'[0]' return the removed object
    }
}

const getUser = (id) => { //return the user object(containing name,room,id) with the help of id
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {//it will be used in updating current user in a particular room and updating sidebar also
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}