const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    try {
      const { name, birthDate, supportLevel, notes, avatarUrl } = req.body;

      const userId = req.userId; 

      if (!name || !birthDate || !supportLevel) {
        return res.status(400).json({ error: "Nome, data e nível de suporte são obrigatórios" });
      }

      const child = await prisma.child.create({
        data: {
          name,
          birthDate: new Date(birthDate),
          supportLevel: parseInt(supportLevel),
          notes,
          avatarUrl,
          
          guardians: {
            create: {
              userId: userId 
            }
          }
        }
      });

      return res.status(201).json(child);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao cadastrar filho" });
    }
  }
};