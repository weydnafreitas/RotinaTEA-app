const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    try {
      const { name, color } = req.body;
      const userId = req.userId;

      if (!name || !color) {
        return res.status(400).json({ error: "Nome e cor são obrigatórios" });
      }

      const category = await prisma.category.create({
        data: {
          name,
          color,
          userId
        }
      });

      return res.status(201).json(category);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar categoria" });
    }
  },

  // Listar categorias por userId
  async list(req, res) {
    try {
      const userId = req.userId;

      const categories = await prisma.category.findMany({
        where: { userId }
      });

      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  }
};