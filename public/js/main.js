(function () {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  document.querySelectorAll('[data-autocomplete]').forEach((input) => {
    const form = input.closest('form');
    const panel = form?.querySelector('[data-autocomplete-results]');
    let controller;

    input.addEventListener('input', async () => {
      const q = input.value.trim();
      if (!panel || q.length < 2) {
        if (panel) panel.innerHTML = '';
        return;
      }

      if (controller) controller.abort();
      controller = new AbortController();

      try {
        const response = await fetch(`/search/autocomplete?q=${encodeURIComponent(q)}`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        const games = await response.json();
        panel.innerHTML = games.map((game) => `
          <a href="/games/${game.slug}" class="autocomplete-item">
            <img src="${game.cover_image_url || '/uploads/placeholder-cover.svg'}" alt="">
            <span>${game.title}<small>${(game.genre || []).slice(0, 2).join(', ')}</small></span>
          </a>
        `).join('');
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      }
    });

    document.addEventListener('click', (event) => {
      if (!form.contains(event.target) && panel) panel.innerHTML = '';
    });
  });

  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const image = lightbox.querySelector('img');
    document.querySelectorAll('[data-lightbox-src]').forEach((button) => {
      button.addEventListener('click', () => {
        image.src = button.dataset.lightboxSrc;
        lightbox.classList.add('open');
      });
    });
    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => {
      lightbox.classList.remove('open');
      image.src = '';
    });
  }

  document.querySelectorAll('[data-copy-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(button.dataset.copyUrl);
      button.classList.add('copied');
      setTimeout(() => button.classList.remove('copied'), 1200);
    });
  });

  const nextLink = document.querySelector('[data-next-page]');
  const grid = document.querySelector('[data-infinite-grid]');
  if (nextLink && grid) {
    const loadMore = document.createElement('button');
    loadMore.type = 'button';
    loadMore.className = 'btn btn-outline-info mt-4 d-block mx-auto';
    loadMore.textContent = 'Load more';
    nextLink.parentElement.appendChild(loadMore);

    loadMore.addEventListener('click', async () => {
      loadMore.disabled = true;
      loadMore.textContent = 'Loading...';
      try {
        const response = await fetch(nextLink.href, { headers: { Accept: 'application/json' } });
        const result = await response.json();
        const html = result.games.map((game) => `
          <article class="game-card h-100">
            <a href="/games/${game.slug}" class="game-cover-link">
              <img src="${game.cover_image_url || '/uploads/placeholder-cover.svg'}" alt="${game.title} cover" loading="lazy" class="game-cover">
              <div class="game-overlay"><p>${game.short_description || 'Explore this release.'}</p><span class="btn btn-cyan btn-sm"><i class="bi bi-eye"></i> Details</span></div>
            </a>
            <div class="game-card-body">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <h3><a href="/games/${game.slug}">${game.title}</a></h3>
                <span class="rating-pill"><i class="bi bi-star-fill"></i> ${game.rating_average || '0.0'}</span>
              </div>
              <div class="badge-row">${(game.genre || []).slice(0, 3).map((genre) => `<a class="genre-badge" href="/games?genre=${encodeURIComponent(genre)}">${genre}</a>`).join('')}</div>
              <div class="game-meta"><span><i class="bi bi-download"></i> ${Number(game.download_count || 0).toLocaleString()}</span><span><i class="bi bi-calendar3"></i> ${game.release_year || 'Unknown'}</span></div>
            </div>
          </article>
        `).join('');
        grid.insertAdjacentHTML('beforeend', html);
        const current = new URL(nextLink.href);
        const page = Number(current.searchParams.get('page') || '1') + 1;
        if (page > result.totalPages) {
          loadMore.remove();
          nextLink.remove();
        } else {
          current.searchParams.set('page', page);
          nextLink.href = current.toString();
          loadMore.disabled = false;
          loadMore.textContent = 'Load more';
        }
      } catch (error) {
        console.error(error);
        loadMore.disabled = false;
        loadMore.textContent = 'Try again';
      }
    });
  }

  document.querySelectorAll('.reply-form input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.value.trim()) {
        input.closest('form').requestSubmit();
      }
    });
  });

  if (csrfToken) {
    window.pdgvCsrfToken = csrfToken;
  }
})();
