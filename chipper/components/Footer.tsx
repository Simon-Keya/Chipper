export default function Footer() {
    return (
      <footer className="bg-base-200 text-base-content py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Chipper. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="https://wa.me/254700000000" className="hover:text-primary">
              WhatsApp
            </a>
            <a href="/privacy" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-primary">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    );
  }
  