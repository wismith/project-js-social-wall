
exports.up = function(knex) {
  return knex.schema.table('messages', (table) => {
    table.integer('parent_message_id').references('messages.id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('messages', (table) => {
    table.dropColumn('parent_message_id');
  });
};
