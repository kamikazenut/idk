const express = require('express');
const { requireModerator } = require('../../middleware/auth');
const analyticsService = require('../../services/analyticsService');

const router = express.Router();

router.use(requireModerator);

router.get('/', async (req, res, next) => {
  try {
    const comments = await analyticsService.listPendingComments();
    res.render('admin/comments', {
      layout: 'layouts/admin',
      title: 'Comment Moderation',
      comments,
      filter: req.query.filter || 'all'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/approve', async (req, res, next) => {
  try {
    await analyticsService.updateComment(req.params.id, { is_approved: true });
    req.flash('success', 'Comment approved.');
    res.redirect('/admin/comments');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/reject', async (req, res, next) => {
  try {
    await analyticsService.updateComment(req.params.id, { is_approved: false });
    req.flash('success', 'Comment rejected.');
    res.redirect('/admin/comments');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/pin', async (req, res, next) => {
  try {
    await analyticsService.updateComment(req.params.id, { is_pinned: req.body.is_pinned === 'true' });
    req.flash('success', 'Comment pin updated.');
    res.redirect('/admin/comments');
  } catch (error) {
    next(error);
  }
});

router.post('/bulk', async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body.comment_ids) ? req.body.comment_ids : [req.body.comment_ids].filter(Boolean);
    await Promise.all(ids.map((id) => {
      if (req.body.action === 'approve') return analyticsService.updateComment(id, { is_approved: true });
      if (req.body.action === 'reject') return analyticsService.updateComment(id, { is_approved: false });
      if (req.body.action === 'delete') return analyticsService.deleteComment(id);
      return Promise.resolve();
    }));
    req.flash('success', 'Bulk action complete.');
    res.redirect('/admin/comments');
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await analyticsService.deleteComment(req.params.id);
    req.flash('success', 'Comment deleted.');
    res.redirect('/admin/comments');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
