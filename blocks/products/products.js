const API_URL = 'https://dummyjson.com/products';
const PAGE_SIZE = 10;

export default async function decorate(block) {
  const title = block.querySelector('p')?.textContent.trim()
    || 'Products Details';

  let currentPage = 1;
  let totalPages = 1;

  block.innerHTML = `
    <h2 class="products-title">${title}</h2>
    <div class="products-content">
      <p>Loading products...</p>
    </div>
  `;

  const content = block.querySelector('.products-content');

  // Create page numbers
  function getPageNumbers(current, total) {
    if (total <= 5) {
      return Array.from(
        { length: total },
        (_, index) => index + 1,
      );
    }

    const pages = [1];

    if (current > 3) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  }

  // Create pagination HTML
  function createPagination() {
    let html = '';

    html += `
      <button
        type="button"
        class="pagination-prev"
        ${currentPage === 1 ? 'disabled' : ''}>
        <span>‹</span> Back
      </button>
    `;

    const pages = getPageNumbers(
      currentPage,
      totalPages,
    );

    pages.forEach((page) => {
      if (page === '...') {
        html += `
          <span class="pagination-dots">
            ...
          </span>
        `;
      } else {
        html += `
          <button type="button"
            class="pagination-number ${page === currentPage ? 'active' : ''}"
            data-page="${page}">
            ${page}
          </button>
        `;
      }
    });

    html += `
      <button
        type="button"
        class="pagination-next"
        ${currentPage === totalPages ? 'disabled' : ''}>
        Next <span>›</span>
      </button>
    `;

    return html;
  }

  // Load products
  async function loadProducts(page) {
    const skip = (page - 1) * PAGE_SIZE;

    content.innerHTML = `
      <p>Loading products...</p>
    `;

    try {
      const response = await fetch(
        `${API_URL}?limit=${PAGE_SIZE}&skip=${skip}`,
      );

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}`,
        );
      }

      const data = await response.json();

      const products = data.products || [];

      totalPages = Math.ceil(
        data.total / PAGE_SIZE,
      );

      content.innerHTML = `
        <div class="products-grid">
          ${products.map((product) => `
            <article class="product-card">
              <img
                src="${product.thumbnail}"
                alt="${product.title}">

              <h4>${product.title}</h4>

              <strong>
                $${product.price}
              </strong>
            </article>
          `).join('')}
        </div>

        <div class="products-pagination">
          ${createPagination()}
        </div>
      `;

      // eslint-disable-next-line no-use-before-define
      addPaginationEvents();
    } catch (error) {
      console.error(
        'Products API error:',
        error,
      );

      content.innerHTML = `
        <p>Unable to load products.</p>
      `;
    }
  }

  // Add pagination events
  function addPaginationEvents() {
    const pageButtons = content.querySelectorAll('.pagination-number');

    pageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        currentPage = Number(button.dataset.page);
        loadProducts(currentPage);
      });
    });

    const previousButton = content.querySelector('.pagination-prev');

    previousButton?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        loadProducts(currentPage);
      }
    });

    const nextButton = content.querySelector('.pagination-next');

    nextButton?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        loadProducts(currentPage);
      }
    });
  }

  // Initial API call
  loadProducts(currentPage);
}
