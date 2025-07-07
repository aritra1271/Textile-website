"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Heart, Phone, Mail, MessageCircle, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import UserMenu from "@/components/auth/user-menu"
import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import { getBusinessSettings, searchProducts, trackWebsiteVisit, type BusinessSettings } from "@/lib/database"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const { isAdmin, user } = useAuth()
  const { wishlistCount } = useWishlist()

  useEffect(() => {
    fetchSettings()
    // Track website visit
    trackWebsiteVisit(window.location.pathname, user?.id)
  }, [user])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch()
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const fetchSettings = async () => {
    try {
      const businessSettings = await getBusinessSettings()
      setSettings(businessSettings)
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearchLoading(true)
    try {
      const results = await searchProducts(searchQuery)
      setSearchResults(results)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ]

  const defaultSettings = {
    business_name: "Sanjib Textile",
    phone: "+91 7595858158",
    email: "orders@sanjibtextile.com",
    whatsapp: "+91 7595858158",
    logo_url: "",
  }

  const currentSettings = settings || defaultSettings

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top Bar */}
      <div className="bg-black text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-6 text-sm font-bold uppercase tracking-wide">
            <a
              href={`tel:${currentSettings.phone}`}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{currentSettings.phone}</span>
            </a>
            <a
              href={`mailto:${currentSettings.email}`}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{currentSettings.email}</span>
            </a>
            <a
              href={`https://wa.me/${currentSettings.whatsapp?.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Available</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {currentSettings.logo_url ? (
              <img
                src={currentSettings.logo_url || "/placeholder.svg"}
                alt={currentSettings.business_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-black text-xl">ST</span>
              </div>
            )}
            <span className="font-black text-2xl tracking-tighter uppercase">{currentSettings.business_name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-black uppercase tracking-wider transition-all hover:text-red-600 hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 w-64 border-2 border-gray-200 focus:border-black font-medium"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={clearSearch}
                        >
                          <img
                            src={product.images?.[0] || "/placeholder.svg?height=40&width=40"}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <span className="font-bold text-red-600">₹{product.price}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No products found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>

            <Link href="/account/wishlist">
              <Button variant="ghost" size="icon" className="relative hover:bg-red-50 hover:scale-110 transition-all">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 font-bold">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:scale-110 transition-transform">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-black uppercase tracking-wider transition-colors hover:text-red-600"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-2 border-gray-200 focus:border-black"
                      />
                    </div>

                    <div className="space-y-2">
                      <Link href="/account/wishlist" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start bg-black hover:bg-red-600 font-bold uppercase tracking-wide">
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist ({wishlistCount})
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
