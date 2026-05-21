const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { requireModerator } = require('../../middleware/auth');
const modService = require('../../services/modService');
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

async function mergeHubUploads(req) {
  const cover = await uploadFile(req.files?.cover?.[0], 'mod-hubs/covers');
  const banner = await uploadFile(req.files?.banner?.[0], 'mod-hubs/banners');
  if (cover) req.body.cover_image_url = cover;
  if (banner) req.body.banner_image_url = banner;
}

async function mergeModUploads(req) {
  const cover = await uploadFile(req.files?.cover?.[0], 'mods/covers');
  const screenshots = await Promise.all((req.files?.screenshots || []).map((file) => uploadFile(file, 'mods/screenshots')));
  if (cover) req.body.cover_image_url = cover;
  if (screenshots.filter(Boolean).length) {
    const existing = req.body.screenshots ? String(req.body.screenshots).split(',') : [];
    req.body.screenshots = [...existing, ...screenshots.filter(Boolean)].join(',');
  }
}

function bodyList(value) {
  return Array.isArray(value) ? value : [value].filter(Boolean);
}

async function loadHubFormData() {
  const [categories, games] = await Promise.all([
    modService.listCategories(),
    modService.listLinkedGameOptions()
  ]);
  return { categories, games };
}

async function loadModFormData() {
  const [categories, modGames] = await Promise.all([
    modService.listCategories(),
    modService.listAdminModGames({ perPage: 200 })
  ]);
  return { categories, modGames: modGames.modGames };
}

router.get('/', async (req, res, next) => {
  try {
    const hubOptions = {
      ...req.query,
      page: req.query.hubPage || req.query.page,
      perPage: req.query.hubPerPage || req.query.perPage
    };
    const modOptions = {
      ...req.query,
      page: req.query.modPage || req.query.page,
      perPage: req.query.modPerPage || req.query.perPage
    };
    const [hubResult, modResult, comments] = await Promise.all([
      modService.listAdminModGames(hubOptions),
      modService.listAdminMods(modOptions),
      modService.listModCommentsForAdmin()
    ]);
    res.render('admin/mods', {
      layout: 'layouts/admin',
      title: 'Manage Mods',
      hubs: hubResult.modGames,
      hubPage: hubResult.page,
      hubPerPage: hubResult.perPage,
      hubTotal: hubResult.total,
      hubTotalPages: hubResult.totalPages,
      mods: modResult.mods,
      modPage: modResult.page,
      modPerPage: modResult.perPage,
      modTotal: modResult.total,
      modTotalPages: modResult.totalPages,
      modComments: comments,
      pendingModComments: comments.filter((comment) => !comment.is_approved).length,
      query: req.query
    });
  } catch (error) {
    next(error);
  }
});

router.get('/hubs/new', async (req, res, next) => {
  try {
    const data = await loadHubFormData();
    res.render('admin/mod-hub-form', {
      layout: 'layouts/admin',
      title: 'Add Mod Hub',
      modGame: null,
      selectedCategories: [],
      action: '/admin/mods/hubs',
      ...data
    });
  } catch (error) {
    next(error);
  }
});

router.post('/hubs', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), async (req, res, next) => {
  try {
    await mergeHubUploads(req);
    const modGame = await modService.createModGame(req.body, req.user.id);
    await modService.setModGameCategories(modGame.id, bodyList(req.body.category_ids));
    req.flash('success', 'Mod hub created.');
    res.redirect(`/admin/mods/hubs/${modGame.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.get('/hubs/:id/edit', async (req, res, next) => {
  try {
    const [modGame, data] = await Promise.all([
      modService.getAdminModGame(req.params.id),
      loadHubFormData()
    ]);
    res.render('admin/mod-hub-form', {
      layout: 'layouts/admin',
      title: `Edit ${modGame.title}`,
      modGame,
      selectedCategories: (modGame.categories || []).map((category) => category.id),
      action: `/admin/mods/hubs/${modGame.id}?_method=PUT`,
      ...data
    });
  } catch (error) {
    next(error);
  }
});

router.put('/hubs/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), async (req, res, next) => {
  try {
    await mergeHubUploads(req);
    const modGame = await modService.updateModGame(req.params.id, req.body);
    await modService.setModGameCategories(modGame.id, bodyList(req.body.category_ids));
    req.flash('success', 'Mod hub updated.');
    res.redirect(`/admin/mods/hubs/${modGame.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.delete('/hubs/:id', async (req, res, next) => {
  try {
    await modService.softDeleteModGame(req.params.id);
    req.flash('success', 'Mod hub unpublished.');
    res.redirect('/admin/mods');
  } catch (error) {
    next(error);
  }
});

router.get('/new', async (req, res, next) => {
  try {
    const data = await loadModFormData();
    res.render('admin/mod-form', {
      layout: 'layouts/admin',
      title: 'Add Mod',
      mod: null,
      action: '/admin/mods',
      ...data
    });
  } catch (error) {
    next(error);
  }
});

router.get('/comments', (req, res) => {
  res.redirect('/admin/mods#comments');
});

router.post('/moderation/:id/approve', async (req, res, next) => {
  try {
    await modService.updateModComment(req.params.id, { is_approved: true });
    req.flash('success', 'Mod comment approved.');
    res.redirect('/admin/mods#comments');
  } catch (error) {
    next(error);
  }
});

router.post('/moderation/:id/reject', async (req, res, next) => {
  try {
    await modService.updateModComment(req.params.id, { is_approved: false });
    req.flash('success', 'Mod comment rejected.');
    res.redirect('/admin/mods#comments');
  } catch (error) {
    next(error);
  }
});

router.post('/moderation/:id/pin', async (req, res, next) => {
  try {
    await modService.updateModComment(req.params.id, { is_pinned: req.body.is_pinned === 'true' });
    req.flash('success', 'Mod comment pin updated.');
    res.redirect('/admin/mods#comments');
  } catch (error) {
    next(error);
  }
});

router.delete('/moderation/:id', async (req, res, next) => {
  try {
    await modService.deleteModComment(req.params.id);
    req.flash('success', 'Mod comment deleted.');
    res.redirect('/admin/mods#comments');
  } catch (error) {
    next(error);
  }
});

router.post('/', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), async (req, res, next) => {
  try {
    await mergeModUploads(req);
    const mod = await modService.createMod(req.body, req.user.id);
    req.flash('success', 'Mod created.');
    res.redirect(`/admin/mods/${mod.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const [mod, data] = await Promise.all([
      modService.getAdminMod(req.params.id),
      loadModFormData()
    ]);
    res.render('admin/mod-form', {
      layout: 'layouts/admin',
      title: `Edit ${mod.title}`,
      mod,
      action: `/admin/mods/${mod.id}?_method=PUT`,
      ...data
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'screenshots', maxCount: 10 }]), async (req, res, next) => {
  try {
    await mergeModUploads(req);
    const mod = await modService.updateMod(req.params.id, req.body);
    req.flash('success', 'Mod updated.');
    res.redirect(`/admin/mods/${mod.id}/edit`);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await modService.softDeleteMod(req.params.id);
    req.flash('success', 'Mod unpublished.');
    res.redirect('/admin/mods');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/links', async (req, res, next) => {
  try {
    await modService.addModDownloadLink(req.params.id, req.body);
    req.flash('success', 'Mod download link added.');
    res.redirect(`/admin/mods/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/links/:linkId', async (req, res, next) => {
  try {
    await modService.updateModDownloadLink(req.params.linkId, { ...req.body, mod_id: req.params.id });
    req.flash('success', 'Mod download link updated.');
    res.redirect(`/admin/mods/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/links/:linkId', async (req, res, next) => {
  try {
    await modService.deleteModDownloadLink(req.params.linkId);
    req.flash('success', 'Mod download link deleted.');
    res.redirect(`/admin/mods/${req.params.id}/edit#download-links`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
