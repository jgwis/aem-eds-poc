import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  const footer = document.createElement('div');
  footer.classList.add('footer-wrapper');

  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  // Find the text block
  const textBlock = footer.querySelector('.text.block');

  if (textBlock) {
    textBlock.querySelectorAll(':scope > div').forEach((row) => {
      const cells = row.children;

      if (!cells.length) return;

      const label = cells[0]?.textContent.trim();
      const href = cells[1]?.textContent.trim();

      // Copyright row
      if (!href) {
        row.innerHTML = `<p class="copyright">${label}</p>`;
        return;
      }

      // Link row
      row.innerHTML = `
          <a href="${href}">${label}</a>
      `;
    });
  }

  block.append(footer);
}
