const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-extrabold tracking-tighter text-white">
              STORE<span className="text-[#c084fc]">FRONT</span>
            </span>
            <p className="mt-4 text-sm text-gray-400">
              Making modern e-commerce simple, beautiful, and fast.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Shop</h3>
            <ul className="mt-6 space-y-4">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">All Products</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Support</h3>
            <ul className="mt-6 space-y-4">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Company</h3>
            <ul className="mt-6 space-y-4">
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Storefront, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
