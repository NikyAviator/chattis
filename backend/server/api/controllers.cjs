require('../db.cjs');

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
  const { user_name, password, user_role } = req.body;

  if (user_name == null || password == null || user_role == null) {
    return res.sendStatus(403);
  }

  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const data = await client.query(
      'INSERT INTO users (firstname, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstname, surname, email, hashedPassword]
    );

    if (data.rows.length === 0) {
      res.sendStatus(403);
    }
    const user = data.rows[0];

    req.session.user = {
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
    };

    res.status(200);
    return res.json({ user: req.session.user });
  } catch (e) {
    console.error(e);
    return res.sendStatus(403);
  }
};

const loginUser = async (req, res) => {
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
  if (!req) {
    res.status(500).json({ success: false, error: 'Incorrect parameters' });
  }

  try {
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

/* const x = async (req, res) => {
    if (!req) {
        res.status(500).json({ success: false, error: 'Incorrect parameters' });
    }

    try {

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
} */

module.exports = {
  sse,
  storeSession,
  createUser,
  loginUser,
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
