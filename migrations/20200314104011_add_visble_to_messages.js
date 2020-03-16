
exports.up = function(knex) {
  return knex.schema.table('messages', (table) => {
    table.boolean('visible').notNullable().defaultTo(1);
  })
};

exports.down = function(knex) {
  return knex.schema.table('messages', (table) => {
   table.dropColumn('visible');
  })
};
