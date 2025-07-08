import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Database, Users, ArrowRight, Eye, Zap, Globe, Lock, Activity, ChevronDown, Play, Pause } from 'lucide-react';

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Email Intelligence",
      description: "Deep analysis of email addresses across multiple platforms and services",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Breach Detection",
      description: "Real-time monitoring of data breaches and security incidents",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Platform Enumeration",
      description: "Comprehensive social media and platform presence analysis",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Risk Assessment",
      description: "Advanced scoring and threat level evaluation algorithms",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Interactive Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                SillyOSINT
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Activity className="h-4 w-4" />
            <span>Advanced Intelligence Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Digital Intelligence
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Redefined
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Comprehensive OSINT platform for email intelligence, breach detection, and digital footprint analysis. 
            Powered by advanced algorithms and real-time data sources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <span>Start Investigation</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Interactive Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Data Sources", value: "50+", icon: <Database className="h-6 w-6" /> },
              { label: "Platforms Monitored", value: "200+", icon: <Globe className="h-6 w-6" /> },
              { label: "Breach Databases", value: "15+", icon: <Shield className="h-6 w-6" /> },
              { label: "Daily Queries", value: "10K+", icon: <Activity className="h-6 w-6" /> }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
              >
                <div className="flex items-center justify-center mb-3 text-blue-600 group-hover:text-purple-600 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Advanced Intelligence Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cutting-edge tools and algorithms for comprehensive digital intelligence gathering
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 ${
                  activeFeature === index
                    ? 'border-blue-500 bg-blue-50/50 shadow-lg'
                    : 'border-gray-200 bg-white/60 hover:border-gray-300 hover:bg-white/80'
                }`}
                onClick={() => {
                  setActiveFeature(index);
                  setIsPlaying(false);
                }}
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                      activeFeature === index ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Demo Interface</h3>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700">Scanning email: example@domain.com</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">✓</div>
                    <div className="text-sm text-gray-700">Google Account</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                    <div className="text-sm text-gray-700">Platforms Found</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600 mb-1">3</div>
                    <div className="text-sm text-gray-700">Data Breaches</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                    <div className="text-sm text-gray-700">Trust Score</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Risk Assessment</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${85}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Investigation?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of security professionals and researchers using SillyOSINT for comprehensive digital intelligence.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;