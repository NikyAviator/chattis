const acl = require('../../security/acl.cjs');
const passwordEncryptor = require('../../security/passwordEncryptor.cjs');
const db = require('../db.cjs');

let connections = [];

const sse = async (req, res) => {
  // Add the response to open connections
  connections.push(res);

  // listen for client disconnection
  // and remove the client's response
  // from the open connections list
  req.on('close', () => {
    connections = connections.filter((openRes) => openRes != res);

    // message all open connections that a client disconnected
    broadcast('disconnect', {
      message: 'client disconnected',
    });
  });

  // Set headers to mark that this is SSE
  // and that we don't close the connection
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  // message all connected clients that this
  // client connected
  broadcast('connect', {
    message: 'clients connected: ' + connections.length,
  });
};

// function to send message to all connected clients
function broadcast(event, data) {
  // loop through all open connections and send
  // some data without closing the connection (res.write)
  for (let res of connections) {
    // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
    res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n');
  }
}
// CREATE USER
const createUser = async (req, res) => {
  const { username, password } = req.body;

  if (username == null || password == null) {
    return res.sendStatus(403);
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    const hashedPassword = passwordEncryptor(password);
    const data = await db.query(
      'INSERT INTO users (user_name, password, user_role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, 'user']
    );

    if (data.rows.length === 0) {
      res.sendStatus(403);
    }
    const user = data.rows[0];
    // OM man vill ha skapat en session med login info direkt
    // efter skapandet av usern

    // req.session.user = {
    //   id: user.id,
    //   user_name: user.user_name,
    //   user_role: user.user_role,
    // };

    res.status(200);
    // JSON borde returnera tomt eftersom vi inte skapar session (när den är utkommenterad)
    return res.json({ user: req.session.user });
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
};
// LOG IN USER
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (username == null || password == null) {
    return res.sendStatus(403);
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    const data = await db.query(
      'SELECT id, user_name, password, user_role FROM users WHERE user_name = $1',
      [username]
    );

    if (data.rows.length === 0) {
      return res.sendStatus(403);
    }
    const user = data.rows[0];

    const matches = passwordEncryptor(password) === user.password;
    if (!matches) {
      return res.sendStatus(403);
    }

    req.session.user = {
      id: user.id,
      username: user.user_name,
      userRole: user.user_role,
    };

    res.status(200);
    return res.json({ user: req.session.user });
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
};
// LOG OUT USER
const logoutUser = async (req, res) => {
  console.log(req.route, req.session.user);
  console.log(!acl(req.route.path, req));

  // Problem with ACL rule, might be resolved?
  // Session now gone with logout!
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  try {
    await req.session.destroy();
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};

// FETCH USER
const fetchUser = async (req, res) => {
  // TODO PROBLEM
  // if (!acl(req.route.path, req)) {
  //   res.status(405).json({ error: 'Not allowed' });
  //   return;
  // }

  if (req.sessionID && req.session.user) {
    res.status(200);
    return res.json({ user: req.session.user });
  }
  return res.sendStatus(403);
};
// BLOCK USER
const blockUser = async (req, res) => {
  if (!req.params.id) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  try {
    await db.query(
      `
        INSERT INTO user_blockings (user_id, blocked_user_id)
        VALUES ($1, $2)
      `[
        // These are the values that are set in $1, $2
        (req.session.user.id, req.params.id)
      ]
    );

    res.status(200).json({ success: true, result: 'User blocked' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// GET CHATS-CREATED GROUP
const getChats = async (req, res) => {
  // TODO PROBLEM
  // if (!acl(req.route.path, req)) {
  //   res.status(405).json({ error: 'Not allowed' });
  //   return;
  // }

  try {
    const query = await db.query(
      `
      SELECT *
      FROM chats, chat_users
      WHERE chats.id = chat_users.chat_id
      AND chat_users.user_id = $1
      AND chat_users.invitation_accepted = true
      `,
      [req.session.user.id]
    );

    res.status(200).json({ success: true, result: query.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET CHAT USERS THAT ARE USING A CHAT (group in a chat)
const getChatUsers = async (req, res) => {
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  if (!req.query.chatId) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
    const query = await db.query(
      `
      SELECT users.id, users.user_name, chat_users.blocked
      FROM users, chats, chat_users
      WHERE users.id = chat_users.user_id
      AND chats.id = chat_users.chat_id
      AND chats.id = $1
      AND users.id != $2
      `,
      [req.query.chatId, req.session.user.id]
    );
    res.status(200).json({ success: true, result: query.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE CHAT
const createChat = async (req, res) => {
  console.log(req.route.path);
  console.log(req.session.user);

  if (!req.body.subject) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    const data = await db.query(
      'INSERT INTO chats (created_by, subject) VALUES($1, $2) RETURNING * ',
      [req.session.user.id, req.body.subject]
    );
    res
      .status(200)
      .json({ success: true, result: 'Chat created', chat: data.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// INVITE TO CHAT
const inviteToChat = async (req, res) => {
  // If u haven't added these parameters in the query, it is not allowed!
  if (!req.query.chatId || !req.query.userId) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
    return;
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    // WHERE NOT EXIST: means that we cannot invite a person twice
    await db.query(
      `
      INSERT INTO chat_users (chat_id, user_id)
      SELECT $1, $2
      WHERE NOT EXISTS(
        SELECT *
        FROM chat_users
        WHERE chat_id = $1
        AND user_id = $2
      )
      `,
      [req.query.chatId, req.query.userId]
    );
    res
      .status(200)
      .json({ success: true, result: 'Invitation to chat has been sent!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// ACCPET CHAT INVITE
const acceptChatInvite = async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ success: false, error: 'Incorrect parameters' });
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    await db.query(
      `
                UPDATE chat_users
                SET invitation_accepted = true
                WHERE chat_id = $1
                AND user_id = $2
            `,
      [req.params.id, req.session.user.id]
    );
    res.status(200).json({ success: true, result: 'Chat invite accepted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// BAN FROM CHAT
const banFromChat = async (req, res) => {
  if (!req.query.chatId || !req.query.userId) {
    res.status(400).json({ success: false, error: 'Incorrect parameters' });
    return;
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    await db.query(
      `
       UPDATE chat_users
       SET blocked = NOT blocked
       WHERE chat_id = $1
       AND user_id = $2 
      `[(req.query.chatId, req.query.userId)]
    );
    res.status(200).json({
      success: true,
      result: 'User banned/unbanned (toggle) from chat',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// SEND A MESSAGE
const sendMessage = async (req, res) => {
  if (!req.body) {
    res.status(400).json({ success: false, error: 'Something went wrong :(' });
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    let message = req.body;
    message.timestamp = Date.now();
    broadcast('new-message', message);
    res.send('ok');
    // just nu sparas meddelande i broadcast.
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// GET CHAT MESSAGES
const getChatMessages = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// DELETE MESSAGE
const deleteMessage = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  sse,
  createUser,
  loginUser,
  logoutUser,
  fetchUser,
  blockUser,
  getChats,
  getChatUsers,
  createChat,
  inviteToChat,
  acceptChatInvite,
  banFromChat,
  sendMessage,
  getChatMessages,
  deleteMessage,
};
