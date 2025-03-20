"use client";

import { useState } from "react";
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const tiers = [
    {
      name: "Free",
      price: {
        monthly: 0,
        annual: 0,
      },
      description: "Basic features for students and job seekers",
      features: [
        "3 Job matches per month",
        "Basic CV analysis",
        "5 AI interview practice sessions",
        "Basic career roadmap",
        "Community support",
      ],
      limitations: [
        "Limited job matches",
        "Basic CV insights only",
        "No advanced interview feedback",
        "Basic career recommendations",
        "No priority support",
      ],
      cta: "Get Started Free",
      ctaLink: "/register",
    },
    {
      name: "Pro",
      popular: true,
      price: {
        monthly: 19.99,
        annual: 14.99,
      },
      description: "Advanced features for serious career advancement",
      features: [
        "Unlimited job matches",
        "Advanced CV analysis & optimization",
        "Unlimited AI interview practice",
        "Personalized career roadmap",
        "Priority support",
        "Performance tracking & analytics",
        "Industry insights & salary data",
        "Resume export in multiple formats",
        "Personal career coach AI",
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      ctaLink: "/register?plan=pro",
    },
  ];

  const annualDiscount = Math.round(((tiers[1].price.monthly * 12) - (tiers[1].price.annual * 12)) / (tiers[1].price.monthly * 12) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lime-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="inline-block bg-lime-300 py-2 px-4 rounded-xl mb-4">
              <h2 className="text-black font-bold">Pricing</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-900">Simple, Transparent Pricing</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose the plan that's right for your career goals. Upgrade anytime to unlock all features.
            </p>
            
            <div className="flex items-center justify-center mt-8 bg-white shadow-sm rounded-full p-1 w-fit mx-auto border">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly" 
                    ? "bg-black text-lime-300 shadow-sm" 
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "annual" 
                    ? "bg-black text-lime-300 shadow-sm" 
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setBillingCycle("annual")}
              >
                Annual
                <Badge className="ml-2 bg-lime-200 text-black border-0">
                  Save {annualDiscount}%
                </Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tiers.map((tier, i) => (
              <Card 
                key={i} 
                className={`
                  border-2 overflow-hidden bg-white hover:translate-y-[-4px] transition-all duration-300
                  ${tier.popular 
                    ? "border-lime-300 shadow-[0_0_30px_rgba(190,255,102,0.2)]" 
                    : "border-gray-200 shadow-md"
                  }
                `}
              >
                {tier.popular && (
                  <div className="bg-lime-300 py-2 text-center">
                    <span className="font-medium text-black text-sm">MOST POPULAR</span>
                  </div>
                )}
                <CardHeader className={`text-center ${tier.popular ? "pt-6" : "pt-8"} pb-4`}>
                  <h2 className="text-2xl font-bold text-zinc-900">{tier.name}</h2>
                  <div className="mt-4 mb-2">
                    <span className="text-4xl font-bold text-zinc-900">
                      ${tier.price[billingCycle].toFixed(2)}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  {billingCycle === "annual" && tier.price[billingCycle] > 0 && (
                    <p className="text-sm text-gray-500">
                      Billed as ${(tier.price[billingCycle] * 12).toFixed(2)} per year
                    </p>
                  )}
                  <p className="text-gray-600 mt-2">{tier.description}</p>
                </CardHeader>
                <CardContent className="pb-8">
                  <h3 className="font-semibold mb-3 text-zinc-900">Includes:</h3>
                  <ul className="space-y-3">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-lime-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <Check className="h-3 w-3 text-lime-700" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {tier.limitations.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-3 mt-6 text-zinc-900">Limitations:</h3>
                      <ul className="space-y-3">
                        {tier.limitations.map((limitation, j) => (
                          <li key={j} className="flex items-start text-gray-500">
                            <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              <X className="h-3 w-3 text-gray-400" />
                            </div>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
                <CardFooter className="pt-2 pb-8 flex justify-center">
                  <Link href={tier.ctaLink} className="w-full">
                    <Button 
                      className={`w-full ${
                        tier.name === "Pro" 
                          ? "bg-black text-lime-300 hover:bg-zinc-800 shadow-sm hover:shadow gap-2" 
                          : "bg-lime-300 text-black hover:bg-lime-400 shadow-sm hover:shadow gap-2"
                      }`}
                      size="lg"
                    >
                      {tier.name === "Pro" && <Zap className="h-4 w-4" />}
                      {tier.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-zinc-900">Detailed Features Comparison</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-6 font-medium text-zinc-900">Feature</th>
                      <th className="text-center py-4 px-4 font-medium text-zinc-900">Free</th>
                      <th className="text-center py-4 px-4 font-medium text-zinc-900 bg-lime-50">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-6 text-gray-700">Job Matches</td>
                      <td className="text-center py-4 px-4 text-gray-700">3 per month</td>
                      <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 text-gray-700">CV Analysis</td>
                      <td className="text-center py-4 px-4 text-gray-700">Basic</td>
                      <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">Advanced with suggestions</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 text-gray-700">AI Interview Practice</td>
                      <td className="text-center py-4 px-4 text-gray-700">5 sessions</td>
                      <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 text-gray-700">Career Roadmap</td>
                      <td className="text-center py-4 px-4 text-gray-700">Basic</td>
                      <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">Personalized</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 text-gray-700">Support</td>
                      <td className="text-center py-4 px-4 text-gray-700">Community</td>
                      <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">Priority</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 text-gray-700">Performance Analytics</td>
                      <td className="text-center py-4 px-4">
                        <X className="h-5 w-5 text-gray-400 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 bg-lime-50">
                        <Check className="h-5 w-5 text-lime-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-6 text-gray-700">Industry Insights</td>
                      <td className="text-center py-4 px-4">
                        <X className="h-5 w-5 text-gray-400 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 bg-lime-50">
                        <Check className="h-5 w-5 text-lime-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-gray-700">Resume Export Formats</td>
                      <td className="text-center py-4 px-4 text-gray-700">Basic PDF</td>
                      <td className="text-center py-4 px-4 bg-lime-50 font-medium text-gray-800">Multiple formats</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900">Have Questions?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the right plan for your needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/faq">
                <Button variant="outline" className="border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                  Browse FAQ
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-black text-lime-300 hover:bg-zinc-800">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}