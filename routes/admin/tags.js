const express = require('express');
const { requireModerator } = require('../../middleware/auth');
const gameService = require('../../services/gameService');

const router = express.Router();

router.use(requireModerator);

router.get('/', async (req, res, next) => {
  try {
    const tags = await gameService.getTags();
    res.render('admin/tags', {
      layout: 'layouts/admin',
      title: 'Tags & Categories',
      tags
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await gameService.createTag(req.body);
    req.flash('success', 'Tag created.');
    res.redirect('/admin/tags');
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await gameService.updateTag(req.params.id, req.body);
    req.flash('success', 'Tag updated.');
    res.redirect('/admin/tags');
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await gameService.deleteTag(req.params.id);
    req.flash('success', 'Tag deleted.');
    res.redirect('/admin/tags');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
