import React from 'react';

const DoctorProfileFields = () => {
  return (
    <div>
      <div className="mb-3">
        <label htmlFor="specialty" className="form-label">Specialty</label>
        <input
          id="specialty"
          type="text"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="office" className="form-label">Office</label>
        <input
          id="office"
          type="text"
          className="form-control"
        />
      </div>
    </div>
  );
};

export default DoctorProfileFields;
