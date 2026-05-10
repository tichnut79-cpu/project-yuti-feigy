import React from 'react';

// 1. Define an interface for the props

interface GreetingProps {
  name: string;
  age?: number; // Optional prop using '?'
}


// 2. Define the component using the interface
const Home = () => {
  return (
    <div>
      "this is a home!!!"
    </div>
  );
};

export default Home;