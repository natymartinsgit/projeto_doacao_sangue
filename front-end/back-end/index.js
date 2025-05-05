// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import chatRoute from './routes/chat.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/chat', chatRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
