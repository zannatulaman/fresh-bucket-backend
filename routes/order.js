const express = require("express");
const Order = require("../models/Order");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/create-order", auth, async (req, res, next) => {
  try {
    const { userId, productId, quantity, price } = req.body;

    // Validate required fields
    if (!userId || !productId || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const order = new Order({
      userId,
      productId,
      quantity,
      price,
    });

    await order.save();
    res.status(201).json({
      success: true,
      message: "Order created sucessfull",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/update-order/:id", auth, async (req, res, next) => {
  const orderId = req.params.id;

  console.log(orderId);

  const orderExist = await Order.findById(orderId);

  if (!orderExist) {
    res.status(401).json({
      success: false,
      message: "Order not found",
    });
  }

  const result = await Order.findByIdAndUpdate(orderId, req.body, {
    new: true,
  });
  res.status(200).json({
    message: "Order updated sucessfully",
    data: result,
  });
});

router.delete("/delete-order/:id", auth, async (req, res, next) => {
  const orderId = req.params.id;

  console.log(orderId);

  try {
    const deleteOrder = await Order.findByIdAndDelete(orderId);

    if (deleteOrder.deletedCount === 0) {
      res.status(402).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      message: "Order is deleted",
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(400).json({
      message: "Order delete failed",
    });
  }
});

router.get("/get-all-order", async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // Populate user details (only name & email)
      .populate("productId"); // Populate product details (only name & price)
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error Occurred while fetching orders", error);
    res.status(400).json({
      message: "Order fetching failed",
    });
  }
});

router.get("/get-my-order", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    console.log(userId);

    const orders = await Order.find({ userId })
      .populate("userId", "name email") // Populate user details (only name & email)
      .populate("productId"); // Populate product details (only name & price)
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error Occurred while fetching orders", error);
    res.status(400).json({
      message: "Order fetching failed",
    });
  }
});

module.exports = router;
