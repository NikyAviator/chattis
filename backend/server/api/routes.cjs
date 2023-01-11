const express = require('express');
const router = express.Router();
const controller = require('./controllers.cjs');

router.get('/sse', controller.sse);

// REGISTER/CREATE USER - DONE
router.post('/user/register', controller.createUser);
// LOGIN USER - DONE
router.post('/user/login', controller.loginUser);
// LOG OUT USER - DONE
router.delete('/user/logout', controller.logoutUser);
// FETCH ONE USER - DONE
router.get('/fetch-user', controller.fetchUser);
// BLOCK A USER - DONE
router.post('/user/block/:id', controller.blockUser);
// GET ALL TITLES AND ID FROM ALL THE CHATS - DONE
router.get('/chats', controller.getChats);
// GET CHAT USERS THAT ARE USING A CHAT (group in a chat) - DONE
router.get('/chat/users', controller.getChatUsers);
// CREATE A CHAT - DONE
router.post('/chat/create', controller.createChat);
// INVITE TO CHAT - DONE
router.post('/chat/invite/:id', controller.inviteToChat);
// ACCEPT INVITE TO CHAT - TODO
router.post('/chat/accept-invite/:id', controller.acceptChatInvite);
// BAN FROM CHAT - TODO
router.post('/chat/ban/:id', controller.banFromChat);
// SEND A MESSAGE - MAYBE DONE?
router.post('/chat/message', controller.sendMessage);
// GET A CHAT MESSAGE - TODO
router.get('/chat/messages/:id', controller.getChatMessages);
// DELETE A MESSAGE - TODO
router.delete('/chat/delete-message/:id', controller.deleteMessage);

router.store = () => {
  router.post('/store-session', controller.storeSession);
};

module.exports = router;
