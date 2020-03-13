exports.up = function(knex) {
  return knex.schema.createTable('likes', (table) => {
    table.increments('id').primary();
    table.integer('message_id').notNullable().references('messages.id');
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6)).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('likes');
};
