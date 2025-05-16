const User = require('../src/model/user.model');

module.exports = {
  async PostUser(call, callback) {
    const { name, email, preferences } = call.request;
    try {
      const user = await User.create({ name, email, preferences });
      callback(null, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        preferences: user.preferences
      });
    } catch (err) {
      callback(err);
    }
  },

  async GetUser(call, callback) {
    try {
      const user = await User.findById(call.request.id);
      if (!user) return callback(new Error('User not found'));

      callback(null, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        preferences: user.preferences
      });
    } catch (err) {
      callback(err);
    }
  }
};