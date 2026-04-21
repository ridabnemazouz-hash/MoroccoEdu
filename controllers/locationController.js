const Location = require('../models/Location');

// @desc    Get all countries
// @route   GET /api/locations/countries
// @access  Public
exports.getCountries = async (req, res) => {
  try {
    const countries = await Location.getAllCountries();
    res.json({
      success: true,
      data: countries
    });
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all cities for a country
// @route   GET /api/locations/countries/:countryId/cities
// @access  Public
exports.getCitiesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    const cities = await Location.getCitiesByCountry(countryId);
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
