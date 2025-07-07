const db = require('../config/db');

// ➕ Add Product (Admin Only)
exports.addProduct = (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const sql = `
    INSERT INTO products (name, description, price, category)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [name, description, price, category], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: 'Product added successfully',
      productId: this.lastID
    });
  });
};

// ✅ Get All Products with Pagination and Search
exports.getAllProducts = (req, res) => {
  const { page = 1, limit = 5, search = '' } = req.query;
  const offset = (page - 1) * limit;
  const query = `%${search}%`;

  const sql = `
    SELECT * FROM products
    WHERE name LIKE ? OR category LIKE ?
    LIMIT ? OFFSET ?
  `;

  db.all(sql, [query, query, parseInt(limit), parseInt(offset)], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
};

// 🔍 Get a Single Product by ID
exports.getProductById = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM products WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(row);
  });
};

// 📝 Update Product by ID (Admin Only)
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  const sql = `
    UPDATE products
    SET name = ?, description = ?, price = ?, category = ?
    WHERE id = ?
  `;

  db.run(sql, [name, description, price, category, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  });
};

// 🗑️ Delete Product by ID (Admin Only)
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM products WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  });
};
