

import React from 'react';
import { GiAirplane, GiSuitcase, GiFeather } from 'react-icons/gi';
import { HiOutlineHome } from 'react-icons/hi';
import { FiFolder } from 'react-icons/fi';
import { FaChevronUp } from 'react-icons/fa';

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
              <p className="mt-6 text-sm md:text-sm leading-relaxed text-gray-200 max-w-xl">
                myriss is all about modern, on-the-move must-haves. We aim to merge
                high-fashion minimalism with the uniqueness and comfort of athleisure.
                Our collections are crafted with the best of fabric and premium cotton
                and our silhouettes are high on the trend quotient. Elevate your every day
                look with our stylish and functional essentials, travel wear, and lounge wear.
                You'll always be adventure-ready with myriss.
              </p>
            </div>

            <div className="mt-0">
              <div className="grid grid-cols-5 gap-4 items-center text-center">
                <Feature icon={<GiAirplane size={24} />} label="On the move" />
                <Feature icon={<GiSuitcase size={24} />} label="Travel Friendly" />
                <Feature icon={<FiFolder size={24} />} label="Utilitarian Designs" />
                <Feature icon={<GiFeather size={24} />} label="Light weight" />
                <Feature icon={<HiOutlineHome size={24} />} label="Home Grown" />
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
