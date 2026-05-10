import React from 'react';

// 1. Define an interface for the props




// 2. Define the component using the interface
const Home = ({ name, age }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
       <h1>You are {age} years old.</h1>
    </div>
  );
};

export default Home;