

import React from 'react';

import { FaRupeeSign, FaTshirt, FaMedal, FaPalette } from "react-icons/fa"; 
import { GiHoodie } from "react-icons/gi";

// Example image imports - replace with your own
 import img1 from '../assets/storyimage/4.jpg';
 import img2 from '../assets/storyimage/5.jpg';
 import img3 from '../assets/storyimage/9.jpg';
 import img4 from '../assets/storyimage/10.jpg';

export default function OurStory() {
    

  return (
    <section className="w-full bg-white py-2">
      <div className=" mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch">

          {/* Left panel */}
          <div className="w-full lg:w-1/2 bg-black text-white p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm tracking-widest uppercase text-gray-200">OUR STORY</h3>
              <p className="mt-6 text-xs md:text-sm leading-relaxed text-gray-200 max-w-xl">
              Myriss is all about everyday essentials designed for real people on the move.
We bring together pocket-friendly pricing with streetwear-inspired style, delivering fresh designs that elevate your daily look. Every product is crafted with quality materials, smart utility, and all-day comfort in mind.
From college days to work runs, from casual outings to city commutes—Myriss fits effortlessly into your lifestyle.
With new designs dropping regularly and comfort you can rely on, Myriss keeps you ready for every day, every moment.
Stay light. Stay stylish. Stay Myriss.
              </p>
            </div>

            <div className="mt-0">
             <div className="grid grid-cols-5 gap-4 items-center text-center">
  
  {/* 1. Pocket Friendly -> Rupee Sign (Affordable) */}
  <Feature 
    icon={<FaRupeeSign size={24} />} 
    label="Pocket friendly" 
  />

  {/* 2. Street Wear -> Hoodie Icon (Urban/Street style) */}
  <Feature 
    icon={<GiHoodie size={24} />} 
    label="Street wear" 
  />

  {/* 3. Every Day New Design -> Palette (Creativity/Newness) */}
  <Feature 
    icon={<FaPalette size={24} />} 
    label="New designs" 
  />

  {/* 4. Quality Assured -> Medal (Premium/Trust) */}
  <Feature 
    icon={<FaMedal size={24} />} 
    label="Quality Assured" 
  />

  {/* 5. Daily Wear Comfort -> T-shirt (Casual/Daily use) */}
  <Feature 
    icon={<FaTshirt size={24} />} 
    label="Daily wear comfort" 
  />

</div>
            </div>
          </div>

          {/* Right gallery */}
          <div className="w-full lg:w-1/2 relative">
            <div className="flex h-full">
              <div className="flex-1 grid grid-cols-4 pt-2 md:p-4 items-stretch">
                <img src={img1} alt="model 1" className="object-cover w-full h-[15rem] md:h-[20rem] rounded-sm shadow-md" />
                <img src={img2} alt="model 2" className="object-cover w-full h-[15rem] md:h-[20rem] rounded-sm shadow-md" />
                <img src={img3} alt="model 3" className="object-cover w-full h-[15rem] md:h-[20rem] rounded-sm shadow-md" />
                <img src={img4} alt="model 4" className="object-cover w-full h-[15rem] md:h-[20rem] rounded-sm shadow-md" />
              </div>
            </div>

            {/* Bottom banner */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <div className="bg-black/60 text-white text-sm md:text-base uppercase tracking-widest px-6 py-3 rounded-t-lg backdrop-blur-lg">
                Perfect for all occasions
              </div>
            </div>

            {/* Floating chevron button */}
            {/* <button
              aria-label="scroll to top"
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-md p-3 shadow-lg">
              <FaChevronUp className="text-[#2b3b6e]" />
            </button> */}
          </div>

        </div>
      </div>
    </section>
  );
}

function Feature({ icon, label }) {
  return (
    <div className="flex flex-col items-center text-gray-100">
      <div className="bg-white/10 rounded-full p-3 w-12 h-12 flex items-center justify-center">{icon}</div>
      <span className="mt-2 text-xs md:text-sm text-gray-100">{label}</span>
    </div>
  );
}
