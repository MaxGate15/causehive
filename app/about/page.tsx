'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function AboutPage() {
  const { user, logout } = useAuth()

  const teamMembers = [
    {
      name: "Sarah Osei",
      role: "Founder & CEO",
      image: "👩🏾‍💼",
      bio: "Passionate about bridging the gap between donors and causes across Africa."
    },
    {
      name: "Kwame Asante",
      role: "CTO",
      image: "👨🏾‍💻",
      bio: "Building secure, scalable technology solutions for charitable giving."
    },
    {
      name: "Ama Mensah",
      role: "Head of Operations",
      image: "👩🏾‍💼",
      bio: "Ensuring transparency and efficiency in every donation process."
    }
  ]

  const stats = [
    { number: "50,000+", label: "Lives Impacted" },
    { number: "1,200+", label: "Active Causes" },
    { number: "₵2.5M+", label: "Total Donated" },
    { number: "15,000+", label: "Registered Users" }
  ]

  const values = [
    {
      icon: "🔒",
      title: "Trust & Security",
      description: "Bank-level security with transparent fund tracking and verified cause validation."
    },
    {
      icon: "🌍",
      title: "Community Impact",
      description: "Focusing on sustainable change in Ghanaian communities and across Africa."
    },
    {
      icon: "📱",
      title: "Mobile-First",
      description: "Optimized for mobile money and smartphone accessibility in emerging markets."
    },
    {
      icon: "💝",
      title: "Transparency",
      description: "Complete visibility into how donations are used with regular impact reports."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-green-500">CauseHive</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Empowering individuals across Ghana and Africa to seamlessly support meaningful causes 
            through innovative technology and transparent charitable giving.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Bridge Gaps
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect passionate donors with credible charitable organizations, NGOs, and event organizers across Africa.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Enhance Transparency
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Provide clear visibility into donation progress and the real impact of every contribution made.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Simplify Giving
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Streamline donations through mobile-friendly interfaces and diverse payment options including Mobile Money.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Our Impact So Far
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                CauseHive was born from a simple observation: <strong>giving back to our communities should be as easy as sending a text message.</strong> 
                In Ghana and across Africa, we witnessed countless individuals who wanted to support meaningful causes but faced 
                barriers in finding trustworthy organizations and convenient payment methods.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Our founders, having experienced both the generosity of African communities and the challenges of traditional 
                charitable giving, set out to create a platform that would revolutionize philanthropic engagement. We recognized 
                that with the widespread adoption of mobile money and smartphones, there was an unprecedented opportunity to 
                democratize charitable giving.
              </p>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Today, CauseHive serves as a bridge between passionate donors and impactful causes, ensuring that every 
                contribution—whether large or small—makes a measurable difference in someone's life. We're not just a platform; 
                we're a movement towards more transparent, accessible, and effective charitable giving in Africa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-3xl">How CauseHive Works</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Discover & Verify
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse verified causes across categories like education, healthcare, and disaster relief. 
                  Each cause is thoroughly vetted for authenticity and impact.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Donate Securely
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Contribute using Mobile Money (MTN, Vodafone, AirtelTigo), credit cards, or bank transfers. 
                  Add multiple causes to your cart for convenient bulk donations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Track Impact
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Receive regular updates on how your donations are being used. Track progress, 
                  view impact reports, and see the real difference you're making.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology & Security */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Technology & Security</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  🔐 Bank-Level Security
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• End-to-end encryption for all transactions</li>
                  <li>• PCI DSS compliant payment processing</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Regular security audits and updates</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  📱 Mobile-First Design
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Optimized for smartphones and tablets</li>
                  <li>• Mobile Money integration for Ghana</li>
                  <li>• Offline-capable features</li>
                  <li>• Fast loading on slow connections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner Organizations */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Our Partners</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We work with trusted organizations across Ghana and Africa to ensure your donations reach the right places.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏥</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Healthcare NGOs</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏫</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Educational Institutions</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Environmental Groups</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Community Organizations</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mb-16 bg-green-500 rounded-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of changemakers who are already using CauseHive to support causes they care about.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link href="/auth/signup">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/causes">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-500">
                    Browse Causes
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/causes">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Support a Cause
                  </Button>
                </Link>
                <Link href="/causes/create">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-green-500">
                    Start Your Own Campaign
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl mb-4">📧</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-400">support@causehive.tech</p>
                <p className="text-gray-600 dark:text-gray-400">hello@causehive.tech</p>
              </div>
              
              <div>
                <div className="text-3xl mb-4">📱</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-400">+233 (0) 20 123 4567</p>
                <p className="text-gray-600 dark:text-gray-400">+233 (0) 54 987 6543</p>
              </div>
              
              <div>
                <div className="text-3xl mb-4">📍</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Visit Us</h3>
                <p className="text-gray-600 dark:text-gray-400">Accra Digital Centre</p>
                <p className="text-gray-600 dark:text-gray-400">Accra, Ghana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
