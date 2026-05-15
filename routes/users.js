const express = require('express');
const userService = require('../services/userService');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireLogin, async (req, res, next) => {
  try {
    const data = await userService.getProfilePage(req.user.id);
    res.render('pages/profile', {
      title: 'Your Profile',
      metaDescription: 'Manage your piracy.cloud profile, wishlist, ratings, and comment history.',
      ...data,
      editable: true
    });
  } catch (error) {
    next(error);
  }
});

router.get('/profile/edit', requireLogin, async (req, res) => {
  res.render('pages/edit-profile', {
    title: 'Edit Profile',
    metaDescription: 'Update your profile details.',
    profile: req.profile
  });
});

router.post('/profile/edit', requireLogin, async (req, res, next) => {
  try {
    await userService.updateProfile(req.user.id, req.body);
    req.flash('success', 'Profile updated.');
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const data = await userService.getProfilePage(req.params.id);
    if (!data.profile) return next();
    res.render('pages/profile', {
      title: `${data.profile.username || 'Player'} Profile`,
      metaDescription: 'Public player profile.',
      ...data,
      editable: req.user?.id === req.params.id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
