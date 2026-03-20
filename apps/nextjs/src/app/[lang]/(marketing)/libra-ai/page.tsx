import Link from "next/link";
import { Button } from "@saasfly/ui/button";
import { Card, CardContent } from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";
import { Cpu, BarChart3, Lightbulb, Sparkles } from "lucide-react";
import type { Locale } from "~/config/i18n-config";

const features = [
  {
    icon: Cpu,
    title: "80-150 Daily Reminders",
    description: "Leverage your phone unlock frequency to remind you of important tasks at key moments",
    gradient: "from-blue-400 to-purple-600"
  },
  {
    icon: BarChart3,
    title: "Local Generation",
    description: "All tasks processed locally - your data stays private, nothing is uploaded to the cloud",
    gradient: "from-purple-400 to-pink-600"
  },
  {
    icon: Lightbulb,
    title: "Tasks + Inspiration",
    description: "Combine to-do lists with motivational quotes to boost your productivity every day",
    gradient: "from-pink-400 to-red-600"
  }
];

const navItems = [
  { name: "Solutions", href: "#solutions" },
  { name: "Resources", href: "#resources" },
  { name: "Pricing", href: "#pricing" },
];

export default function LibraAIPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 sticky top-0 w-full border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Libra AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link href={`/${lang}`}>
                <Button variant="ghost" className="text-gray-300 hover:text-white border-transparent">
                  Home
                </Button>
              </Link>
              <Link href={`/${lang}/lockscreen-generator`}>
                <Button className="bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 text-white border-0">
                  Try Lockscreen Todo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Turn Your Lockscreen Into a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Productivity Tool
              </span>
            </h1>
          </div>

          <div>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              You unlock your phone 80-150 times a day. Why not let your lockscreen remind you of what truly matters?
              Simple, practical, and effective.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={`/${lang}/lockscreen-generator`}>
              <Button size="lg" className="bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 text-white text-lg px-8 py-3 rounded-full">
                Create Lockscreen Wallpaper
                <Icons.ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Lockscreen Reminders?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A practical approach to productivity - no AI hype, just a tool that actually works
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group"
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Boost Your Productivity?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start using your lockscreen as a daily reminder. No signup required, completely free.
            </p>
            <Link href={`/${lang}/lockscreen-generator`}>
              <Button size="lg" className="bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 text-white text-lg px-8 py-3 rounded-full">
                Create Your Wallpaper
                <Icons.ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}