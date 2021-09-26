const { User, Thought } = require('../models');


const userController = {

    // find all users, populate their thoughts & friends
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        });
    },


    // find user by ID, populate their thoughts & friends
    getUserById({params}, res) {
        User.findOne({_id: params.id})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with thid id.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },


    // create new user
    createUser({body}, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },


    // update user by ID
    updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },


    // delete user
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id})
        .then(deleteUser => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user found with this id.'});
                return;
            }
            return deletedUser;
        })
        .then(deletedUser => {
            Thought.deleteMany(
                {username: deletedUser.username}
            )
            .then(() => {
                res.json({message: 'User and their thoughts have been deleted.'})
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    },


    // add a friend
    addFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.id},
            {$push: {friends: params.friendId}},
            {new: true, runValidators: true}
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id.'});
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.status(400).json(err));
    },


    // remove a friend
    removeFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.id},
            {$pull: {friends: params.friendId}},
            {new: true, runValidators: true}
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'No user found with this id.'});
                    return;
                }
                res.json(dbUserData)
            })
            .catch(err => res.status(400).json(err));
    }

};





module.exports = userController;