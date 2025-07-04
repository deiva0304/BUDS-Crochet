import React from 'react';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { assets } from '../assets/assets';

const Basics = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: '/slide1.jpg',
      content: 'Explore the beauty of nature with breathtaking landscapes.',
    },
    {
      image: '/slide2.jpg',
      content: 'Discover the latest technology trends shaping our future.',
    },
    {
      image: '/slide3.jpg',
      content: 'Experience the thrill of adventure and outdoor activities.',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      <Navbar />
      <div className="relative w-full max-w-2xl mt-8">
        <div className="overflow-hidden rounded-lg">
          {/* Render only the active slide */}
          <div key={currentSlide} className="w-full flex flex-col items-center justify-center h-80 bg-gray-100 p-6 transition-opacity duration-700">
            <img src={slides[currentSlide].image} alt={`Slide ${currentSlide + 1}`} className="w-full h-48 object-cover rounded-md" />
            <span className="text-xl text-gray-800 mt-4">{slides[currentSlide].content}</span>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          &#10095;
        </button>

        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`size-3 border border-gray-400 rounded-full cursor-pointer ${
                currentSlide === index ? 'bg-blue-700 border-blue-700' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Basics;
