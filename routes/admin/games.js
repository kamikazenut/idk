const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { requireModerator } = require('../../middleware/auth');
const gameService = require('../../services/gameService');
const supabaseAdmin = require('../../lib/supabaseAdmin');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 12 } });
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'game-media';

router.use(requireModerator);

async function uploadFile(file, folder) {
  if (!file) return null;
  const extension = file.originalname.split('.').pop() || 'bin';
  const path = `${folder}/${uuidv4()}.${extension}`;
  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false
  });
  if (error) throw error;
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function mergeUploads(req) {
  const cover = await uploadFile(req.files?.cover?.[0], 'covers');
  const banner = await uploadFile(req.files?.banner?.[0], 'banners');
  const screenshots = await Promise.all((req.files?.screenshots || []).map((file) => uploadFile(file, 'screenshots')));

  if (cover) req.body.cover_image_url = cover;
  if (banner) req.body.banner_image_url = banner;
  if (screenshots.filter(Boolean).length) {
    const existing = req.body.screenshots ? String(req.body.screenshots).split(',') : [];
    req.body.screenshots = [...existing, ...screenshots.filter(Boolean)].join(',');
  }
}

router.get('/', async (req, res, next) => {
  try {
    const result = await gameService.listAdminGames(req.query);
    res.render('admin/games', {
      layout: 'layouts/admin',
      title: 'Manage Games',
      ...result,
      query: req.query
    });
  } catch (error) {
    next(error);
  }
});

router.get('/new', async (req, res, next) => {
  try {
    const tags = await gameService.getTags();
    res.render('admin/game-form', {
      layout: 'layouts/admin',
      title: 'Add Game',
      game: null,
      tags,
      selectedTags: [],
      action: '/admin/games'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'banner', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), async (req, res, next) => {
  try {
    await mergeUploads(req);
    const game = await gameService.createGame(req.body, req.user.id);
    await gameService.setGameTags(game.id, Array.isArray(req.body.tag_ids) ? req.body.tag_ids : [req.body.tag_ids].filter(Boolean));
    req.flash('success', 'Game created.');
    res.redirect(`/admin/games/${game.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const [game, tags] = await Promise.all([
      gameService.getGameForAdmin(req.params.id),
      gameService.getTags()
    ]);
    const selectedTags = (game.tags || []).map((tag) => tag.id);
    res.render('admin/game-form', {
      layout: 'layouts/admin',
      title: `Edit ${game.title}`,
      game,
      tags,
      selectedTags,
      action: `/admin/games/${game.id}?_method=PUT`
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'banner', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), async (req, res, next) => {
  try {
    await mergeUploads(req);
    const game = await gameService.updateGame(req.params.id, req.body);
    await gameService.setGameTags(game.id, Array.isArray(req.body.tag_ids) ? req.body.tag_ids : [req.body.tag_ids].filter(Boolean));
    req.flash('success', 'Game updated.');
    res.redirect(`/admin/games/${game.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await gameService.softDeleteGame(req.params.id);
    req.flash('success', 'Game unpublished.');
    res.redirect('/admin/games');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/links', async (req, res, next) => {
  try {
    await gameService.addDownloadLink(req.params.id, req.body);
    req.flash('success', 'Download link added.');
    res.redirect(`/admin/games/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/links/:linkId', async (req, res, next) => {
  try {
    await gameService.updateDownloadLink(req.params.linkId, { ...req.body, game_id: req.params.id });
    req.flash('success', 'Download link updated.');
    res.redirect(`/admin/games/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/links/:linkId', async (req, res, next) => {
  try {
    await gameService.deleteDownloadLink(req.params.linkId);
    req.flash('success', 'Download link deleted.');
    res.redirect(`/admin/games/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
