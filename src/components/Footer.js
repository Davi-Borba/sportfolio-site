// src/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="text-2xl font-bold text-white">SportFolio</div>
          <p className="mt-4 sm:mt-0">&copy; 2025 SportFolio. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
