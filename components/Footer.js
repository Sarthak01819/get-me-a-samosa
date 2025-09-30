import React from 'react'

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 text-white p-4'>
        <p className='text-center'>Copyright &copy; {currentYear} Get me Samosa - All Rights Reserved!</p>
    </footer>
  )
}

export default Footer