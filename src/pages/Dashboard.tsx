import React, { useState } from 'react';
import { Search, Mail, AlertTriangle, CheckCircle, XCircle, ExternalLink, Calendar, Shield, Globe, User, Activity, Database, Lock, Eye, Clock, TrendingUp, Users, Star } from 'lucide-react';
import { LookupResult } from '../types';
import { osintService } from '../services/osintService';

const Dashboard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LookupResult | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const data = await osintService.lookupEmail(email);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to perform intelligence lookup');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 border-green-200 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'HIGH': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'CRITICAL': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <Shield className="h-5 w-5 text-green-600" />;
      case 'MEDIUM': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'HIGH': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'CRITICAL': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Intelligence Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive email intelligence and digital footprint analysis platform
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Email Intelligence Lookup</h2>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address for comprehensive analysis..."
                className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                required
              />
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 transform hover:scale-105"
              >
                <Search className="h-6 w-6" />
                <span>{loading ? 'Analyzing...' : 'Start Analysis'}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-lg">{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    results.google_account?.exists ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {results.google_account?.exists ? 'VERIFIED' : 'NOT FOUND'}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Account</h3>
                <p className="text-gray-600 text-sm">
                  {results.google_account?.exists ? 'Account verified and active' : 'No Google account detected'}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {results.platforms.filter(p => p.exists).length}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Platforms Found</h3>
                <p className="text-gray-600 text-sm">Active social media presence</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.breaches.length}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Breaches</h3>
                <p className="text-gray-600 text-sm">Security incidents detected</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {results.reputation_score}%
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust Score</h3>
                <p className="text-gray-600 text-sm">Overall reputation rating</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Risk Assessment</h2>
              </div>
              
              <div className={`p-6 rounded-xl border-2 ${getRiskColor(results.risk_level)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getRiskIcon(results.risk_level)}
                    <span className="text-xl font-bold">Risk Level: {results.risk_level}</span>
                  </div>
                  <div className="text-3xl font-bold">{results.reputation_score}%</div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      results.risk_level === 'LOW' ? 'bg-green-500' :
                      results.risk_level === 'MEDIUM' ? 'bg-yellow-500' :
                      results.risk_level === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${results.reputation_score}%` }}
                  ></div>
                </div>
                
                <p className="text-sm opacity-80">
                  {results.risk_level === 'LOW' && 'Low risk profile with good digital hygiene'}
                  {results.risk_level === 'MEDIUM' && 'Moderate risk with some security concerns'}
                  {results.risk_level === 'HIGH' && 'High risk profile requiring attention'}
                  {results.risk_level === 'CRITICAL' && 'Critical risk level with immediate action needed'}
                </p>
              </div>
            </div>

            {/* Google Account Details */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Google Account Intelligence</h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8">
                {results.google_account?.exists ? (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        {results.google_account.profile_picture ? (
                          <img 
                            src={results.google_account.profile_picture} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-10 w-10 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                          <h3 className="text-xl font-bold text-gray-900">Google Account Verified</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {results.google_account.display_name && (
                            <div className="bg-white rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Display Name</div>
                              <div className="font-semibold text-gray-900">{results.google_account.display_name}</div>
                            </div>
                          )}
                          
                          {results.google_account.google_id && (
                            <div className="bg-white rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Google ID</div>
                              <div className="font-mono text-sm text-gray-900">{results.google_account.google_id}</div>
                            </div>
                          )}
                          
                          {results.google_account.last_edit && (
                            <div className="bg-white rounded-lg p-4">
                              <div className="text-sm text-gray-500 mb-1">Last Activity</div>
                              <div className="text-gray-900">{new Date(results.google_account.last_edit).toLocaleDateString()}</div>
                            </div>
                          )}
                          
                          <div className="bg-white rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Account Status</div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-700 font-medium">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Google Account Found</h3>
                    <p className="text-gray-600">This email address is not associated with a Google account</p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Analysis */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Platform Analysis</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.platforms.map((platform, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-lg">{platform.platform}</h3>
                      {platform.exists ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-xs text-green-700 font-bold px-2 py-1 bg-green-100 rounded-full">FOUND</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-5 w-5 text-red-400" />
                          <span className="text-xs text-red-600 font-bold px-2 py-1 bg-red-100 rounded-full">NOT FOUND</span>
                        </div>
                      )}
                    </div>
                    
                    {platform.username && (
                      <div className="mb-3">
                        <div className="text-sm text-gray-500 mb-1">Username</div>
                        <div className="font-medium text-gray-900">@{platform.username}</div>
                      </div>
                    )}
                    
                    {platform.additional_info && (
                      <div className="mb-4 space-y-2">
                        {Object.entries(platform.additional_info).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                            <span className="text-gray-900 font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {platform.profile_url && (
                      <a 
                        href={platform.profile_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors group"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Breach Analysis */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Security Breach Analysis</h2>
              </div>
              
              {results.breaches.length > 0 ? (
                <div className="space-y-6">
                  {results.breaches.map((breach, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6 hover:bg-red-100/50 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-bold text-gray-900 text-xl">{breach.name}</h3>
                            <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-bold">
                              BREACH
                            </span>
                            {breach.verified && (
                              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-bold">
                                VERIFIED
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-6 leading-relaxed">{breach.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Calendar className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">Breach Date</span>
                              </div>
                              <div className="font-semibold text-gray-900">
                                {new Date(breach.breach_date).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <User className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">Affected Records</span>
                              </div>
                              <div className="font-semibold text-gray-900">
                                {breach.pwn_count.toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-gray-500">Discovered</span>
                              </div>
                              <div className="font-semibold text-gray-900">
                                {new Date(breach.added_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500 mb-3 font-semibold">Compromised Data Types:</div>
                            <div className="flex flex-wrap gap-2">
                              {breach.data_classes.map((dataClass, i) => (
                                <span key={i} className="bg-red-200 text-red-800 px-3 py-1 rounded-lg text-sm font-medium">
                                  {dataClass}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Security Breaches Detected</h3>
                  <p className="text-gray-600">This email address has not been found in any known data breaches</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;