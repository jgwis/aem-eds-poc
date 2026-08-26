const API_URL = 'https://dummyjson.com/products?limit=12';

export default async function decorate(block) {
  const title = block.querySelector('p')?.textContent.trim() || 'Products Details';

  block.innerHTML = `
    <h2 class="products-title">${title}</h2>
    <p>Loading products...</p>
  `;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    const products = data.products || [];

    block.innerHTML = `
      <h2 class="products-title">${title}</h2>

      <div class="products-grid">
        ${products.map((product) => `
          <article class="product-card">
            <img src="${product.thumbnail}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <strong>$${product.price}</strong>
          </article>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Products API error:', error);

    block.innerHTML = `
      <h2 class="products-title">${title}</h2>
      <p>Unable to load products.</p>
    `;
  }
}
