let { Model, snakeCaseMappers } = require('objection');

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
}

module.exports = Like;
