import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { questions, user, formId } = req.body;

    if (req.method === "POST") {
      const response = await prisma.response.create({
        data: {
          answers: {
            create: {
              answer: "",
              question: {
                connect: {
                  id: "",
                },
              },
            },
          },
          form: {
            connect: {
              id: "",
            },
          },
          user: {
            create: {
              create: {
                name: "",
                password: "",
              },
            },
          },
        },
      });
      res.status(200).json({ form });
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
