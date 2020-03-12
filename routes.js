let Router = require('express-promise-router');
let { Message, User, Like } = require('./models');
let { ValidationError } = require('objection');
let Password = require('objection-password');

let router = new Router();



// GET /
router.get('/', async(request, response) => {
  let messages = await Message.query()
    .select('messages.id', 'body', 'mood', 'messages.created_at')
    .count('likes.id', {as: 'message_likes'})
    .leftJoin('likes', 'likes.message_id', 'messages.id')
    .groupBy('messages.id')
    .orderBy('messages.created_at', 'DESC');

  console.log(messages);

  // for (let message of messages) {
  //   message['messageLikes'] = Number(message['messageLikes']);
  // }

  if (user) {
    response.render('index', { messages, user });
  } else {
    response.render('index', { messages });
  }
});

// Register

router.post('/register', async(request, response) => {
  let newEmail = request.body.email;
  let newPassword = request.body.password;
  let newScreenName = request.body.screenName;

  try {
    const user = await User.query().insert({
      email: newEmail,
      password: newPassword,
      screenName: newScreenName,
    });

    console.log('New User: ', user);

    response.redirect(`/?user=${user}`);
  } catch(error) {
    console.log('This registration didn\'t work!');
    console.log(request.body);

    if (error instanceof ValidationError) {
      let messages = await Message.query().select('*').orderBy('created_at', 'DESC');
      let errors = error.data;

      response.render('index', { messages, errors });
    } else {
      throw error;
    }
  }
})

// POST /messages
router.post('/messages', async(request, response) => {

  let messageBody = request.body.body;
  let messageTime = new Date();
  console.log(request.body.mood);
  let messageMood = request.body.mood;

  try {
    await Message.query().insert({
      body: messageBody,
      mood: messageMood,
      createdAt: messageTime,
      // userId: ??
    });

    response.redirect('/');
  } catch(error) {
    if (error instanceof ValidationError) {
      let messages = await Message.query().select('*').orderBy('created_at', 'DESC');
      let errors = error.data;

      response.render('index', { messages, errors });
    } else {
      throw error;
    }
  }
});

// LIKE a message
router.post('/messages/:messageId/like', async(request, response) => {

  let messageId = request.params.messageId;
  let likeTime = new Date();
  console.log(messageId);


  await Like.query().insert({
    messageId: messageId,
    createdAt: likeTime
  });

  response.redirect(`/#${messageId}`);
});

module.exports = router;
