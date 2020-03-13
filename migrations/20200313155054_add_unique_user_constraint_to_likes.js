
exports.up = function(knex) {
  return knex.schema.table('likes', (table) => {
    table.unique(['user_id', 'message_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.table('likes', (table) => {
    table.dropUnique(['user_id', 'messsage_id']);
  });
};
