const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const seedRooms = require('./scripts/seedRooms');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CLUSTER_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');

    // Seed rooms data
    console.log('Seeding rooms data...');
    seedRooms();
    console.log('Rooms data seeded');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Add after facilities route
const programRouter = require('./routes/programs');
const bookingRouter = require('./routes/bookings');
const authRoutes = require('./routes/auth');
const facilityRoutes = require('./routes/facilities');
const contactRoutes = require('./routes/contact');
const roomRouter = require('./routes/room');

app.use('/api/programs', programRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/rooms', roomRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));