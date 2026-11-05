import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  Filter,
  Users,
  Award,
  Clock
} from 'lucide-react';

const specialties = [
  "Corporate Law",
  "Family Law",
  "Criminal Defense",
  "Immigration",
  "Real Estate",
  "Intellectual Property",
  "Employment Law",
  "Personal Injury",
  "Tax Law",
  "Bankruptcy"
];

const mockLawyers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    specialty: "Corporate Law",
    location: "New York, NY",
    rating: 4.9,
    reviews: 127,
    experience: "15+ years",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    available: true,
    price: "$350/hr"
  },
  {
    id: 2,
    name: "James Rodriguez",
    specialty: "Family Law",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 98,
    experience: "12+ years",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    available: true,
    price: "$275/hr"
  },
  {
    id: 3,
    name: "Emily Chen",
    specialty: "Immigration",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 156,
    experience: "10+ years",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400",
    available: false,
    price: "$300/hr"
  },
  {
    id: 4,
    name: "Michael Thompson",
    specialty: "Criminal Defense",
    location: "Chicago, IL",
    rating: 4.7,
    reviews: 89,
    experience: "20+ years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    available: true,
    price: "$400/hr"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    specialty: "Real Estate",
    location: "Miami, FL",
    rating: 4.8,
    reviews: 112,
    experience: "8+ years",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
    available: true,
    price: "$250/hr"
  },
  {
    id: 6,
    name: "David Park",
    specialty: "Intellectual Property",
    location: "Seattle, WA",
    rating: 4.9,
    reviews: 143,
    experience: "14+ years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    available: true,
    price: "$375/hr"
  },
];

export default function FindLawyer() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredLawyers, setFilteredLawyers] = useState(mockLawyers);

  const handleSearch = () => {
    let results = mockLawyers;
    
    if (searchLocation) {
      results = results.filter(lawyer => 
        lawyer.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    
    if (selectedSpecialty && selectedSpecialty !== 'all') {
      results = results.filter(lawyer => 
        lawyer.specialty === selectedSpecialty
      );
    }
    
    setFilteredLawyers(results);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Users className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Lawyer Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Find a Lawyer </span>
              <span className="gradient-text">Near You</span>
            </h1>
            <p className="text-xl text-slate-400">
              Connect with verified legal professionals based on location, specialty, and client ratings.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-slate-900/80 backdrop-blur-sm border border-amber-900/30 rounded-2xl p-6 shadow-2xl shadow-amber-500/10">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Enter location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Lawyers
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-amber-900/20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "5,000+", label: "Verified Lawyers" },
              { icon: MapPin, value: "500+", label: "Cities Covered" },
              { icon: Award, value: "4.8", label: "Average Rating" },
              { icon: Clock, value: "24/7", label: "Availability" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {filteredLawyers.length} Lawyers Found
            </h2>
            <Button variant="outline" className="border-amber-900/30 text-slate-300 hover:text-amber-400">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer, index) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/80 border-amber-900/20 hover:border-amber-500/50 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={lawyer.image} 
                        alt={lawyer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                      <Badge 
                        className={`absolute top-4 right-4 ${lawyer.available ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
                      >
                        {lawyer.available ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-1">{lawyer.name}</h3>
                      <p className="text-amber-400 font-medium mb-3">{lawyer.specialty}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {lawyer.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {lawyer.experience}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-white font-medium">{lawyer.rating}</span>
                          <span className="text-slate-500">({lawyer.reviews} reviews)</span>
                        </div>
                        <span className="text-amber-400 font-semibold">{lawyer.price}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-amber-900/30 text-slate-300 hover:text-amber-400"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-amber-900/30 text-slate-300 hover:text-amber-400"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredLawyers.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No lawyers found</h3>
              <p className="text-slate-400">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}