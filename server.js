const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/products', productRoutes);

app.get('/', (req, res) => {
  res.json({

    
    message: 'Products API with Caching and Layered Architecture',


    endpoints: {
      getProducts: 'GET /products',
      getProductById: 'GET /products/:id',
      createProduct: 'POST /products',
      updateProduct: 'PUT /products/:id',
      patchProduct: 'PATCH /products/:id',
      deleteProduct: 'DELETE /products/:id',


    },


  });


});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
