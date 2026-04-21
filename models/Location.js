const { query } = require('../config/db');

class Location {
  // Get all countries
  static async getAllCountries() {
    return await query('SELECT * FROM countries ORDER BY name ASC');
  }

  // Get cities by country
  static async getCitiesByCountry(countryId) {
    return await query('SELECT * FROM cities WHERE country_id = ? ORDER BY name ASC', [countryId]);
  }

  // Get city detail
  static async getCityById(id) {
    const cities = await query('SELECT * FROM cities WHERE id = ?', [id]);
    return cities.length > 0 ? cities[0] : null;
  }
}

module.exports = Location;
