const mongoose = require("mongoose");
import schema from "../../../models/Schema";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { title, todo } = req.body;

    // await mongoose
    //   .connect("mongodb+srv://test:123@cluster0.qedsa.mongodb.net/", {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   })
    //   .then(() => console.log(" DB connected"));

    var newTodo = new schema({ title, todo });
    await newTodo.save();
    console.log(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal error" });
  } finally {
    // mongoose.connection.close();
  }
}

export default handler;
