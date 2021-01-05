const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    userid: {               // or Board id
        type: String,
        unique: true,
        require: true
    },
    username: {             // name of board
        type: String,
        require: true
    },
    tasks: [{              // tasks assigned to the user
        taskid: String,
        text: String
    }]
})
// assigning board scheam in to model boards
const Board = mongoose.model('boards', boardSchema);
module.exports = Board;