"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { name: "Explore Events", href: "/explore" },
        { name: "Create Event", href: "/create-event" },
        { name: "Marketplace", href: "/marketplace" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="relative mt-20 pb-10 overflow-hidden">
      {/* Premium Glass Container */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative glass-dark rounded-[4rem] p-12 md:p-20 overflow-hidden mb-12 border border-white/10">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Newsletter Side */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-purple-400">
                  <Sparkles size={12} />
                  <span>Stay Synchronized</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-none">
                  Stay in the <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400">Loop.</span>
                </h2>
                <p className="text-gray-400 max-w-md font-light text-lg">
                  Join our community to discover, create, and share amazing experiences with people near you.
                </p>
              </div>

              <div className="relative group max-w-md">
                <Input
                  placeholder="Enter your email protocol..."
                  className="h-16 rounded-2xl bg-white/5 border-white/10 pl-6 pr-32 focus:border-purple-500/50 transition-all text-lg font-light"
                />
                <Button className="absolute right-2 top-2 h-12 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black italic tracking-widest uppercase transition-all">
                  Sync <Send size={16} className="ml-2" />
                </Button>
              </div>
            </div>

            {/* Links Side */}
            <div className="grid grid-cols-2 gap-12">
              {footerLinks.map((column) => (
                <div key={column.title} className="space-y-6">
                  <h3 className="text-white font-black uppercase tracking-widest text-xs italic">{column.title}</h3>
                  <ul className="space-y-4">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-500 hover:text-white transition-all font-light text-lg group flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-12">
              <Link href="/">
                <Image src="/spott.png" alt="Spott" width={100} height={30} className="opacity-80 hover:opacity-100 transition-opacity" />
              </Link>
              <div className="flex gap-6">
                {[<Facebook />, <Twitter />, <Instagram />, <Linkedin />].map((icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -4 }}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
              © {currentYear} SPOTT SYSTEM • DESIGN BY RAJAT SINGH
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
