exports.up = function(knex) {
  return knex.schema.table('messages', (table) => {
    table.text('mood');
  });
}

exports.down = function(knex) {
  return knex.schema.table('messages', (table) => {
    table.dropColumn('mood');
  });
}
