const express = require('express');
const router = express.Router();
const controller = require('./controllers.cjs');

router.get('/sse', controller.sse);

// REGISTER/CREATE USER - DONE - Y
router.post('/user/register', controller.createUser);

// LOGIN USER - DONE - Y
router.post('/user/login', controller.loginUser);

// LOG OUT USER - DONE - Y
router.delete('/user/logout', controller.logoutUser);

// FETCH ONE USER - DONE - Y (getLoggedInUser)
router.get('/fetch-user', controller.fetchUser);

// FETCH ALL OUR USERS
router.get('/get-all-users', controller.getAllUsers);

// SEARCH FOR USERS TO INVITE
router.get('/user/search', controller.searchUsers);
// BLOCK A USER - DONE - Y (men minus :id)

router.post('/user/block/:id', controller.blockUser);

// GET ALL TITLES AND ID FROM ALL THE CHATS - DONE -Y
router.get('/chats', controller.getChats);

// GET CHAT USERS THAT ARE USING A CHAT (group in a chat) - DONE - Y
router.get('/chat/users', controller.getChatUsers);

// CREATE A CHAT - DONE -Y
router.post('/chat/create', controller.createChat);

// INVITE TO CHAT - DONE - Y
router.post('/chat/invite', controller.inviteToChat);

// ACCEPT INVITE TO CHAT - Y
router.put('/chat/accept-invite/:id', controller.acceptChatInvite);

// RECIEVE INVITATIONS TO CHAT
router.get('/chat/invites', controller.getInvites);
// GET CHAT MESSAGES
router.get('/chat/messages/:id', controller.getChatMessages);
// BAN FROM CHAT - DONE - Y
router.post('/chat/ban', controller.banFromChat);

// SEND A MESSAGE - MAYBE DONE? - Y
router.post('/chat/message', controller.sendMessage);

// GET A CHAT MESSAGE - TODO - Y
router.get('/chat/messages/:id', controller.getChatMessages);

// DELETE A MESSAGE - TODO - Y
router.delete('/chat/delete-message/:id', controller.deleteMessage);

router.store = () => {
  router.post('/store-session', controller.storeSession);
};

module.exports = router;
