import prisma from "../config/prisma.js";

export const createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (!name || !description || price == null || stock == null) {
    return res.status(400).json({
      msg: "All fields are required!!",
    });
  }

  const normalizeName = name.trim();
  const normalizeDescription = description.trim();

  const numericPrice = Number(price);
  const numericStock = Number(stock);

  if (isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({
      msg: "Invalid Price",
    });
  }

  if (!Number.isInteger(numericStock) || numericStock < 0) {
    return res.status(400).json({
      msg: "Invalid Stock",
    });
  }

  const product = await prisma.product.create({
    data: {
      name: normalizeName,
      description: normalizeDescription,
      price: numericPrice,
      stock: numericStock,
    },
  });

  return res.status(201).json({
    msg: "Product created successfully!",
    product: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
    },
  });
};

export const getProducts = async (req, res) => {
  const products = await prisma.product.findMany();

  return res.status(200).json({
    products,
  });
};

export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        msg: "Invalid product ID",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    return res.status(200).json({ product });

  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};



export const updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const {name, description, stock, price} = req.body;

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    return res.status(404).json({
      msg: "Product not found",
    });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: id },
    data: {
      name,
      description,
      stock,
      price
    }
  });
  return res.status(200).json({
    msg: "Product updated",
    updatedProduct,
  });
};

export const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    return res.status(404).json({
      msg: "Product not found",
    });
  }

  const deleteProduct = await prisma.product.delete({ where: { id: id } });

  return res.status(200).json({
    msg: "Product deleted",
  });
};
