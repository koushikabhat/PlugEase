const app = require('./app.js');


const connectDb = require('./db/dbconfig.js');
//connect to database
connectDb();
require('./cron/updateBookingStatus.js');

//routes 
const UserRoutes = require('./routes/UserRoutes.js');   
const authRoutes = require('./routes/authRoutes.js');
const SearchRoutes = require('./routes/SearchRoutes.js');
const HistoryRoutes = require('./routes/HistoryRoutes.js')
const ProviderRouter = require('./routes/ProviderRoutes.js');


//routes
app.use('/api/auth', authRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/stations', SearchRoutes);
app.use('/api/usersbooking', HistoryRoutes)
app.use('/api/fetch', ProviderRouter)

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0' , ()=>{
    console.log(`Server is running on port ${port}`);
})