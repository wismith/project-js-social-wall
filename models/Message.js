let { Model, snakeCaseMappers } = require('objection');

Like = require('./Like');

class Message extends Model {
  static get columnNameMappers() {
    /*
      In JavaScript we want camel case (e.g., createdAt), but
      in SQL we want snake case (e.g., created_at).

      snakeCaseMappers tells Objection to translate between
      the two.
    */
    return snakeCaseMappers();
  }

  static get tableName() {
    return 'messages';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'body',
      ],
      properties: {
        id: { type: 'integer' },
        body: { type: 'string', minLength: 1 },
        user_id: { type: 'integer'}
      }
    };
  }

  // static relationMappings = {
  //   likes: {
  //     relation: Model.HasManyRelation,
  //     modelClass: Like,
  //     join: {
  //       from: 'message.id',
  //       to: 'likes.message_id'
  //     }
  //   }
  // };
}

module.exports = Message;
