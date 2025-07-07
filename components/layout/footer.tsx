"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, Mail, MessageCircle, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { getBusinessSettings, type BusinessSettings } from "@/lib/database"

export default function Footer() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const businessSettings = await getBusinessSettings()
      setSettings(businessSettings)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const defaultSettings = {
    business_name: "Sanjib Textile",
    description: "Premium sportswear designed for performance, comfort, and style. Empowering athletes at every level.",
    phone: "+91 7595858158",
    email: "orders@sanjibtextile.com",
    whatsapp: "+91 7595858158",
    address: "India",
    facebook_url: "https://facebook.com/sanjibtextile",
    instagram_url: "https://instagram.com/sanjibtextile",
    twitter_url: "https://twitter.com/sanjibtextile",
    linkedin_url: "https://linkedin.com/company/sanjibtextile",
  }

  const currentSettings = settings || defaultSettings

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">ST</span>
              </div>
              <span className="font-black text-xl tracking-tight">{currentSettings.business_name}</span>
            </div>
            <p className="text-gray-300 mb-4 font-medium">{currentSettings.description}</p>
            <div className="flex space-x-4">
              <a
                href={currentSettings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white cursor-pointer transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={currentSettings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white cursor-pointer transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={currentSettings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white cursor-pointer transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href={currentSettings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white cursor-pointer transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black text-lg mb-4 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors font-medium">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=Shorts"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Shorts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=Leggings"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Leggings
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-black text-lg mb-4 uppercase tracking-wide">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories?category=Shorts"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Athletic Shorts
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=Joggers"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Training Joggers
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=Leggings"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Compression Leggings
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=Track Pants"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Track Pants
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-black text-lg mb-4 uppercase tracking-wide">Contact Us</h3>
            <div className="space-y-4">
              <a
                href={`tel:${currentSettings.phone}`}
                className="flex items-center space-x-3 hover:text-red-500 transition-colors"
              >
                <Phone className="h-5 w-5 text-red-600" />
                <span className="text-gray-300 font-medium">{currentSettings.phone}</span>
              </a>
              <a
                href={`mailto:${currentSettings.email}`}
                className="flex items-center space-x-3 hover:text-red-500 transition-colors"
              >
                <Mail className="h-5 w-5 text-red-600" />
                <span className="text-gray-300 font-medium">{currentSettings.email}</span>
              </a>
              <a
                href={`https://wa.me/${currentSettings.whatsapp?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 hover:text-red-500 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-red-600" />
                <span className="text-gray-300 font-medium">WhatsApp: {currentSettings.whatsapp}</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-600" />
                <span className="text-gray-300 font-medium">{currentSettings.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm font-medium">
              © 2024 {currentSettings.business_name}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors font-medium">
                Terms of Service
              </Link>
              <Link href="/returns" className="text-gray-300 hover:text-white text-sm transition-colors font-medium">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
