import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary tracking-widest">404</h1>
      <div className="bg-white px-2 text-sm rounded rotate-12 absolute shadow-md">
        Page Not Found
      </div>
      <p className="mt-4 text-lg text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link to="/" className="mt-6">
        <Button>
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;