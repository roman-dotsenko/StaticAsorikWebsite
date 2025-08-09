document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('project-list');

    // Event delegation for dynamically added cards
    if (container) {
        container.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card || !container.contains(card)) return;
            const project = {
                title: card.dataset.title,
                image: card.dataset.image,
                description: card.dataset.description,
                tags: (card.dataset.tags || '').split(',').filter(Boolean),
                liveUrl: card.dataset.liveUrl,
                githubUrl: card.dataset.githubUrl,
            };
            openModal(project);
        });
    }

    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalButton = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalLinks = document.getElementById('modal-links');

    async function openModal(project) {
        if (!modal) return;

        // Populate text content first (cheap operations)
        modalTitle.textContent = project.title || '';
        modalDescription.textContent = project.description || '';
        modalTags.innerHTML = (project.tags || []).map(tag => `<span class="modal-tag">${tag}</span>`).join('');

        // Build links
        let linksHTML = '';
        if (project.liveUrl && project.liveUrl !== '#') {
            linksHTML += `<a href="${project.liveUrl}" target="_blank" class="modal-link primary">Live Demo <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>`;
        }
        if (project.githubUrl && project.githubUrl !== '#') {
            linksHTML += `<a href="${project.githubUrl}" target="_blank" class="modal-link secondary">Source Code <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4 4-4"></path></svg></a>`;
        }
        modalLinks.innerHTML = linksHTML;

        // Preload image off-DOM to avoid jank during reveal
        const url = project.image || '';
        if (url) {
            try {
                const img = new Image();
                img.decoding = 'async';
                img.src = url;
                await img.decode();
            } catch {
                // ignore decode errors; fallback to direct assign
            }
            modalImage.loading = 'eager';
            modalImage.decoding = 'async';
            modalImage.src = url;
            modalImage.alt = project.title || 'Project Image';
        } else {
            modalImage.removeAttribute('src');
            modalImage.alt = 'Project Image';
        }

        // GPU hint for smoother animation
        if (modalContent) modalContent.style.willChange = 'transform, opacity';
        if (modal) modal.style.willChange = 'opacity';

        // Reveal on next frame to let the browser batch style changes
        requestAnimationFrame(() => {
            modal.classList.add('visible');
            if (modalContent) modalContent.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('visible');
        if (modalContent) modalContent.classList.remove('visible');
        document.body.style.overflow = 'auto';
        // Remove GPU hint after closing
        if (modalContent) modalContent.style.willChange = '';
        if (modal) modal.style.willChange = '';
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on ESC for better UX
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
