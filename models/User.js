let {snakeCaseMappers} = require('objection');
let Model = require('objection').Model;
let Password = require('objection-password')();
// let { Message, Like } = require('../models');

class User extends Password(Model) {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'email',
        'password',
        'screenName'
      ],
      properties: {
        id: {type: 'integer'},
        email: { type: 'string', minLength: 5},
        password: { type: 'string', minLength: 6},
        screenName: {type: 'string', minLength: 5}
      }
    };
  }

  static get relationMappings() {
    let Message = require('./Message');
    let Like = require('./Like');
    return {
      messages: {
        relation: Model.HasManyRelation,
        modelClass: Message,
        join: {
          from: 'users.id',
          to: 'messages.user_id'
        }
      },
      likes: {
        relation: Model.HasManyRelation,
        modelClass: Like,
        join: {
          from: 'users.id',
          to: 'likes.user_id'
        }
      }
    }
  }
}

module.exports = User;
