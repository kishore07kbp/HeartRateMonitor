import React, { useState, useEffect } from 'react';
import { Plus, Activity, TrendingUp, TrendingDown, Heart, Calendar } from 'lucide-react';
import { getRates, addRate, getStats } from '../services/api';

interface HeartRate {
  id: number;
  bpm: number;
  timestamp: string;
}

interface Stats {
  min: number;
  max: number;
  maxHr: number;
  targetLower: number;
  targetUpper: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

const History = () => {
  const [rates, setRates] = useState<HeartRate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [newBPM, setNewBPM] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingRate, setAddingRate] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>('');

  // Check backend status on component mount
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/actuator/health');
        if (response.ok) {
          setBackendStatus('Backend is running');
        } else {
          setBackendStatus('Backend responded with error');
        }
      } catch (err) {
        setBackendStatus('Backend is not accessible');
        console.error('Backend status check failed:', err);
      }
    };
    
    checkBackendStatus();
  }, []);

  // Helper function to test token validity (unused - commented out)
  /*
  const testToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token to test');
        return;
      }

      console.log('Testing token validity with /secure endpoint...');
      const response = await fetch('http://localhost:8080/secure', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Token test response status:', response.status);
      if (response.ok) {
        const data = await response.text();
        console.log('Token test successful:', data);
        setError(''); // Clear any existing errors
        await fetchData(); // Refresh data
      } else {
        const errorData = await response.text();
        console.log('Token test failed:', errorData);
        setError(`Token validation failed: ${response.status} - ${errorData}`);
      }
    } catch (err) {
      console.error('Token test error:', err);
      setError(`Token test error: ${err}`);
    }
  };
  */

  // Helper function to test current user endpoint (unused - commented out)
  /*
  const testCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token to test current user');
        return;
      }

      console.log('Testing current user endpoint...');
      const response = await fetch('http://localhost:8080/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Current user test response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Current user test successful:', data);
        setError(''); // Clear any existing errors
      } else {
        const errorData = await response.text();
        console.log('Current user test failed:', errorData);
        setError(`Current user test failed: ${response.status} - ${errorData}`);
      }
    } catch (err) {
      console.error('Current user test error:', err);
      setError(`Current user test error: ${err}`);
    }
  };
  */

  // Helper function to test addRate endpoint (unused - commented out)
  /*
  const testAddRate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token to test addRate');
        return;
      }

      console.log('Testing addRate endpoint...');
      const testBPM = 75; // Test with a normal heart rate
      
      const response = await fetch('http://localhost:8080/rates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bpm: testBPM })
      });

      console.log('AddRate test response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('AddRate test successful:', data);
        setError(''); // Clear any existing errors
        await fetchData(); // Refresh data
      } else {
        const errorData = await response.text();
        console.log('AddRate test failed:', errorData);
        setError(`AddRate test failed: ${response.status} - ${errorData}`);
      }
    } catch (err) {
      console.error('AddRate test error:', err);
      setError(`AddRate test error: ${err}`);
    }
  };
  */

  // Helper function to create a test account (for development)
  const createTestAccount = async () => {
    try {
      const testUser = {
        name: 'Test User',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser)
      });
      
      if (response.ok) {
        console.log('Test account created successfully');
        // Try to login with the test account
        const loginResponse = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('token', loginData.token);
          window.location.reload(); // Refresh the page
        }
      } else {
        console.log('Test account might already exist, trying to login...');
        // Try to login with existing test account
        const loginResponse = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('token', loginData.token);
          window.location.reload(); // Refresh the page
        }
      }
    } catch (err) {
      console.error('Error creating test account:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login first.');
        return;
      }

      console.log('Token exists:', !!token);
      console.log('Token length:', token.length);
      console.log('Token starts with:', token.substring(0, 20) + '...');
      console.log('Fetching data with token:', token);
      
      const [ratesResponse, statsResponse] = await Promise.all([
        getRates(),
        getStats()
      ]);
      
      console.log('Rates response:', ratesResponse);
      console.log('Stats response:', statsResponse);
      
      setRates(ratesResponse.data);
      setStats(statsResponse.data);
    } catch (err: unknown) {
      console.error('Error details:', err);
      const apiError = err as ApiError;
      console.error('Error response:', apiError.response);
      console.error('Error message:', apiError.message);
      
      if (apiError.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (apiError.response?.status === 404) {
        setError('Backend endpoints not found. Please check if the server is running.');
      } else if (apiError.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Please check if the server is running on http://localhost:8080');
      } else {
        setError(`Failed to fetch data: ${apiError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBPM || parseInt(newBPM) < 30 || parseInt(newBPM) > 250) {
      setError('Please enter a valid BPM (30-250)');
      return;
    }

    setAddingRate(true);
    setError('');

    try {
      console.log('Adding heart rate:', parseInt(newBPM));
      const response = await addRate(parseInt(newBPM));
      console.log('Add rate response:', response);
      setNewBPM('');
      setShowAddForm(false);
      await fetchData(); // Refresh data
    } catch (err: unknown) {
      console.error('Add rate error details:', err);
      const apiError = err as ApiError;
      console.error('Error response:', apiError.response);
      console.error('Error message:', apiError.message);
      
      let errorMessage = 'Failed to add heart rate. Please try again.';
      
      if (apiError.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (apiError.response?.status === 400) {
        errorMessage = `Invalid data: ${apiError.response?.data?.message || 'Please check your input.'}`;
      } else if (apiError.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (apiError.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setAddingRate(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getBPMStatus = (bpm: number) => {
    if (!stats) return 'normal';
    if (bpm < stats.targetLower) return 'low';
    if (bpm > stats.targetUpper) return 'high';
    return 'normal';
  };

  const getBPMStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Heart Rate History</h1>
          <p className="text-gray-600">Track and monitor your cardiovascular health</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Reading</span>
        </button>
      </div>

      {/* Backend Status */}
      {backendStatus && (
        <div className={`mb-6 p-4 border rounded-lg ${
          backendStatus === 'Backend is running' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={backendStatus === 'Backend is running' ? 'text-green-700' : 'text-yellow-700'}>
            <strong>Backend Status:</strong> {backendStatus}
          </p>
        </div>
      )}

      {/* Authentication Help */}
      {error && error.includes('Authentication') && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 mb-3">
            <strong>Authentication Required:</strong> You need to login to view your heart rate history.
          </p>
          <div className="flex gap-2 flex-wrap">
            <a 
              href="/login" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors"
            >
              Create Account
            </a>
            <button 
              onClick={createTestAccount}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Create Test Account
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Add Rate Form */}
      {showAddForm && (
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Heart Rate Reading</h3>
          <form onSubmit={handleAddRate} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={newBPM}
                onChange={(e) => setNewBPM(e.target.value)}
                placeholder="Enter BPM (30-250)"
                min="30"
                max="250"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={addingRate}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingRate ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-8 w-8" />
              <TrendingUp className="h-5 w-5 opacity-80" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.max}</div>
            <div className="text-red-100 text-sm">Maximum BPM</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8" />
              <TrendingDown className="h-5 w-5 opacity-80" />
            </div>
            <div className="text-2xl font-bold mb-1">{stats.min}</div>
            <div className="text-blue-100 text-sm">Minimum BPM</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8" />
              <span className="text-sm opacity-80">TARGET</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stats.targetLower}</div>
            <div className="text-green-100 text-sm">Target Lower</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-8 w-8" />
              <span className="text-sm opacity-80">TARGET</span>
            </div>
            <div className="text-2xl font-bold mb-1">{stats.targetUpper}</div>
            <div className="text-purple-100 text-sm">Target Upper</div>
          </div>
        </div>
      )}

      {/* Heart Rate History */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Readings
          </h2>
        </div>
        
        {rates.length === 0 ? (
          <div className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No readings yet</h3>
            <p className="text-gray-500 mb-6">Start tracking your heart rate by adding your first reading</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Add First Reading
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {rates.map((rate) => {
              const status = getBPMStatus(rate.bpm);
              return (
                <div key={rate.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-800">
                            {rate.bpm} <span className="text-sm font-normal text-gray-500">BPM</span>
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getBPMStatusColor(status)}`}>
                            {status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(rate.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;