import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Hotel, Phone } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://framerusercontent.com/images/D7zXNwvB4OLirwMPTc9uE7LfjQ.jpg?scale-down-to=2048")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Retreat
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Discover peace, purpose, and renewal at Queen of Apostles Retreat Centre - where spiritual growth meets heartfelt hospitality.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/programs')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Explore Programs
              </button>
              <button
                onClick={() => navigate('/facilities')}
                className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                View Facilities
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Programs */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Day of Reflection",
                description: "A peaceful day to disconnect from distractions, featuring guided meditations, scripture readings, and quiet spiritual time.",
                image: "https://images.unsplash.com/photo-1617720197345-5e5235ec6220?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              },
              {
                title: "Weekend Retreats for Adults",
                description: "Multi-day retreats focused on themes like 'Finding God in Everyday Life'. Ideal for deep reflection and spiritual renewal.",
                image: "https://images.unsplash.com/photo-1501060380799-184ae00cf089?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              },
              {
                title: "Evening Candlelight Prayer",
                description: "A once-a-month evening of music, scripture, and candlelight — perfect for quiet prayer and contemplation.",
                image: "https://images.unsplash.com/photo-1738605287448-a0f65d68ebc7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
            ].map((program, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <button
                    onClick={() => navigate('/programs')}
                    className="text-blue-600 font-medium hover:text-blue-700"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Programs</h3>
              <p className="text-gray-600">
                Choose from a variety of programs designed for your growth
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Hotel className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Facilities</h3>
              <p className="text-gray-600">
                Stay in comfort with our modern accommodation options
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is always here to assist you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join us for a transformative experience that will last a lifetime.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Contact Us Today
          </button>
        </div>
      </div>
    </div>
  );
};