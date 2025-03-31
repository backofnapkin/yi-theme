import React from 'react';
import InputField from '../InputField';

/**
 * Contact information form section component
 * Enhanced with better visual styling
 */
const ContactInfoSection = ({ name, email, phone, address, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information (Optional)</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter your contact information to include in the estimate PDF
      </p>
      
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Name or Business"
            value={name}
            onChange={(value) => onChange({ 
              target: { name: 'name', value: value }
            })}
            type="text"
            name="name"
            placeholder="Your name or business name"
          />
          
          <InputField
            label="Email"
            value={email}
            onChange={(value) => onChange({ 
              target: { name: 'email', value: value }
            })}
            type="email"
            name="email"
            placeholder="your@email.com"
          />
          
          <InputField
            label="Phone"
            value={phone}
            onChange={(value) => onChange({ 
              target: { name: 'phone', value: value }
            })}
            type="tel"
            name="phone"
            placeholder="(123) 456-7890"
          />
          
          <InputField
            label="Address"
            value={address}
            onChange={(value) => onChange({ 
              target: { name: 'address', value: value }
            })}
            type="text"
            name="address"
            placeholder="Your property address"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;