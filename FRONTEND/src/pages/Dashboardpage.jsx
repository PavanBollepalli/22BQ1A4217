import React from 'react'
import { FaLink, FaChartLine, FaClock, FaUser } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { getStats } from '../api/user.api'
import { getRecentUrls } from '../api/shortUrl.api'
import { useEffect } from 'react'

const Dashboardpage = () => {
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0
  });
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        // console.log("Stats response:", response);
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const fetchRecentUrls = async () => {
      try {
        const response = await getRecentUrls();
        // console.log("recent Urls response:", response);
        if (response.data) {
          setRecent(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch RecentUrls:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentUrls();
  }, []);

  const statCards = [
    { title: 'Total URLs', value: stats.totalUrls || 0, icon: <FaLink className="text-blue-500" /> },
    { title: 'Total Clicks', value: stats.totalClicks || 0, icon: <FaChartLine className="text-green-500" /> },
  ];



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your URL shortening overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent URLs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Recent URLs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recent.map((url) => (
                  <tr key={url._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-xs truncate">{url.full_url}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <a href={`http://urlshortner.rf.gd/${url.short_url}`} target="_blank" rel="noopener noreferrer">
                        {`urlshortner.rf.gd/${url.short_url}`}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{url.clicks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{url.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboardpage