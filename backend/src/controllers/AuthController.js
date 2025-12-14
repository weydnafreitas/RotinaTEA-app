const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

module.exports = {
  // REGISTRO DE USUÁRIO ---
  async register(req, res) {
    try {
      const { name, email, password, gender, birthDate, avatarUrl } = req.body;
      console.log(req.body);
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "Usuário já existe" });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hashPassword,
          gender,
          birthDate: new Date(birthDate),
          avatarUrl,
        },
      });

      user.passwordHash = undefined;

      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro no registro" });
    }
  },

  // LOGIN ---
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "E-mail ou senha incorretos" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(400).json({ error: "E-mail ou senha incorretos" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      user.passwordHash = undefined;

      return res.json({
        user,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro no login" });
    }
  },
};