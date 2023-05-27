import mongoose from 'mongoose';
import schema from '../../../models/Schema';

mongoose.connect('mongodb+srv://test:123@cluster0.qedsa.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connected'))
  .catch(error => console.log(error));

const handler = async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }
  
  const { id } = req.query;

  try {
    await schema.deleteOne({ _id: id });
    return res.status(200).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Not deleted" });
  } finally {
    mongoose.connection.close();
  }
};

export default handler;
