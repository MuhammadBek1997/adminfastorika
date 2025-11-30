import React from 'react';

export default function StatusBadge({ label, status = 'verified' }) {
  const variant = status === 'underReview' ? 'status-under' : status === 'notReviewed' ? 'status-not' : 'status-ok';
  return (
    <div>
      
    </div>
  );
}
