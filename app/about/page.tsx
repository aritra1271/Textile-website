"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Globe, Heart, Target, Zap } from "lucide-react"
import { getAboutContent, getBusinessSettings, type AboutContent, type BusinessSettings } from "@/lib/database"

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const [aboutData, settingsData] = await Promise.all([getAboutContent(), getBusinessSettings()])
      setAboutContent(aboutData)
      setBusinessSettings(settingsData)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  // Default content if not loaded
  const defaultContent = {
    hero_title: "About Our Brand",
    hero_subtitle: "We're passionate about creating premium sportswear that empowers athletes at every level.",
    story_title: "Our Story",
    story_content:
      "Founded in 2020, our company began with a simple mission: to create affordable, high-quality sportswear that doesn't compromise on performance or style. As athletes ourselves, we understood the frustration of finding bottom wear that truly met our needs.",
    values_title: "Our Values",
    values_subtitle: "The principles that guide everything we do",
    team_title: "Meet Our Team",
    team_subtitle: "The passionate people behind our brand",
    contact_title: "Ready to Experience the Difference?",
    contact_subtitle: "Join thousands of satisfied customers who trust our sportswear for their athletic journey",
    statistics: { customers: 10000, products: 50, rating: 4.8, years: 3 },
  }

  const content = aboutContent || defaultContent
  const settings = businessSettings || { phone: "+91 7595858158", email: "orders@sanjibtextile.com" }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{content.hero_title}</h1>
            <p className="text-xl opacity-90 mb-8">{content.hero_subtitle}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">Est. 2020</Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                {content.statistics?.customers?.toLocaleString() || "10,000"}+ Happy Customers
              </Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">Premium Quality</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{content.story_title}</h2>
              <div className="space-y-4 text-gray-700">
                <p>{content.story_content}</p>
                <p>
                  Starting as a small team of fitness enthusiasts and designers, we've grown into a trusted brand
                  serving thousands of customers worldwide. Every product we create is tested by real athletes in real
                  conditions.
                </p>
                <p>
                  Today, we're proud to offer a comprehensive range of bottom wear that combines cutting-edge fabric
                  technology with thoughtful design, all at prices that won't break the bank.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src={content.story_image || "/placeholder.svg?height=400&width=600"}
                alt="Our team and story"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{content.values_title}</h2>
            <p className="text-gray-600 text-lg">{content.values_subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Performance First</h3>
                <p className="text-gray-600">
                  Every product is designed with performance in mind. We test extensively to ensure our gear enhances
                  your athletic performance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Affordable Quality</h3>
                <p className="text-gray-600">
                  Premium doesn't have to mean expensive. We believe everyone deserves access to high-quality
                  sportswear.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Focused</h3>
                <p className="text-gray-600">
                  Our customers are at the heart of everything we do. We listen, adapt, and continuously improve based
                  on your feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We're constantly exploring new materials, technologies, and designs to push the boundaries of
                  sportswear.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We're committed to excellence in every aspect - from design and manufacturing to customer service.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to sustainable practices and reducing our environmental impact through responsible
                  manufacturing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600 text-lg">Numbers that tell our story</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {content.statistics?.customers?.toLocaleString() || "10,000"}+
              </div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{content.statistics?.products || "50"}+</div>
              <p className="text-gray-600">Product Variants</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{content.statistics?.rating || "4.8"}/5</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{content.statistics?.years || "3"}+</div>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{content.team_title}</h2>
            <p className="text-gray-600 text-lg">{content.team_subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Team member"
                  width={150}
                  height={150}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                <p className="text-blue-600 mb-2">Founder & CEO</p>
                <p className="text-gray-600 text-sm">Former professional athlete with 10+ years in sportswear design</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Team member"
                  width={150}
                  height={150}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Mike Chen</h3>
                <p className="text-blue-600 mb-2">Head of Design</p>
                <p className="text-gray-600 text-sm">Award-winning designer specializing in performance fabrics</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Image
                  src="/placeholder.svg?height=150&width=150"
                  alt="Team member"
                  width={150}
                  height={150}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Emily Rodriguez</h3>
                <p className="text-blue-600 mb-2">Customer Success</p>
                <p className="text-gray-600 text-sm">Dedicated to ensuring every customer has an amazing experience</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{content.contact_title}</h2>
          <p className="text-xl opacity-90 mb-8">{content.contact_subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${settings.phone}`}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call: {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Email: {settings.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
