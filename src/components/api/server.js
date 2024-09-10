const express = require('express');
const cors = require('cors');
const conn = require('./db')
const app = express();
const productRoutes = require('./routes/products');
const loginRoutes = require('./routes/login')
const usersRoutes = require('./routes/owner')
const membersRoutes = require('./routes/member')
const paymentRoutes = require('./routes/payment')
const orderRoutes = require('./routes/order')
const salesRoutes = require('./routes/sales')




app.use(cors());
app.use(express.json());
app.use('/api', productRoutes)
app.use('/api', loginRoutes)
app.use('/api', usersRoutes)
app.use('/api', membersRoutes)
app.use('/api', paymentRoutes)
app.use('/api', orderRoutes)
app.use('/api', salesRoutes)



app.listen(5000, () => {
    console.log('Server started on port 5000');
});
