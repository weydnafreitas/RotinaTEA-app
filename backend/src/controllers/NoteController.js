const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    try {
      const { childId, type, text, mediaUrl } = req.body;
      const userId = req.userId;

      if (!childId || !type || !text) {
        return res.status(400).json({ error: "Filho, tipo e texto são obrigatórios" });
      }

      const relation = await prisma.userChild.findUnique({
        where: { userId_childId: { userId, childId } }
      });

      if (!relation || relation.role !== 'ADMIN') {
        return res.status(403).json({ error: "Permissão negada (Apenas ADMIN)" });
      }

      const note = await prisma.note.create({
        data: { childId, type, text, mediaUrl }
      });

      return res.status(201).json(note);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar anotação" });
    }
  },

  async getByChild(req, res) {
    try {
      const { childId } = req.params;
      const userId = req.userId;

      const relation = await prisma.userChild.findUnique({
        where: { userId_childId: { userId, childId } }
      });

      if (!relation) {
        return res.status(403).json({ error: "Sem permissão para ver este filho" });
      }
      
      const notes = await prisma.note.findMany({
        where: { childId },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(notes);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar anotações" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { type, text, mediaUrl } = req.body;
      const userId = req.userId;

      const noteExisting = await prisma.note.findUnique({ where: { id } });

      if (!noteExisting) {
        return res.status(404).json({ error: "Anotação não encontrada" });
      }

      const relation = await prisma.userChild.findUnique({
        where: { 
          userId_childId: { 
            userId, 
            childId: noteExisting.childId 
          } 
        }
      });

      if (!relation || relation.role !== 'ADMIN') {
        return res.status(403).json({ error: "Permissão negada (Apenas ADMIN)" });
      }

      const note = await prisma.note.update({
        where: { id },
        data: { type, text, mediaUrl }
      });

      return res.json(note);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar anotação" });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const noteExisting = await prisma.note.findUnique({ where: { id } });

      if (!noteExisting) {
        return res.status(404).json({ error: "Anotação não encontrada" });
      }

      const relation = await prisma.userChild.findUnique({
        where: { 
          userId_childId: { 
            userId, 
            childId: noteExisting.childId 
          } 
        }
      });

      if (!relation || relation.role !== 'ADMIN') {
        return res.status(403).json({ error: "Permissão negada (Apenas ADMIN)" });
      }

      await prisma.note.delete({ where: { id } });
      return res.status(204).send();

    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar anotação" });
    }
  }
};