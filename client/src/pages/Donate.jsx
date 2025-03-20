import React from 'react';
import { Donate } from '../components/Donate';

const DonationPage = () => {
  const PAYPAL_CLIENT_ID = "AUEwkO2TO6LLT1jKAS8EQ3PdbO5JBLe8X3amwF6qnTb89V5EnRl7vzFtNP66Squd7so-gvekzcQNKrYy";
  
  return (
    <div>
      <Donate paypalClientId={PAYPAL_CLIENT_ID} />
    </div>
  );
};

export default DonationPage;