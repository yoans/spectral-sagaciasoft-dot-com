(() => {
	'use strict';

	document.documentElement.classList.add('js');
	const menuButton = document.querySelector('.nav-toggle');
	const navigation = document.querySelector('#primary-nav');
	const menuLabel = document.querySelector('.nav-toggle-label');
	const mobile = window.matchMedia('(max-width: 760px)');

	function setMenu(open, returnFocus = false) {
		navigation.classList.toggle('is-open', open);
		menuButton.setAttribute('aria-expanded', String(open));
		menuLabel.textContent = open ? 'Close' : 'Menu';
		if (returnFocus) menuButton.focus();
	}

	menuButton.hidden = false;
	menuButton.addEventListener('click', () => {
		setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
			setMenu(false, true);
		}
	});
	document.addEventListener('click', (event) => {
		if (!event.target.closest('.site-header')) setMenu(false);
	});
	navigation.addEventListener('focusout', (event) => {
		if (event.relatedTarget && !event.relatedTarget.closest('.site-header')) setMenu(false);
	});
	mobile.addEventListener('change', () => {
		const focusWasInside = navigation.contains(document.activeElement);
		setMenu(false, mobile.matches && focusWasInside);
	});

	// Move keyboard focus with same-page links, including the skip link.
	document.querySelectorAll('a[href^="#"]').forEach((link) => {
		link.addEventListener('click', (event) => {
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			const target = document.querySelector(link.getAttribute('href'));
			if (!target) return;
			setMenu(false);
			target.focus({ preventScroll: true });
		});
	});

	// Highlight the section currently being read. Content stays usable without JS.
	const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
	if ('IntersectionObserver' in window) {
		const visibleSections = new Set();
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) visibleSections.add(entry.target.id);
				else visibleSections.delete(entry.target.id);
			});
			const activeLink = [...sectionLinks].reverse().find((link) => visibleSections.has(link.hash.slice(1)));
			sectionLinks.forEach((link) => {
				if (link === activeLink) link.setAttribute('aria-current', 'location');
				else link.removeAttribute('aria-current');
			});
		}, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
		sectionLinks.forEach((link) => observer.observe(document.querySelector(link.hash)));
	}

	const copyButton = document.querySelector('.copy-email');
	const copyStatus = document.querySelector('.copy-status');
	let copyReset;
	if (navigator.clipboard && navigator.clipboard.writeText) {
		copyButton.hidden = false;
		copyButton.addEventListener('click', async () => {
			clearTimeout(copyReset);
			copyStatus.classList.remove('is-error');
			copyStatus.textContent = '';
			try {
				await navigator.clipboard.writeText('contact@sagaciasoft.com');
				copyButton.textContent = 'Copied ✓';
				copyStatus.textContent = 'Email address copied to clipboard.';
				copyReset = setTimeout(() => { copyButton.textContent = 'Copy email ⧉'; }, 2500);
			} catch {
				copyButton.textContent = 'Copy email ⧉';
				copyStatus.textContent = 'Copy unavailable. Select the email address above to copy it.';
				copyStatus.classList.add('is-error');
			}
		});
	}
})();
