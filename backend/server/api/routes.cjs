const express = require('express');
const router = express.Router();
const controller = require('./controllers.cjs');

router.get('/sse', controller.sse);
// REGISTER USER
router.post('/user/register', controller.createUser);
// LOGIN USER
router.post('/user/login', controller.loginUser);
// LOG OUT USER
router.delete('/user/logout', controller.logoutUser);
// FETCH ONE USER
router.get('/fetch-user', controller.fetchUser);
// BLOCK A USER
router.post('/user/block/:id', controller.blockUser);
// GET A WHOLE GROUP CHAT
router.get('/chats/:id', controller.getChats);
// CREATE A CHAT
router.post('/chat/create', controller.createChat);
// INVITE TO CHAT
router.post('/chat/invite/:id', controller.inviteToChat);
// ACCEPT INVITE TO CHAT
router.post('/chat/accept-invite/:id', controller.acceptChatInvite);
// BAN FROM CHAT
router.post('/chat/ban/:id', controller.banFromChat);
// SEND A MESSAGE
router.post('/chat/message', controller.sendMessage);
// GET A CHAT MESSAGE
router.get('/chat/messages/:id', controller.getChatMessages);
// DELETE A MESSAGE
router.delete('/chat/delete-message/:id', controller.deleteMessage);

router.store = () => {
  router.post('/store-session', controller.storeSession);
};

module.exports = router;
