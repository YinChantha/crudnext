import schema from "../../../models/Schema";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { isCompleted, todo } = req.body;

        const existingTodo = await schema.findOne({ todo });

        if (existingTodo) {
          return res.status(409).json({ message: "Todo already exists" });
        }

        const newTodo = new schema({
          isCompleted,
          todo,
        });

        const savedTodo = await newTodo.save();

        res.status(200).json(savedTodo);
      } catch (error) {
        res.status(400).json({ message: "Error creating todo" });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query;
        const { isCompleted, todo } = req.body;

        const existingTodo = await schema.findOne({ isCompleted, todo });

        if (existingTodo) {
          return res.status(409);
        }

        const updatedTodo = await schema.findByIdAndUpdate(id, {
          isCompleted,
          todo,
        });

        res.status(200).json(updatedTodo);
      } catch (error) {
        res.status(400);
      }
      break;

    case "DELETE":
      const { id } = req.query;
      const deletedTodo = await schema.findByIdAndDelete(id);

      res.status(200).json(deletedTodo);

      break;
  }
}
