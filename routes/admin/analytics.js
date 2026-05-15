const express = require('express');
const { requireModerator } = require('../../middleware/auth');
const analyticsService = require('../../services/analyticsService');

const router = express.Router();

router.use(requireModerator);

router.get('/', async (req, res, next) => {
  try {
    const analytics = await analyticsService.getAdminAnalytics();
    res.render('admin/analytics', {
      layout: 'layouts/admin',
      title: 'Analytics',
      analytics
    });
  } catch (error) {
    next(error);
  }
});

router.get('/data.json', async (req, res, next) => {
  try {
    res.json(await analyticsService.getAdminAnalytics());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
