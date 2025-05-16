const Travel = require('../src/model/travel.model');

module.exports = {
  
  async PostTravel(call, callback) {
    const { name, type, weather } = call.request;
    try {
      const travel = await Travel.create({ name, type, weather });
      callback(null, {
        id: travel._id.toString(),
        name: travel.name,
        type: travel.type,
        weather: travel.weather
      });
    } catch (err) {
      callback(err);
    }
  },


  async GetTravel(call, callback) {
    try {
      const travel = await Travel.findById(call.request.id);
      if (!travel) return callback(new Error('Travel not found'));

      callback(null, {
        id: travel._id.toString(),
        name: travel.name,
        type: travel.type,
        weather: travel.weather
      });
    } catch (err) {
      callback(err);
    }
  },


  async GetAllTravels(call, callback) {
    try {
      const travels = await Travel.find();
      const travelList = travels.map(travel => ({
        id: travel._id.toString(),
        name: travel.name,
        type: travel.type,
        weather: travel.weather
      }));

      callback(null, { travels: travelList });
    } catch (err) {
      callback(err);
    }
  }
};
