const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: "Username is required.",
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: "Email address is required.",
        match: [/.+\@.+\..+/, "A valid email address is required."]
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: {
        virtuals: true
    },
    id: false
});



userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', userSchema);




module.exports = User;