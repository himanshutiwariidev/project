import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-14 px-6 md:px-20 font-sans">
      {/* Upper Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-800 pb-10">
        
        {/* Brand Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-wide mb-3">MYRISS</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Elevate your lifestyle with MYRISS — where timeless design meets modern simplicity.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Shop</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition">Men</a></li>
            <li><a href="#" className="hover:text-white transition">Women</a></li>
            <li><a href="#" className="hover:text-white transition">BestSeller</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="/reveiw" className="hover:text-white transition">Your Opinion</a></li>
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition">Bulk order</a></li>
          </ul>
        </div>

        {/* Contact & Support Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">Contact & Support</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@myriss.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Mumbai, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} MYRISS. All Rights Reserved.</p>
        <div className="flex space-x-5 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition"><Facebook className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transition"><Instagram className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transition"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transition"><Linkedin className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
}
