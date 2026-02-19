import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // 🔐 Hash Password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 👤 Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@shop.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Customer One",
      email: "customer1@shop.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Customer Two",
      email: "customer2@shop.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users created");

  // 📦 Create Products (12+)
  await prisma.product.createMany({
    data: [
      { name: "Laptop", description: "Gaming laptop", price: 75000, stock: 15 },
      { name: "Phone", description: "Smartphone", price: 35000, stock: 30 },
      { name: "Headphones", description: "Noise cancelling", price: 2500, stock: 50 },
      { name: "Keyboard", description: "Mechanical keyboard", price: 1500, stock: 40 },
      { name: "Mouse", description: "Wireless mouse", price: 800, stock: 60 },
      { name: "Monitor", description: "24 inch monitor", price: 12000, stock: 20 },
      { name: "Smartwatch", description: "Fitness smartwatch", price: 7000, stock: 25 },
      { name: "Tablet", description: "Android tablet", price: 28000, stock: 18 },
      { name: "Backpack", description: "Laptop backpack", price: 2000, stock: 35 },
      { name: "Speaker", description: "Bluetooth speaker", price: 5000, stock: 22 },
      { name: "SSD", description: "1TB SSD", price: 6000, stock: 40 },
      { name: "Camera", description: "DSLR camera", price: 45000, stock: 10 },
    ],
  });

  console.log("✅ Products created");

  // 📦 Fetch Products for Relations
  const allProducts = await prisma.product.findMany();

  // 🛒 Create Cart Items
  await prisma.cartItem.createMany({
    data: [
      {
        userId: customer1.id,
        productId: allProducts[0].id,
        quantity: 2,
      },
      {
        userId: customer1.id,
        productId: allProducts[1].id,
        quantity: 1,
      },
      {
        userId: customer2.id,
        productId: allProducts[2].id,
        quantity: 3,
      },
    ],
  });

  console.log("✅ Cart items created");

  // 📦 Create Order for Customer1

  const product1 = allProducts[1]; // Phone
  const product2 = allProducts[3]; // Keyboard

  const quantity1 = 1;
  const quantity2 = 2;

  const totalAmount =
    Number(product1.price) * quantity1 +
    Number(product2.price) * quantity2;

  const order = await prisma.order.create({
    data: {
      userId: customer1.id,
      totalAmount: totalAmount,
      status: "PLACED",
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        productId: product1.id,
        quantity: quantity1,
        priceAtPurchase: product1.price,
      },
      {
        orderId: order.id,
        productId: product2.id,
        quantity: quantity2,
        priceAtPurchase: product2.price,
      },
    ],
  });

  console.log("✅ Orders created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
