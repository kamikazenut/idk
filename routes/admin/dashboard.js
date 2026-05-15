const express = require('express');
const { requireModerator } = require('../../middleware/auth');
const analyticsService = require('../../services/analyticsService');

const router = express.Router();

router.use(requireModerator);

router.get('/', async (req, res, next) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    const trend = await analyticsService.getTrend({ eventType: 'download', days: 14 });
    res.render('admin/dashboard', {
      layout: 'layouts/admin',
      title: 'Admin Dashboard',
      stats,
      trend
    });
  } catch (error) {
    next(error);
  }
});

router.get('/trend.json', async (req, res, next) => {
  try {
    const trend = await analyticsService.getTrend({ eventType: req.query.event || 'download', days: Number(req.query.days) || 30 });
    res.json(trend);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
