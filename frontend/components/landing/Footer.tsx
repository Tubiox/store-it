"use client";

import { Shield, Twitter, Linkedin, Github, Mail } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Security", "Integrations"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "API Reference", "Status", "Support"],
  Legal: ["Privacy", "Terms", "Cookie Policy", "GDPR"],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
                <Shield className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold">SecureIt</span>
            </div>
            <p className="text-gray-400 mb-6">
              Enterprise-grade security meets intuitive design.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Icon className="size-5 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 SecureIt. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Mail className="size-4" />
            <span>support@secureit.app</span>
          </div>
        </div>
      </div>
    </footer>
  );
}