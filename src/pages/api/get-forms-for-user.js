import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    const forms = await prisma.form.findMany({
      where: {
        author: {
          id,
        },
      },
      include: {
        questions: true,
      },
    });
    res.status(200).json({ forms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
