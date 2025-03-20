import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export const Donate = ({ paypalClientId }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const predefinedAmounts = ['25', '50', '100', '250'];

  // Load PayPal SDK
  useEffect(() => {
    // Add PayPal Script
    const addPayPalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setPaypalLoaded(true);
    }
  }, [paypalClientId]);

  // Render PayPal buttons when SDK is loaded
  useEffect(() => {
    if (paypalLoaded && amount) {
      renderPayPalButtons();
    }
  }, [paypalLoaded, amount, customAmount]);

  const renderPayPalButtons = () => {
    const donationAmount = amount === 'custom' ? customAmount : amount;

    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      return;
    }

    // Clear any existing buttons
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Donation',
                amount: {
                  value: donationAmount,
                  currency_code: 'USD'
                }
              }
            ],
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },
        onApprove: (data, actions) => {
          setProcessingPayment(true);

          return actions.order.capture().then(function (details) {
            const { payer } = details;

            // Save donor information and payment details
            const paymentData = {
              transactionId: details.id,
              amount: donationAmount,
              name: name || `${payer.name.given_name} ${payer.name.surname}`,
              email: email || payer.email_address,
              status: details.status,
              paymentMethod: 'PayPal',
              paymentTime: new Date().toISOString()
            };

            console.log('Payment successful:', paymentData);

            setProcessingPayment(false);
            setPaymentSuccess(true);
          });
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          setProcessingPayment(false);
        }
      })
      .render('#paypal-button-container');
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You For Your Support!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your donation has been received and will help us make a difference.
          </p>
          <p className="text-gray-600">
            A receipt has been sent to your email address.
          </p>
          <button
            onClick={() => {
              setAmount('');
              setCustomAmount('');
              setEmail('');
              setName('');
              setPaymentSuccess(false);
            }}
            className="mt-8 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Our Mission</h1>
        <p className="text-xl text-gray-600">
          Your donation helps us provide transformative experiences and maintain our facilities.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {processingPayment ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Processing your donation...</p>
          </div>
        ) : (
          <form className="space-y-6">
            {/* Donation Amount Selection */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Select Donation Amount
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {predefinedAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-3 px-4 rounded-md border ${amount === preset
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-blue-600'
                      }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  id="customAmount"
                  checked={amount === 'custom'}
                  onChange={() => setAmount('custom')}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="customAmount" className="flex-grow">
                  <input
                    type="number"
                    placeholder="Custom Amount"
                    value={customAmount}
                    onChange={(e) => {
                      setAmount('custom');
                      setCustomAmount(e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </label>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* PayPal Buttons */}
            <div>
              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">Pay with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div id="paypal-button-container" className="mt-4"></div>

              {!paypalLoaded && (
                <div className="text-center py-6 border border-gray-200 rounded-md">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading payment options...</p>
                </div>
              )}
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Your donation is tax-deductible. You will receive a receipt via email.
        </div>
      </div>
    </div>
  );
};