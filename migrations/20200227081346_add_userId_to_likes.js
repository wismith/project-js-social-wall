exports.up = function(knex) {
  return knex.schema.table('likes', (table) => {
    table.integer('user_id').notNullable().references('users.id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('likes', (table) => {
    table.dropColumn('user_id');
  });
};
