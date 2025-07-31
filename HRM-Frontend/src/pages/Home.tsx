import React from 'react';
import { Heart, Activity, TrendingUp, Shield, Clock, BarChart3 } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Activity className="h-8 w-8 text-blue-500" />,
      title: "Real-time Monitoring",
      description: "Track your heart rate in real-time with accurate measurements"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      title: "Detailed Analytics",
      description: "View comprehensive statistics and trends over time"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: "Progress Tracking",
      description: "Monitor your cardiovascular health improvements"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Secure Data",
      description: "Your health data is encrypted and securely stored"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
            <Heart className="h-16 w-16 text-white" fill="currentColor" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Track Your Heart Health
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Monitor, analyze, and improve your cardiovascular health with our comprehensive 
          heart rate tracking system. Get insights into your fitness progress and health trends.
        </p>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose HeartTracker?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to monitor and improve your heart health
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl">
            <div className="flex justify-center mb-4">
              <Clock className="h-10 w-10" />
            </div>
            <div className="text-3xl font-bold mb-2">24/7</div>
            <div className="text-blue-100">Continuous Monitoring</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl">
            <div className="flex justify-center mb-4">
              <Activity className="h-10 w-10" />
            </div>
            <div className="text-3xl font-bold mb-2">99.9%</div>
            <div className="text-green-100">Accuracy Rate</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl">
            <div className="flex justify-center mb-4">
              <TrendingUp className="h-10 w-10" />
            </div>
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-purple-100">Users Trust Us</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;