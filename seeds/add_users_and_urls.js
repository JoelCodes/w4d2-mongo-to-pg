const bcrypt = require('bcrypt');

function callbackSeedFunction(knex, Promise) {
  knex('urls')
    .del()
    .asCallback(() => {
      knex('users').del()
        .asCallback(() => {
          const joel = {
            email: 'joel@joel.joel',
            password: bcrypt.hashSync('joel', 10),
          };
          const stew = {
            email: 'stew@stew.stew',
            password: bcrypt.hashSync('stew', 10),
          };
          knex('users')
            .insert([joel, stew])
            .returning('*')
            .asCallback((err, users) => {
              const [joel, stew] = users;
              const urls = [{
                short_url: 'a1234z',
                long_url: 'http://reddit.com/r/aww',
                user_id: joel.id,
              }, {
                short_url: 'b1234y',
                long_url: 'http://reddit.com/r/peoplefuckingdying',
                user_id: stew.id,
              }];
              knex('urls')
                .insert(urls);
            });
        });
    });
}

function promiseSeed(knex, Promise) {
  const deleteUrls = knex('urls').del();
  const deleteUrlsThenUsers = deleteUrls.then(() => knex('users').del());
  const createUsers = deleteUrlsThenUsers
    .then(() => {
      const joel = {
        email: 'joel@joel.joel',
        password: bcrypt.hashSync('joel', 10),
      };
      const stew = {
        email: 'stew@stew.stew',
        password: bcrypt.hashSync('stew', 10),
      };
      return knex('users')
        .insert([joel, stew])
        .returning('*');
    });
  const createUrls = createUsers
    .then((users) => {
      const [joel, stew] = users;
      const urls = [{
        short_url: 'a1234z',
        long_url: 'http://reddit.com/r/aww',
        user_id: joel.id,
      }, {
        short_url: 'b1234y',
        long_url: 'http://reddit.com/r/peoplefuckingdying',
        user_id: stew.id,
      }];
      return knex('urls')
        .insert(urls);
    });
  return createUrls;
}

async function asyncSeed(knex) {
  await knex('urls').del();
  await knex('users').del();

  const [joel, stew] = await knex('users')
    .insert([{
      email: 'joel@joel.joel',
      password: bcrypt.hashSync('joel', 10),
    }, {
      email: 'stew@stew.stew',
      password: bcrypt.hashSync('stew', 10),
    }])
    .returning('*');


  await knex('urls')
    .insert([{
      short_url: 'a1234z',
      long_url: 'http://reddit.com/r/aww',
      user_id: joel.id,
    }, {
      short_url: 'b1234y',
      long_url: 'http://reddit.com/r/peoplefuckingdying',
      user_id: stew.id,
    }]);
}
exports.seed = asyncSeed;
