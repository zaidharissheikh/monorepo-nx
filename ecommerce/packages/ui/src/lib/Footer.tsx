const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="text-xl font-extrabold tracking-tighter text-gray-900">
              STORE<span className="text-primary">FRONT</span>
            </span>
            <p className="mt-4 text-sm text-gray-500">
              Making modern e-commerce simple, beautiful, and fast.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">All Products</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Sale</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Shipping</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} Storefront, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
