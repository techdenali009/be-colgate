const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app: any = express();
const cookieParser = require('cookie-parser');
import couponRoutes from './routes/coupon.routes';
import routes from './routes/index'
import { errorResponse } from './utils/response'
// Middleware
app.use(express.json());
app.use(cors({
    origin: [
     'http://localhost:3000',  
      "http://localhost:5173"
    ], // Add allowed domains
    credentials: true 
}
));
app.use(morgan('dev')); // Logging middleware
app.use(cookieParser());

// Routes
app.use('/api', routes);
app.use(express.json()); // Important for JSON parsing
// app.use("/api/coupons", couponRoutes); // Correct usage of router
// Mount the coupon routes
app.use('/api/coupon', couponRoutes);


// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    errorResponse(res, 'Something went wrong!', 500, err)
});


module.exports = app;
