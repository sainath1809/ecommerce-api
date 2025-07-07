// script.js
fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('product-list');
    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <p>${product.description || ''}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      container.appendChild(div);
    });
  });

function addToCart(productId) {
  const token = localStorage.getItem('token'); // make sure to store JWT here on login
  fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ product_id: productId, quantity: 1 })
  })
    .then(res => res.json())
    .then(data => alert(data.message || 'Added to cart!'));
}
