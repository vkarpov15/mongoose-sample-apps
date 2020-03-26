'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

module.exports = async function() {
  const promises = Object.values(mongoose.models).
    map(Model => Model.deleteMany());
  await Promise.all(promises);

  const user = await mongoose.model('User').create({
    firstName: 'Taco',
    lastName: 'MacArthur',
    email: 'taco@theleague.com'
  });

  const secret = await bcrypt.hash('taco', 4);
  await mongoose.model('AuthenticationMethod').create({ user, secret });

  const _id = 'Bi7b6nB4IekLQmx1tRW2RX/vt020j1DmvhCSHzHJyBvO8f+' +
    'ukAAf7IVSJX8epDruTRw=';
  await mongoose.model('AccessToken').create({ user, _id });
};

if (require.main === module) {
  require('../src/models/User');

  module.exports().
    then(() => {
      console.log('Done');
      process.exit(0);
    }).
    catch(err => {
      console.log('Error:', err.stack);
      process.exit(-1);
    });
}