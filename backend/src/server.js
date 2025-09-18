const app = require('./app.js');
const connectDb = require('./db/dbconfig.js');
const UserRoutes = require('./routes/UserRoutes.js');   
const authRoutes = require('./routes/authRoutes.js');
//connect to database
connectDb();


//routes
app.use('/api/auth', authRoutes);

app.use('/api/users', UserRoutes);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})