const mongoose = require("mongoose");
import schema from "../../../models/Schema";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const { id } = req.query;
  const { title, todo } = req.body;

  try {
    // await mongoose
    //   .connect("mongodb+srv://test:123@cluster0.qedsa.mongodb.net/", {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   })
    //   .then(() => console.log(" DB connected"));
  } catch (error) {
    console.log(error);
  }

  try {
    const updatedTodo = await schema.findByIdAndUpdate(id, { title, todo });
    console.log(updatedTodo);
    res.status(200).json(updatedTodo);
    // res.status(400).json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Not updated" });
  } finally {
    // mongoose.connection.close();
  }
}

export default handler;
