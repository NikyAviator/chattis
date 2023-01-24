const acl = require('../../security/acl.cjs');
const passwordEncryptor = require('../../security/passwordEncryptor.cjs');
const db = require('../db.cjs');

let connections = {};
const sse = async (req, res) => {
  // Add the response to open connections
  //connections.push(res);
  if (!connections[req.query.chatId]) {
    connections[req.query.chatId] = [res];
  } else {
    connections[req.query.chatId].push(res);
  }

  // listen for client disconnection
  // and remove the client's response
  // from the open connections list
  req.on('close', () => {
    //connections = connections.filter(openRes => openRes != res)
    connections[req.query.chatId] = connections[req.query.chatId].filter(
      (openRes) => openRes != res
    );

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
    //message: 'clients connected: ' + connections.length
    message: 'clients connected: ' + connections[req.query.chatId].length,
    chatId: req.query.chatId,
  });
};

function broadcast(event, data) {
  console.log('broadcast event,', data);
  // loop through all open connections and send
  // some data without closing the connection (res.write)
  //for (let res of connections) {
  try {
    for (let res of connections[data.chatId]) {
      // syntax for a SSE message: 'event: message \ndata: "the-message" \n\n'
      res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n');
    }
  } catch (err) {
    console.log(err.message);
  }
}

// CREATE USER
const createUser = async (req, res) => {
  const { username, password } = req.body;
  const regex = /^(?=.*[\d!#$%&? "])(?=.*[A-Z])[a-zA-Z0-9!#$%&?]{8,}/;
  // if (!regex.test(req.body.password)) {
  //   res.status(403).json({ success: false, error: 'Incorrect Password!' });
  //   return;
  // }

  if (
    !username ||
    (username && username.length > 30) ||
    !password ||
    (password && password.length > 40) ||
    !password.match(regex)
  ) {
    return res
      .status(403)
      .json({ success: false, error: 'Incorrect Parameters' });
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
      res.status(403);
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
    return res.status(403);
  }
};
// LOG IN USER
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (username == null || password == null) {
    return res.status(403);
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
      return res.status(403);
    }
    const user = data.rows[0];

    const matches = passwordEncryptor(password) === user.password;
    if (!matches) {
      return res.status(403);
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
    return res.status(403);
  }
};
// LOG OUT USER
const logoutUser = async (req, res) => {
  // Problem with ACL rule, might be resolved?
  // Session now gone with logout!
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  try {
    await req.session.destroy();
    res.status(200).json({ success: true, result: 'Logged out' });
    return;
  } catch (e) {
    console.error(e);
    return res.status(500);
  }
};

// FETCH USER
const fetchUser = async (req, res) => {
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  if (req.sessionID && req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(403).json({ success: false });
  }
};
// GET ALL USERS
const getAllUsers = async (req, res) => {
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  try {
    let query = await db.query(
      `
      SELECT id, user_name
       FROM users
       WHERE id != $1
      `,
      [req.session.user.id]
    );
    res.status(200).json({ success: true, result: query.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// SEARCH FOR USERS
const searchUsers = async (req, res) => {
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  try {
    const query = await db.query(
      `
                SELECT id, user_name
                FROM users
                WHERE id != $1
                AND user_role = 'user'
                AND user_name ILIKE $2
                AND id NOT IN (
                    SELECT user_id
                    FROM chat_users
                    WHERE chat_id = $3
                )
                ORDER BY user_name asc
                limit 10
            `,
      [req.session.user.id, `%${req.query.username}%`, req.query.chatId]
    );

    res.status(200).json({ success: true, result: query.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  // get all the rooms as admin
  if (req.session.user.userRole === 'admin') {
    try {
      const query = await db.query(
        `
        WITH userlastmessage AS(SELECT chats.id AS chat_id, messages.message_timestamp, messages.from_id FROM chats, messages WHERE chats.id = messages.chat_id AND from_id = $1)
      SELECT id AS chat_id, subject, created_by,
        lastmessage.last_message_timestamp, 
            userlatestmessage.user_latest_message_timestamp
          FROM chats
          LEFT JOIN lastmessage
          ON chats.id = lastmessage.chat_id
          LEFT JOIN(
              SELECT chat_id, 
                  MAX(message_timestamp) AS "user_latest_message_timestamp"
              FROM userlastmessage
              GROUP BY(chat_id)
          ) userlatestmessage
          ON userlatestmessage.chat_id = chats.id
      `,
        [req.session.user.id]
      );
      res.status(200).json({ success: true, result: query.rows });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    // get all the rooms a user is invited to or has created
    try {
      const query = await db.query(
        `
      WITH userlastmessage AS(
          SELECT chats.id AS chat_id,
              messages.message_timestamp, messages.from_id
          FROM chats, messages
          WHERE chats.id = messages.chat_id
          AND from_id = $1
      )
      SELECT c.id AS "chat_id", c.created_by, c.subject,
          cu.user_id, cu.blocked, cu.invitation_accepted,
          lm.last_message_timestamp, 
          user_latest_message.user_latest_message_timestamp
      FROM chat_users cu, chats c
          LEFT JOIN lastmessage lm
          ON c.id = lm.chat_id
      LEFT JOIN(
          SELECT chat_id, 
              MAX(message_timestamp) AS "user_latest_message_timestamp"
          FROM userlastmessage
          GROUP BY(chat_id)
      ) user_latest_message
      ON user_latest_message.chat_id = c.id
      WHERE c.id = cu.chat_id
      AND cu.user_id = $1
      AND cu.invitation_accepted = true
      `,
        [req.session.user.id]
      );

      res.status(200).json({ success: true, result: query.rows });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
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
  if (!req.body.subject || (req.body.subject && req.body.subject.length > 50)) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
    return;
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
// GET INVITES
const getInvites = async (req, res) => {
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  try {
    const query = await db.query(
      `
                SELECT chats.id, chats.created_by, chats.subject
                FROM chats, chat_users
                WHERE chats.id = chat_users.chat_id
                AND chat_users.user_id = $1
                AND chat_users.invitation_accepted = false
            `,
      [req.session.user.id]
    );

    res.status(200).json({ success: true, result: query.rows });
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
      `,
      [req.query.chatId, req.query.userId]
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
  if (!req.body.content || !req.body.chatId || req.body.content.length > 1000) {
    res.status(400).json({ success: false, error: 'Something went wrong :(' });
    return;
  }
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }
  try {
    console.log('connections', connections);
    let message = req.body;
    message.fromId = req.session.user.id;
    message.timestamp = Date.now();
    const query = await db.query(
      `
        INSERT INTO messages(chat_id, from_id, content, message_timestamp)
        SELECT $1, $2, $3, to_timestamp($4 / 1000.0)
        WHERE EXISTS(
            SELECT 1
            FROM chat_users
            WHERE chat_id = $1
            AND user_id = $2
        )
        OR EXISTS(
            SELECT 1
            FROM users
            WHERE id = $2
            AND user_role = 'admin'
        )
        RETURNING id
        `,
      [
        req.body.chatId,
        req.session.user.id,
        req.body.content,
        message.timestamp,
      ]
    );

    message.id = query.rows[0].id;
    broadcast('new-message', message);
    res.status(200).json({ success: true });
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
    const query = await db.query(
      `
      SELECT users.user_name AS "from",
                    messages.id,
                    messages.content,
                    messages.message_timestamp AS "timestamp",
                    messages.from_id AS "fromId"
                FROM users, messages
                WHERE users.id = messages.from_id
                AND messages.chat_id = $1 
                AND EXISTS(
                    SELECT id 
                    FROM chat_users
                    WHERE chat_id = $1
                    AND user_id = $2
                    AND blocked != true
                    OR EXISTS(
                        SELECT id
                        FROM users
                        WHERE id = $2
                        AND user_role = 'admin'
                    )
                )
                ORDER BY timestamp ASC
      `,
      [req.params.id, req.session.user.id]
    );
    res.status(200).json({ success: true, result: query.rows });
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
    const query = await db.query(
      `
      DELETE FROM messages
      WHERE id = $1
      `,
      [req.params.id]
    );
    res.status(200).json({ success: true, result: 'Message deleted!' });
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
  getAllUsers,
  searchUsers,
  getInvites,
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
