export const BACKEND_URL = 'http://localhost:5001';

export const FACILITIES = [
  {
    id: '1',
    name: 'Deluxe Meditation Room',
    description: 'A peaceful space designed for deep meditation and reflection.',
    type: 'meditation',
    capacity: 20,
    pricePerDay: 150,
    features: ['Meditation cushions', 'Sound system', 'Natural lighting', 'Climate control'],
    mainImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Zen Garden Suite',
    description: 'Luxurious accommodation with a private garden view.',
    type: 'accommodation',
    capacity: 2,
    pricePerDay: 200,
    features: ['King bed', 'Private bathroom', 'Garden view', 'Mini kitchen'],
    mainImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Wellness Studio',
    description: 'Multi-purpose space for yoga and movement practices.',
    type: 'activity',
    capacity: 15,
    pricePerDay: 180,
    features: ['Yoga mats', 'Mirror wall', 'Sound system', 'Equipment storage'],
    mainImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Dining Hall',
    description: 'Communal dining space with farm-to-table service.',
    type: 'dining',
    capacity: 50,
    pricePerDay: 300,
    features: ['Buffet station', 'Private dining area', 'Outdoor seating', 'Dietary options'],
    mainImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

export const FACILITIES_DETAILS = {
  '1': {
    id: '1',
    name: 'Deluxe Meditation Room',
    description: 'A peaceful space designed for deep meditation and reflection.',
    longDescription: 'Experience tranquility in our specially designed meditation room. This space has been carefully crafted to create the perfect environment for meditation and mindfulness practices. The room features natural lighting through floor-to-ceiling windows, comfortable meditation cushions, and state-of-the-art climate control to maintain the perfect temperature year-round. The acoustic design ensures minimal external noise, allowing for deep concentration and inner peace.',
    type: 'meditation',
    capacity: 20,
    pricePerDay: 150,
    location: 'East Wing, Ground Floor',
    size: '800 sq ft',
    features: [
      'Premium meditation cushions',
      'Sound system for guided meditation',
      'Natural lighting with blackout options',
      'Climate control',
      'Storage for personal items',
      'Water station',
      'Air purification system',
      'Adjustable lighting'
    ],
    amenities: [
      'Sound system',
      'Meditation cushions',
      'Yoga mats',
      'Storage lockers',
      'Water dispenser',
      'Climate control'
    ],
    mainImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    availability: [
      { date: '2024-04-15', status: 'available' },
      { date: '2024-04-16', status: 'booked' },
      { date: '2024-04-17', status: 'available' },
      { date: '2024-04-18', status: 'available' },
      { date: '2024-04-19', status: 'maintenance' }
    ]
  },
  '2': {
    id: '2',
    name: 'Zen Garden Suite',
    description: 'Luxurious accommodation with a private garden view.',
    longDescription: 'Immerse yourself in tranquility in our Zen Garden Suite, where modern luxury meets traditional Japanese design principles. This thoughtfully appointed suite opens directly onto a private section of our meticulously maintained Japanese garden. The space features floor-to-ceiling sliding glass doors, allowing natural light to fill the room while providing seamless indoor-outdoor living.',
    type: 'accommodation',
    capacity: 2,
    pricePerDay: 200,
    location: 'North Wing, First Floor',
    size: '600 sq ft',
    features: [
      'King bed',
      'Private bathroom',
      'Garden view',
      'Mini kitchen',
      'Meditation area',
      'Private balcony',
      'Traditional Japanese furniture',
      'Walk-in closet'
    ],
    amenities: [
      'Luxury bedding',
      'Tea ceremony set',
      'Mini fridge',
      'Safe',
      'Smart TV',
      'Climate control'
    ],
    mainImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    availability: [
      { date: '2024-04-15', status: 'booked' },
      { date: '2024-04-16', status: 'booked' },
      { date: '2024-04-17', status: 'available' },
      { date: '2024-04-18', status: 'available' },
      { date: '2024-04-19', status: 'available' }
    ]
  },
  '3': {
    id: '3',
    name: 'Wellness Studio',
    description: 'Multi-purpose space for yoga and movement practices.',
    longDescription: 'Our state-of-the-art Wellness Studio is a versatile space designed to accommodate a variety of movement practices and wellness activities. The studio features specially engineered floating floors with shock absorption for high-impact activities, full-length mirrors, and an advanced sound system for immersive class experiences. Natural light floods the space through large windows, while blackout curtains are available for focused practice sessions.',
    type: 'activity',
    capacity: 15,
    pricePerDay: 180,
    location: 'West Wing, Ground Floor',
    size: '1000 sq ft',
    features: [
      'Yoga mats',
      'Mirror wall',
      'Sound system',
      'Equipment storage',
      'Floating floor system',
      'Adjustable lighting',
      'Props and blocks',
      'Changing rooms'
    ],
    amenities: [
      'Premium yoga mats',
      'Exercise balls',
      'Resistance bands',
      'Towel service',
      'Water station',
      'Bluetooth connectivity'
    ],
    mainImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593810450967-d796353c7b51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593810450967-d796353c7b51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593810450967-d796353c7b51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    availability: [
      { date: '2024-04-15', status: 'available' },
      { date: '2024-04-16', status: 'available' },
      { date: '2024-04-17', status: 'maintenance' },
      { date: '2024-04-18', status: 'booked' },
      { date: '2024-04-19', status: 'booked' }
    ]
  },
  '4': {
    id: '4',
    name: 'Dining Hall',
    description: 'Communal dining space with farm-to-table service.',
    longDescription: 'Our spacious Dining Hall is the heart of our community, offering a warm and inviting atmosphere for shared meals and social connection. The space showcases our commitment to sustainable dining with farm-to-table cuisine prepared by our expert culinary team. The hall features both indoor and outdoor seating areas, with views of our organic garden where many of our ingredients are sourced.',
    type: 'dining',
    capacity: 50,
    pricePerDay: 300,
    location: 'Central Building, Ground Floor',
    size: '2000 sq ft',
    features: [
      'Buffet station',
      'Private dining area',
      'Outdoor seating',
      'Dietary options',
      'Chef\'s table',
      'Wine cellar',
      'Garden view',
      'Custom menu options'
    ],
    amenities: [
      'Table service',
      'Buffet equipment',
      'Premium tableware',
      'Wine service',
      'Coffee/Tea station',
      'Dietary accommodation'
    ],
    mainImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599693795353-6927839c8105?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    availability: [
      { date: '2024-04-15', status: 'available' },
      { date: '2024-04-16', status: 'available' },
      { date: '2024-04-17', status: 'booked' },
      { date: '2024-04-18', status: 'booked' },
      { date: '2024-04-19', status: 'available' }
    ]
  }
};
