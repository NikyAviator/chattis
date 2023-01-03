const express = require('express');
const router = express.Router();
const controller = require('./controllers.cjs');

router.get('/sse', controller.sse);

router.post('/user/create-user', controller.createUser);
router.post('/user/login', controller.loginUser);
router.post('/user/block/:id', controller.blockUser);

router.get('/chats/:id', controller.getChats);

router.post('/chat/create', controller.createChat);
router.post('/chat/invite/:id', controller.inviteToChat);
router.post('/chat/accept-invite/:id', controller.acceptChatInvite);
router.post('/chat/ban/:id', controller.banFromChat);
router.post('/chat/message', controller.sendMessage);
router.get('/chat/messages/:id', controller.getChatMessages);
router.delete('/chat/delete-message/:id', controller.deleteMessage);

router.store = () => {
  router.post('/store-session', controller.storeSession);
};

module.exports = router;
