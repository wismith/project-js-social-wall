
exports.up = function(knex) {
  return knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.text('body').notNullable();
    table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    // table.integer('likes').defaultTo(0).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
