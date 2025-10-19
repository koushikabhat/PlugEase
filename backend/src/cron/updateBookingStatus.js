const cron = require('node-cron');
const Bookings = require('../models/Booking.models');

const connectDb = require('../db/dbconfig.js');
//connect to database
connectDb();

cron.schedule('*/5 * * * *', async () => {
    try
    {

        console.log('Running cron job to update booking statuses...');
        const now  = new Date();
        const Booking = await Bookings.updateMany(
            { status: 'active' , 'time.toTime': {$lte  : now}},
            { $set : {status : 'completed'} }
        );
        console.log(`Cron Job: Updated ${Booking.modifiedCount} bookings to completed`);
    }
    catch(error)
    {
        console.error('Error updating booking statuses:', error); 
    }
});
