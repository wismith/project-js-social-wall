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
      properties: {
        id: { type: 'integer'},
        message_id: {type: 'integer'}
      }
    };
  }
}

module.exports = Like;
