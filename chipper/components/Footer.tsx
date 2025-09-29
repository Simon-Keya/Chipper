export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 py-12 px-6 mt-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-emerald-600">Chipper</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Chipper is your trusted e-commerce partner for top-quality
            electronics, fashion, and home essentials. Shop smarter, live
            better.
          </p>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-lg font-semibold text-amber-600">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="/category/electronics" className="hover:text-blue-600">
                Electronics
              </a>
            </li>
            <li>
              <a href="/category/fashion" className="hover:text-blue-600">
                Fashion
              </a>
            </li>
            <li>
              <a href="/category/home" className="hover:text-blue-600">
                Home & Living
              </a>
            </li>
            <li>
              <a href="/category/accessories" className="hover:text-blue-600">
                Accessories
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-amber-600">Support</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <a href="/help" className="hover:text-blue-600">
                Help Center
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:text-blue-600">
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a href="/returns" className="hover:text-blue-600">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-600">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-amber-600">Get in Touch</h3>
          <p className="mt-3 text-sm text-gray-600">
            Nairobi, Kenyatta Ave,<br />
            Chipper House, 3rd Floor
          </p>
          <p className="mt-2 text-sm text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM</p>
          <p className="mt-2 text-sm text-gray-600">+254 746 685 837</p>
          <p className="mt-1 text-sm text-gray-600">support@chipper.com</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 border-t border-gray-200 pt-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Chipper. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="hover:text-emerald-600">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-emerald-600">
              Terms of Service
            </a>
          </div>
        </div>

        {/* Bottom row - attribution */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Created by{" "}
          <a
            href="https://simon-keya.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 font-semibold hover:text-amber-700"
          >
            Simon Keya
          </a>
        </div>
      </div>
    </footer>
  );
}
