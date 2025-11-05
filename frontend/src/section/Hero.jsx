import React, { useState, useEffect } from 'react';
import { FaArrowRight} from 'react-icons/fa';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Premium Quality",
      subtitle: "Clothing Collection",
      description: "Discover our handpicked selection of premium clothing designed for the modern lifestyle. Quality craftsmanship meets contemporary style.",
      buttonText: "Shop Collection",
      buttonLink: "/collections",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      position: "left"
    },
    {
      id: 2,
      title: "Custom Designs",
      subtitle: "Made Just For You",
      description: "Express your unique style with our custom design service. From concept to creation, we bring your vision to life.",
      buttonText: "Start Customizing",
      buttonLink: "/customize",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      position: "right"
    },
    {
      id: 3,
      title: "New Arrivals",
      subtitle: "Fresh Styles Weekly",
      description: "Stay ahead of trends with our weekly new arrivals. Premium fabrics, modern cuts, and timeless designs.",
      buttonText: "View New Arrivals",
      buttonLink: "/new-arrivals",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      position: "center"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleShopNow = (link) => {
    console.log('Navigate to:', link);
    // Add your navigation logic here
  };

  return (
    <section className="relative h-screen overflow-hidden bg-white">
      {/* Slides Container */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-6 lg:px-8">
                <div className={`max-w-2xl ${
                  slide.position === 'right' ? 'ml-auto text-right' :
                  slide.position === 'center' ? 'mx-auto text-center' :
                  'text-left'
                }`}>
                  <div className="space-y-6">
                    {/* Subtitle */}
                    <div className="inline-block">
                      <span className="text-white text-sm font-medium tracking-widest uppercase bg-black bg-opacity-50 px-4 py-2 backdrop-blur-sm">
                        {slide.subtitle}
                      </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => handleShopNow(slide.buttonLink)}
                        className="group inline-flex items-center space-x-3 bg-white text-black px-8 py-4 font-medium tracking-wide uppercase transition-all duration-300 hover:bg-black hover:text-white"
                      >
                        <span>{slide.buttonText}</span>
                        <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
     {/*  <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 hover:bg-opacity-30 transition-all duration-300 group"
      >
        <FaChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 hover:bg-opacity-30 transition-all duration-300 group"
      >
        <FaChevronRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
      </button> */}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Featured Categories Grid */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-24 pb-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { name: "Men's Collection", link: "/mens", count: "150+ Items" },
              { name: "Women's Collection", link: "/womens", count: "200+ Items" },
              { name: "Custom Designs", link: "/customize", count: "Unlimited" },
              { name: "New Arrivals", link: "/new-arrivals", count: "Weekly Drops" }
            ].map((category, index) => (
              <button
                key={index}
                onClick={() => console.log('Navigate to:', category.link)}
                className="group bg-white/90 backdrop-blur-md text-black p-4 lg:p-6 hover:bg-white hover:shadow-lg transition-all duration-300 text-left border border-white/20"
              >
                <h3 className="font-semibold text-sm lg:text-base mb-1 group-hover:text-gray-800 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  {category.count}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-6 z-20 hidden lg:block">
        <div className="flex items-center space-x-3 text-white text-sm">
          <div className="w-px h-12 bg-white bg-opacity-50"></div>
          <span className="transform -rotate-90 origin-left text-xs tracking-widest uppercase">
            Scroll Down
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;