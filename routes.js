let Router = require('express-promise-router');
let { Message } = require('./models');
let { ValidationError } = require('objection');

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

  response.render('index', { messages });
});

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
