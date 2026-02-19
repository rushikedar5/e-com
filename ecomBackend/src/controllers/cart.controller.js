import prisma from "../config/prisma.js";

export const addCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (productId == null || quantity == null) {
      return res.status(400).json({
        msg: "Product ID and quantity are required",
      });
    }

    const numericProductId = Number(productId);
    const numericQuantity = Number(quantity);

    if (
      !Number.isInteger(numericProductId) ||
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return res.status(400).json({
        msg: "Invalid product ID or quantity",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: numericProductId },
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    if (numericQuantity > product.stock) {
      return res.status(409).json({
        msg: "Requested quantity exceeds available stock",
      });
    }

    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: numericProductId,
        },
      },
    });

    if (!existingCartItem) {
      const newCartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId: numericProductId,
          quantity: numericQuantity,
          priceAtAdd: product.price,
        },
      });

      return res.status(201).json({
        msg: "Item added to cart",
        cartItem: newCartItem,
      });
    }

    const newQuantity = existingCartItem.quantity + numericQuantity;

    if (newQuantity > product.stock) {
      return res.status(409).json({
        msg: "Requested quantity exceeds available stock",
      });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: newQuantity,
      },
    });

    return res.status(200).json({
      msg: "Cart updated",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedCart = cartItems.map((item) => {
      const subtotal = item.quantity * item.priceAtAdd;

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        priceAtAdd: item.priceAtAdd,
        subtotal,
      };
    });

    const totalAmount = formattedCart.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    return res.status(200).json({
      cartItems: formattedCart,
      totalAmount,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (cartItemId == null || quantity == null) {
      return res.status(400).json({
        msg: "Cart item ID and quantity are required",
      });
    }

    const numericCartItemId = Number(cartItemId);
    const numericQuantity = Number(quantity);

    if (
      !Number.isInteger(numericCartItemId) ||
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return res.status(400).json({
        msg: "Invalid cart item ID or quantity",
      });
    }

    const existingCart = await prisma.cartItem.findFirst({
      where: {
        id: numericCartItemId,
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (!existingCart) {
      return res.status(404).json({
        msg: "Cart item not found",
      });
    }

    if (numericQuantity > existingCart.product.stock) {
      return res.status(409).json({
        msg: "Requested quantity exceeds available stock",
      });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: numericCartItemId },
      data: {
        quantity: numericQuantity,
      },
    });

    return res.status(200).json({
      msg: "Cart updated",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    if (cartItemId == null) {
      return res.status(400).json({
        msg: "Cart item ID is required",
      });
    }

    const numericCartItemId = Number(cartItemId);

    if (!Number.isInteger(numericCartItemId)) {
      return res.status(400).json({
        msg: "Invalid cart item ID",
      });
    }

    const existingCart = await prisma.cartItem.findFirst({
      where: {
        id: numericCartItemId,
        userId: req.user.id,
      },
    });

    if (!existingCart) {
      return res.status(404).json({
        msg: "Cart item not found",
      });
    }

    await prisma.cartItem.delete({
      where: { id: numericCartItemId },
    });

    return res.status(200).json({
      msg: "Item removed from cart",
    });
  } catch (error) {
    console.error("Delete cart error:", error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};
