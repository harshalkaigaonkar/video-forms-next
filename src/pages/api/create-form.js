import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body);

    const { nodes, edges } = req.body;

    const questions = nodes.map(({ id, data }, index) => ({
      label: data.question,
      type: data.type,
      video:
        data.video ??
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      step: +id,
      options: JSON.stringify(
        data.options.map((option) => ({
          value: option.value,
          nextNode: +nodes.find((node) => node.id === option.target)?.id,
        }))
      ),
      nextStep: Number(
        nodes.find(
          (node) =>
            node.data.id === edges.find((edge) => edge.source === id)?.target
        )?.id || 0
      ),
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
        name: "Untitled",
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
}
