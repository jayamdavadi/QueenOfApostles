import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { BACKEND_URL } from '../constants';
import axios from 'axios';

const BookingPage = () => {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (programId) {
      const fetchProgram = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BACKEND_URL}/api/programs/${programId}`);
          setProgram(response.data);
        } catch (err) {
          console.error('Error fetching program:', err);
          setError('Error fetching program. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchProgram();
    }
  }, [programId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Program</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to book your spot in the program
          </p>
        </div>
        
        {program && <BookingForm program={program} />}
      </div>
    </div>
  );
};

export default BookingPage;