let Router = require('express-promise-router');
let { Message, User, Like } = require('./models');
let { ValidationError } = require('objection');
let Password = require('objection-password');
const passport = require('passport');

let session = require('express-session');


let router = new Router();



// GET /
router.get('/', async(request, response) => {
  let messages = await Message.query()
    .select('messages.id', 'body', 'mood', 'messages.created_at', 'messages.user_id','users.screen_name', 'visible', 'messages.parent_message_id')
    .count('likes.id', {as: 'message_likes'})
    .leftJoin('likes', 'likes.message_id', 'messages.id')
    .leftJoin('users', 'users.id', 'messages.user_id')
    .groupBy('messages.id', 'users.screen_name')
    .orderBy('messages.created_at', 'DESC');

  console.log(messages);

  let messagesToDisplay = messages.filter(message => message.visible && !message.parentMessageId);
  for (let message of messagesToDisplay) {
    message['replies'] = messages.filter(each => each.parentMessageId === message.id && each.visible);
  }

  console.log(messagesToDisplay);

  if (request.user) {
    let user = request.user;

    for (let message of messages) {
      let userHasLiked = await Like.query()
        .count('likes.id')
        .where({
          'message_id': message.id,
          'user_id': user.id
        }); // this returns a 1-object array, so have to index it to get information

      console.log(userHasLiked[0]);
      message['userHasLiked'] = (Number(userHasLiked[0].count) === 1 ? true : false);

    }

    // Query the active user's messages and include them as a property in 'user'
    user['messages'] = messages.filter(message => message.userId === user.id);


    response.render('index', { messagesToDisplay, user });
  } else {
    response.render('index', { messagesToDisplay });
  }
});

// Authentication

// Show sign-up form on page
router.get('/sign-up', async(request, response) => {
  response.render('sign-up');
})

// Sign up new user and redirect to home page
router.post('/sign-up', async(request, response) => {
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

    passport.authenticate('local')(request, response, function () {
      response.redirect('/');
    });

    // response.redirect('/');

  } catch(error) {
    console.log('This registration didn\'t work!');

    if (error instanceof ValidationError) {
      let messages = await Message.query().select('*').orderBy('created_at', 'DESC');
      let errors = error.data;

      response.render('index', { messages, errors });
    } else {
      throw error;
    }
  }
});

// Show sign-in page
router.get('/sign-in', async(request, response) => {
  response.render('sign-in');
});


// Sign in user and redirect to home page
router.post('/sign-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in',
    failureFlash: true
  })
);

// Sign out user
router.get('/sign-out', function(request, response) {
  request.logout();
  response.redirect('/');
});


// POST messages
router.post('/messages', async(request, response) => {

  if (!request.user) {
    response.redirect('/sign-in');
  }

  let messageBody = request.body.body;
  let messageMood = request.body.mood;

  try {
    await Message.query().insert({
      body: messageBody,
      mood: messageMood,
      userId: request.user.id
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

  let messageId = Number(request.params.messageId);
  console.log(messageId);

  if (!request.user) {
    response.redirect('/sign-in');
    // alert('You must sign in to like messages.');
  } else {
    let user = request.user;

    // This gets the user's likes of the message, but we've already set the unique aspect for this
    let userLikes = await user.$relatedQuery('likes').where('message_id', messageId);
    let userLikeId = userLikes[0].id;

    console.log('userLikes: ', userLikes);

    /* let userHasLikedMessage = await Message.query()
      .select('*')
      .where({
        messageId: messageId,
        likes(userId): user.id
      })
      .leftJoin('likes', 'likes.message_id', 'messages.id') */
    try {
      await Like.query().insert({
        messageId: messageId,
        userId: request.user.id
      });
      console.log('Try block run');
      response.redirect(`/#${messageId}`);

    } catch {
      console.log('Catch block run');
      await Like.query().deleteById(userLikeId);
      response.redirect('/');
    }
  }
});

// Reply to a message
router.post('/messages/:messageId/reply', async(request,response) => {
  let messageId = Number(request.params.messageId);

  let messageBody = request.body.body;
  let messageMood = request.body.mood;

  if (!request.user) {
    response.redirect('/sign-in');
  } else {
    let user = request.user;

    try {
      await Message.query().insert({
        body: messageBody,
        mood: messageMood,
        parentMessageId: messageId,
        userId: user.id,
      });

      response.redirect(`/#${messageId}`);
    } catch {
      console.log('Reply failed. This is the catch block.');
      response.redirect('/');
    }
  }
});

// Toggle visibility of message (only for message author)
router.post('/messages/:messageId/toggle', async(request, response) => {
  let messageId = Number(request.params.messageId);
  let user = request.user;
  let messageObject = await Message.query().findById(messageId);
  let messageVisibility = messageObject.visible;

  if (user.id === messageObject.userId) {
    try {
      await Message.query()
        .findById(messageId)
        .patch({
          visible: !messageVisibility
        });

      response.redirect('/');
    } catch {
      response.redirect('/');
    }
  } else {
    response.redirect('/');
  }
});

module.exports = router;
