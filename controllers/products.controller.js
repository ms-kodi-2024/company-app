const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const product = await Product.findOne().skip(rand);
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, client } = req.body;
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, client } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name, client } },
      { new: true }
    );
    if (!updatedProduct) res.status(404).json({ message: 'Not found' });
    else res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
    if (!deletedProduct) res.status(404).json({ message: 'Not found' });
    else res.json(deletedProduct);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
