let {snakeCaseMappers} = require('objection');
let Model = require('objection').Model;
let Password = require('objection-password')();

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
}

module.exports = User;
