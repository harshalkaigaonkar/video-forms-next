import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { nodes, edges, formName } = req.body;

      const questions = nodes.map(({ id, data }, index) => ({
        label: data.question,
        type: data.type,
        video:
          data.video ??
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        step: +index,
        options: JSON.stringify(
          data.options?.map((option) => ({
            value: option.value,
            nextNode:
              +nodes.findIndex((node) => node.id === option.target) || null,
          }))
        ),
        nextStep: nodes.findIndex((node) => {
          const findEdgeWithSource = edges.find((edge) => edge.source === id);
          if (!findEdgeWithSource) {
            return false;
          }
          return node.id === findEdgeWithSource.target;
        }),
      }));

      const form = await prisma.form.create({
        data: {
          author: {
            connectOrCreate: {
              create: {
                id: "admin",
                name: "admin",
                password: "admin",
              },
              where: {
                id: "admin",
              },
            },
          },
          name: formName,
          questions: {
            create: questions,
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
