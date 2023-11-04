import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { questions, user } = req.body;

    const formId = questions[0].formId;

    const answers = questions.map((question) => ({
      answer: question.answer,
      question: {
        connect: {
          id: question.id,
        },
      },
    }));

    if (req.method === "POST") {
      const response = await prisma.response.create({
        data: {
          answers: {
            create: answers,
          },
          form: {
            connect: {
              id: formId,
            },
          },
          user: {
            create: {
              create: {
                name: user.name,
                password: user.email,
              },
            },
          },
        },
      });
      res.status(200).json({ response });
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
