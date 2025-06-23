import  express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import transactionRoutes from './routes/transactions';

dotenv.config();

const app: express.Express = express();  // express.Express is a type that allows you to use the express library
app.use(cors());
app.use(express.json());

// app.use('/api/transactions', transactionRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
