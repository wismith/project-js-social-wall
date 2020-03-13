exports.up = function(knex) {
  return knex.schema.table('messages', (table) => {
    table.integer('likes');
  });
};

exports.down = function(knex) {
  return knex.schema.table('messages', (table) => {
    table.dropColumn('likes');
  })
};
