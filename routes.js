let Router = require('express-promise-router');
let { Message } = require('./models');
let { ValidationError } = require('objection');

let router = new Router();

// GET /
router.get('/', async(request, response) => {
  let messages = await Message.query().select('*').orderBy('created_at', 'DESC');

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
  console.log(messageId);


  await Message.query()
    .findById(Number(messageId))
    .increment('likes', 1);

  response.redirect(`/#${messageId}`);
});

module.exports = router;
