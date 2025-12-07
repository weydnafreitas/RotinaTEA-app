const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    try {
      const { type, description, childId } = req.body;

      if (!type || !description || !childId) {
        return res.status(400).json({ error: "Tipo, descrição e ID do filho são obrigatórios" });
      }

      const info = await prisma.technicalInfo.create({
        data: {
          type,
          description,
          childId
        }
      });

      return res.status(201).json(info);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar informação técnica" });
    }
  },

  async getByChild(req, res) {
    try {
      const { childId } = req.params;

      const infos = await prisma.technicalInfo.findMany({
        where: { childId }
      });

      return res.json(infos);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar informações" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { type, description } = req.body;

      const info = await prisma.technicalInfo.update({
        where: { id },
        data: {
          type,
          description
        }
      });

      return res.json(info);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar informação" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.technicalInfo.delete({
        where: { id }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar informação" });
    }
  }
};