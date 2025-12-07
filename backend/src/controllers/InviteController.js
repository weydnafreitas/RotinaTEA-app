const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async invite(req, res) {
    try {
      const { email, childId } = req.body;
      const adminId = req.userId;
      if (!email || !childId) {
        return res.status(400).json({ error: "E-mail e ID do filho são obrigatórios" });
      }

      const adminRelation = await prisma.userChild.findUnique({
        where: {
          userId_childId: { userId: adminId, childId }
        }
      });

      if (!adminRelation || adminRelation.role !== 'ADMIN') {
        return res.status(403).json({ error: "Apenas administradores podem enviar convites." });
      }

      const userToInvite = await prisma.user.findUnique({
        where: { email }
      });

      if (!userToInvite) {
        return res.status(404).json({ error: "Usuário não encontrado. Peça para ele baixar o app e criar uma conta primeiro." });
      }

      const existingRelation = await prisma.userChild.findUnique({
        where: {
          userId_childId: { userId: userToInvite.id, childId }
        }
      });

      if (existingRelation) {
        return res.status(400).json({ error: "Este usuário já tem acesso a este filho." });
      }

      await prisma.userChild.create({
        data: {
          userId: userToInvite.id,
          childId: childId,
          role: 'VIEWER'
        }
      });

      return res.status(201).json({ message: `Convite aceito! ${userToInvite.name} agora pode visualizar as rotinas.` });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao convidar usuário." });
    }
  }
};