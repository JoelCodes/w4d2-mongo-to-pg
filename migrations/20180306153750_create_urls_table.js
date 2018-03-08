
exports.up = function (knex, Promise) {
  return knex.schema.createTable('urls', (table) => {
    table.increments();
    table.timestamps();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.string('short_url').unique().notNullable();
    table.string('long_url').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('urls');
};
