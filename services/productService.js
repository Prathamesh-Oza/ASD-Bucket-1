const db = require('../database/db');

async function getAllProducts() {
  return await db.delayReadFile();
}

async function getProductById(id) {
  const products = await db.delayReadFile();
  const product = products.find((item) => item.id === Number(id));
  return product || null;
}

async function createProduct(productData) {
  const products = await db.readData();
  const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = {
    id: nextId,
    name: productData.name,
    price: Number(productData.price),
  };
  products.push(newProduct);
  await db.writeData(products);
  return newProduct;
}

async function updateProduct(id, productData) {
  const products = await db.readData();
  const index = products.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return null;
  }
  const updatedProduct = {
    id: Number(id),
    name: productData.name,
    price: Number(productData.price),
  };
  products[index] = updatedProduct;
  await db.writeData(products);
  return updatedProduct;
}

async function patchProduct(id, patchData) {
  const products = await db.readData();
  const index = products.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return null;
  }
  const currentProduct = products[index];
  const updatedProduct = {
    ...currentProduct,
    ...patchData,
    id: Number(id),
  };
  if (patchData.price !== undefined) {
    updatedProduct.price = Number(patchData.price);
  }
  products[index] = updatedProduct;
  await db.writeData(products);
  return updatedProduct;
}

async function deleteProduct(id) {
  const products = await db.readData();
  const index = products.findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return null;
  }
  const [deletedProduct] = products.splice(index, 1);
  await db.writeData(products);
  return deletedProduct;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
};
