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

    // req.session.user = {
    //   id: user.id,
    //   user_name: user.user_name,
    //   user_role: user.user_role,
    // };

    res.status(200);
    return res.json({ user: req.session.user });
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
};

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
      user_role: user.user_role,
    };

    res.status(200);
    return res.json({ user: req.session.user });
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
};
const logoutUser = async (req, res) => {
  // Bugg vid logout
  console.log(req.route, req.session.user);
  console.log(!acl(req.route.path, req));

  // Problem with ACL rule
  // if (!acl(req.route.path, req)) {
  //   res.status(405).json({ error: 'Not allowed' });
  //   return;
  // }

  try {
    await req.session.destroy();
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};
const fetchUser = async (req, res) => {
  if (!acl(req.route.path, req)) {
    res.status(405).json({ error: 'Not allowed' });
    return;
  }

  if (req.sessionID && req.session.user) {
    res.status(200);
    return res.json({ user: req.session.user });
  }
  return res.sendStatus(403);
};

const blockUser = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getChats = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createChat = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const inviteToChat = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const acceptChatInvite = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const banFromChat = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const sendMessage = async (req, res) => {
  if (!req.body) {
    res.status(500).json({ success: false, error: 'Something went wrong :(' });
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

const getChatMessages = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

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
  createChat,
  inviteToChat,
  acceptChatInvite,
  banFromChat,
  sendMessage,
  getChatMessages,
  deleteMessage,
};
