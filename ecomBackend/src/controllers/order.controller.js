import prisma from "../config/prisma.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Fetch cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        msg: "Cart is empty",
      });
    }

    // 2️⃣ Start transaction
    const order = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      // 3️⃣ Deduct stock atomically
      for (const item of cartItems) {
        const price = item.priceAtAdd ?? item.product.price;
        totalAmount += Number(price) * item.quantity;

        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count === 0) {
          throw new Error(
            `Insufficient stock for product ID ${item.productId}`
          );
        }
      }

      // 4️⃣ Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
        },
      });

      // 5️⃣ Create OrderItems
      for (const item of cartItems) {
        const price = item.priceAtAdd ?? item.product.price;

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: price,
          },
        });
      }

      // 6️⃣ Clear cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return res.status(201).json({
      msg: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return res.status(409).json({
      msg: error.message || "Checkout failed",
    });
  }
};
