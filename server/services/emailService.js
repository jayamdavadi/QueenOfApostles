const emailjs = require('@emailjs/nodejs');

// Initialize emailjs
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY
});

const EMAIL_TEMPLATES = {
  BOOKING_CONFIRMATION: 'template_i3hk5oj',
  BOOKING_UPDATE: 'template_lqtjfho',
  BOOKING_REMINDER: 'template_booking_reminder'
};

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;

const sendBookingConfirmation = async (booking, program) => {
  try {
    const guestEmails = booking.guests.map(guest => ({
      to_email: guest.email,
      to_name: guest.name,
      booking_id: booking._id,
      program_name: program.title,
      start_date: new Date(program.startDate).toLocaleDateString(),
      total_guests: booking.numberOfGuests,
      total_price: booking.totalPrice,
      meal_preferences: Object.entries(guest.mealPreferences)
        .map(([meal, pref]) => `${meal}: ${pref}`)
        .join(', '),
      dietary_restrictions: guest.dietaryRestrictions.join(', ') || 'None'
    }));

    // Send confirmation email to each guest
    const emailPromises = guestEmails.map(templateParams => 
      emailjs.send(
        SERVICE_ID,
        EMAIL_TEMPLATES.BOOKING_CONFIRMATION,
        templateParams
      )
    );

    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

const sendBookingUpdate = async (booking, program, updatedGuest) => {
  try {
    const templateParams = {
      to_email: updatedGuest.email,
      to_name: updatedGuest.name,
      booking_id: booking._id,
      program_name: program.title,
      start_date: new Date(program.startDate).toLocaleDateString(),
      meal_preferences: Object.entries(updatedGuest.mealPreferences)
        .map(([meal, pref]) => `${meal}: ${pref}`)
        .join(', '),
      dietary_restrictions: updatedGuest.dietaryRestrictions.join(', ') || 'None'
    };

    await emailjs.send(
      SERVICE_ID,
      EMAIL_TEMPLATES.BOOKING_UPDATE,
      templateParams
    );
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

const sendBookingReminder = async (booking, program) => {
  try {
    const guestEmails = booking.guests.map(guest => ({
      to_email: guest.email,
      to_name: guest.name,
      program_name: program.title,
      start_date: new Date(program.startDate).toLocaleDateString(),
      start_time: program.startTime,
      location: program.location,
      meal_preferences: Object.entries(guest.mealPreferences)
        .map(([meal, pref]) => `${meal}: ${pref}`)
        .join(', ')
    }));

    const emailPromises = guestEmails.map(templateParams =>
      emailjs.send(
        SERVICE_ID,
        EMAIL_TEMPLATES.BOOKING_REMINDER,
        templateParams
      )
    );

    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingUpdate,
  sendBookingReminder
};