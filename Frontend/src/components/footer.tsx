
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#0D1326] text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/research" className="hover:text-blue-400 transition-colors">Research</Link></li>
              <li><Link to="/technology" className="hover:text-blue-400 transition-colors">Technology</Link></li>
              <li><Link to="/team" className="hover:text-blue-400 transition-colors">Team</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/documentation" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link to="/api" className="hover:text-blue-400 transition-colors">API Reference</Link></li>
              <li><Link to="/guides" className="hover:text-blue-400 transition-colors">Guides</Link></li>
              <li><Link to="/tutorials" className="hover:text-blue-400 transition-colors">Tutorials</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
              <li><Link to="/compliance" className="hover:text-blue-400 transition-colors">Compliance</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/support" className="hover:text-blue-400 transition-colors">Support</Link></li>
              <li><Link to="/feedback" className="hover:text-blue-400 transition-colors">Feedback</Link></li>
              <li><Link to="/partnerships" className="hover:text-blue-400 transition-colors">Partnerships</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} Mastomys Monitor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
