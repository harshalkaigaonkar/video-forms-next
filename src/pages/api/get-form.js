import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    const form = await prisma.form.findFirst({
      where: {
        id,
      },
      include: {
        questions: true,
      },
    });
    res.status(200).json({ form });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
