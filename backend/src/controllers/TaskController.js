const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(req, res) {
    try {
      const { 
        name, 
        childId, 
        categoryId, 
        time, 
        days,
        recurrenceType,
        singleDate,
        recurrenceEnds,
        imgUrl,
        notes 
      } = req.body;

      if (!name || !childId || !time || !recurrenceType) {
        return res.status(400).json({ error: "Campos obrigatórios faltando" });
      }

      let daysData = [];
      if (days && days.length > 0) {
        daysData = days.map(dayName => ({ day: dayName }));
      }

      const task = await prisma.task.create({
        data: {
          name,
          time,
          imgUrl,
          notes,
          recurrenceType,
          status: "PENDENTE",
          singleDate: singleDate ? new Date(singleDate) : null,
          recurrenceEnds: recurrenceEnds ? new Date(recurrenceEnds) : null,

          child: { connect: { id: childId } },
          category: categoryId ? { connect: { id: categoryId } } : undefined,

          days: {
            create: daysData
          }
        },
        include: {
          days: true
        }
      });

      return res.status(201).json(task);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar tarefa" });
    }
  }
};