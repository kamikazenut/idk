const express = require('express');
const { requireAdmin } = require('../../middleware/auth');
const userService = require('../../services/userService');

const router = express.Router();

router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const result = await userService.listUsers(req.query);
    const usersWithStats = await Promise.all(result.users.map(async (user) => ({
      ...user,
      stats: await userService.getUserStats(user.id)
    })));
    res.render('admin/users', {
      layout: 'layouts/admin',
      title: 'Manage Users',
      ...result,
      users: usersWithStats,
      query: req.query
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/role', async (req, res, next) => {
  try {
    await userService.updateRole(req.params.id, req.body.role);
    req.flash('success', 'User role updated.');
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/ban', async (req, res, next) => {
  try {
    await userService.setBanned(req.params.id, req.body.banned === 'true');
    req.flash('success', 'User status updated.');
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
