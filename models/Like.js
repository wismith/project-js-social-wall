let { Model, snakeCaseMappers } = require('objection');
// let { User, Message } = require('../models');

class Like extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get tableName() {
    return 'likes';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'messageId',
        'userId'
      ],
      properties: {
        id: { type: 'integer'},
        messageId: {type: 'integer'},
        userId: {type: 'integer'}
      }
    };
  }

  static get relationMappings() {
    let Message = require('./Message');
    let User = require('./User');
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'likes.user_id',
          to: 'users.id'
        }
      },
      message: {
        relation: Model.HasOneRelation,
        modelClass: Message,
        join: {
          from: 'likes.message_id',
          to: 'messages.id'
        }
      }
    }
  }
}

module.exports = Like;
