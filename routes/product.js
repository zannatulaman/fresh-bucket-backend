const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.post("/create", async (req, res, next) => {
  try {
    //    console.log('Req', req.body);

    const productExist = await Product.findOne({ name: req.body.name });

    if (productExist) {
      return res.status(409).json({
        message: "Product already exists",
      });
    }

    const product = await Product.create(req.body);

    if (product) {
      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/get", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log("Error Occurred while fetching products", error);
    res.status(400).json({
      message: "Product fetching failed",
    });
  }
});

router.get("/get/p2", async (req, res) => {
  try {
    const products = await Product.find();
    const filteredProducts = products.filter((item) => item.price === 14.99);
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.log("Error Occurred while fetching products", error);
    res.status(400).json({
      message: "Product fetching failed",
    });
  }
});

router.get("/get/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const products = await Product.find();
    const result = products.filter((item) => item.type === type);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error Occurred while fetching products", error);
    res.status(400).json({
      message: "Product fetching failed",
    });
  }
});

router.patch("/update/:id", async (req, res) => {
  const productId = req.params.id;

  const productExist = await Product.findById(productId);

  console.log(productId);

  if (!productExist) {
    throw new Error("Product doesn't exist");
  }

  const result = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
  });
  res.status(200).json({
    message: "Product updated sucessfully",
    data: result,
  });
});

router.delete("/delete/:id", async (req, res) => {
  const productId = req.params.id;
  //    console.log('productId', productId);
  try {
    const deleteProduct = await Product.findByIdAndDelete(productId);
    console.log("deleteProduct", deleteProduct);

    if (deleteProduct.deletedCount === 0) {
      res.status(402).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product is deleted",
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(400).json({
      message: "Product delete failed",
    });
  }
});

router.get("/get/product/:id", async (req, res) => {
  const productId = req.params.id;

  const productExist = await Product.findById(productId);

  if (!productExist) {
    throw new Error("Product doesn't exist");
  }

  try {
    const result = await Product.findById(productId);
    res.status(200).json({
      message: "Product updated sucessfully",
      data: result,
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(400).json({
      message: "Product not found",
    });
  }
});

module.exports = router;
