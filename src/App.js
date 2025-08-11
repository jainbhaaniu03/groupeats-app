import React, { useState, useEffect } from 'react';
import { Heart, X, MapPin, Users, Settings, Star, Loader, DollarSign } from 'lucide-react';

const GroupEats = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [groupVotes, setGroupVotes] = useState({});
  const [matches, setMatches] = useState([]);
  const [searchRadius, setSearchRadius] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample restaurant data (fallback when APIs aren't available)
  const sampleRestaurants = [
    {
      id: 1,
      name: "Tony's Italian Bistro",
      cuisine: "Italian",
      rating: 4.5,
      priceRange: "$$",
      distance: 0.8,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      description: "Authentic Italian cuisine with fresh pasta and wood-fired pizza",
      address: "123 Main St, Downtown"
    },
    {
      id: 2,
      name: "Sakura Sushi Bar",
      cuisine: "Japanese",
      rating: 4.7,
      priceRange: "$$$",
      distance: 1.2,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      description: "Fresh sushi and traditional Japanese dishes",
      address: "456 Oak Ave, Midtown"
    },
    {
      id: 3,
      name: "The Burger Joint",
      cuisine: "American",
      rating: 4.2,
      priceRange: "$",
      distance: 0.5,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      description: "Gourmet burgers and craft beer in a casual setting",
      address: "789 Pine St, Uptown"
    },
    {
      id: 4,
      name: "Spice Garden",
      cuisine: "Indian",
      rating: 4.6,
      priceRange: "$$",
      distance: 2.1,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      description: "Authentic Indian flavors with vegetarian options",
      address: "321 Elm Dr, Eastside"
    },
    {
      id: 5,
      name: "Le Petit Café",
      cuisine: "French",
      rating: 4.4,
      priceRange: "$$$",
      distance: 1.8,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      description: "Charming French bistro with classic dishes",
      address: "654 Maple Ln, Westside"
    },
    {
      id: 6,
      name: "Dragon Palace",
      cuisine: "Chinese",
      rating: 4.3,
      priceRange: "$$",
      distance: 1.5,
      image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop",
      description: "Traditional Chinese cuisine and dim sum",
      address: "987 Cedar St, Chinatown"
    },
    {
      id: 7,
      name: "Taco Libre",
      cuisine: "Mexican",
      rating: 4.1,
      priceRange: "$",
      distance: 0.7,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      description: "Authentic Mexican street food and margaritas",
      address: "159 Birch Ave, South District"
    },
    {
      id: 8,
      name: "Mediterranean Delight",
      cuisine: "Mediterranean",
      rating: 4.5,
      priceRange: "$$",
      distance: 1.9,
      image: "https://images.unsplash.com/photo-1544510503-6e31d2e95e31?w=400&h=300&fit=crop",
      description: "Fresh Mediterranean dishes with healthy options",
      address: "753 Willow Way, North End"
    }
  ];

  // Sample groups and users
  const sampleGroups = [
    {
      id: 1,
      name: "Friday Night Crew",
      members: [
        { id: 1, name: "Alex", avatar: "A" },
        { id: 2, name: "Jordan", avatar: "J" },
        { id: 3, name: "Sam", avatar: "S" },
        { id: 4, name: "Casey", avatar: "C" }
      ]
    }
  ];

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use sample data as fallback
          setLocation({
            lat: 40.7128,
            lng: -74.0060
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setLocation({
        lat: 40.7128,
        lng: -74.0060
      });
    }
  }, []);

  // Load restaurants (using sample data for demo)
  useEffect(() => {
    const loadRestaurants = async () => {
      if (location) {
        setLoading(true);
        
        // Simulate API loading
        setTimeout(() => {
          const filteredRestaurants = sampleRestaurants.filter(r => r.distance <= searchRadius);
          setRestaurants(filteredRestaurants);
          setCurrentRestaurantIndex(0);
          setError(null);
          setLoading(false);
        }, 1500);
      }
    };

    loadRestaurants();
  }, [location, searchRadius]);

  // Initialize user and group
  useEffect(() => {
    setCurrentUser({ id: 1, name: "Alex", avatar: "A" });
    setCurrentGroup(sampleGroups[0]);
  }, []);

  const handleSwipe = (restaurantId, vote) => {
    const newVotes = { ...groupVotes };
    if (!newVotes[restaurantId]) {
      newVotes[restaurantId] = {};
    }
    newVotes[restaurantId][currentUser.id] = vote;
    setGroupVotes(newVotes);

    // Check if all group members have voted
    const restaurant = restaurants[currentRestaurantIndex];
    const votes = newVotes[restaurantId];
    const votedMembers = Object.keys(votes);
    
    if (votedMembers.length === currentGroup.members.length) {
      const allLiked = Object.values(votes).every(vote => vote === 'like');
      if (allLiked) {
        setMatches(prev => [...prev, restaurant]);
      }
    }

    // Move to next restaurant
    if (currentRestaurantIndex < restaurants.length - 1) {
      setCurrentRestaurantIndex(currentRestaurantIndex + 1);
    }
  };

  const getCurrentRestaurant = () => {
    return restaurants[currentRestaurantIndex];
  };

  const getVoteStatus = (restaurantId) => {
    if (!groupVotes[restaurantId]) return null;
    const votes = groupVotes[restaurantId];
    const votedCount = Object.keys(votes).length;
    const likeCount = Object.values(votes).filter(vote => vote === 'like').length;
    return { votedCount, likeCount, totalMembers: currentGroup.members.length };
  };

  // Loading state
  if (loading || !currentUser || !currentGroup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-8 h-8 text-pink-500 animate-spin mb-4" />
        <p className="text-gray-600">Finding amazing restaurants near you...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-red-500 text-center">
          <X className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showMatches) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-4 bg-gradient-to-r from-pink-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowMatches(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">Group Matches</h1>
            <div></div>
          </div>
        </div>
        
        <div className="p-4">
          {matches.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No matches yet. Keep swiping!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(restaurant => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-lg p-4 border">
                  <div className="flex items-center space-x-3 mb-3">
                    <Heart className="w-6 h-6 text-red-500" />
                    <span className="text-green-600 font-semibold">Everyone Loves This!</span>
                  </div>
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-bold">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.distance} mi</span>
                    </div>
                    <span>{restaurant.priceRange}</span>
                  </div>
                  <p className="text-xs text-gray-500">{restaurant.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-4 bg-gradient-to-r from-pink-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowSettings(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">Settings</h1>
            <div></div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius: {searchRadius} miles
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 mi</span>
              <span>25 mi</span>
            </div>
          </div>
          
          {location && (
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Your Location</h3>
              <p className="text-sm text-gray-600">
                📍 Searching near you<br/>
                Found {restaurants.length} restaurants within {searchRadius} miles
              </p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">About This Demo</h3>
            <p className="text-sm text-blue-700">
              This is a demo version using sample restaurant data. 
              In a full version, this would connect to real restaurant APIs 
              like Yelp or Google Places to show actual nearby restaurants.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentRestaurant = getCurrentRestaurant();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-500 to-red-500 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">GroupEats</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowMatches(true)}
              className="bg-white bg-opacity-20 p-2 rounded-full relative hover:bg-opacity-30 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {matches.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {matches.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Group Info */}
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5" />
          <span className="font-medium">{currentGroup.name}</span>
          <div className="flex -space-x-2">
            {currentGroup.members.map(member => (
              <div 
                key={member.id}
                className="w-8 h-8 bg-white text-pink-500 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white"
              >
                {member.avatar}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Card */}
      <div className="p-4">
        {currentRestaurant ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <img 
              src={currentRestaurant.image} 
              alt={currentRestaurant.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
              }}
            />
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{currentRestaurant.name}</h2>
              <p className="text-gray-600 mb-4">{currentRestaurant.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">{currentRestaurant.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{currentRestaurant.distance} mi away</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <span>{currentRestaurant.priceRange}</span>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 mb-6">
                <div className="text-sm text-gray-600 mb-2">
                  🍽️ {currentRestaurant.cuisine} • 📍 {currentRestaurant.address}
                </div>
                {(() => {
                  const voteStatus = getVoteStatus(currentRestaurant.id);
                  if (voteStatus) {
                    return (
                      <div className="text-sm">
                        <span className="text-green-600">
                          {voteStatus.likeCount}/{voteStatus.totalMembers} members liked this
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSwipe(currentRestaurant.id, 'pass')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 p-4 rounded-2xl flex items-center justify-center transition-colors"
                >
                  <X className="w-8 h-8 text-gray-600" />
                </button>
                <button
                  onClick={() => handleSwipe(currentRestaurant.id, 'like')}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 p-4 rounded-2xl flex items-center justify-center transition-colors"
                >
                  <Heart className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">All done!</h2>
            <p className="text-gray-600 mb-4">You've swiped through all restaurants in your area.</p>
            <button 
              onClick={() => setShowMatches(true)}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-colors"
            >
              View Matches ({matches.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupEats;
