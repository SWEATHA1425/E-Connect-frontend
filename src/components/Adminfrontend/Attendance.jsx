import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCalendarCheck, faUsers, faUserTie, faChartBar, faClock, faPercentage, faCalendarDays, faBuilding, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
import { LS, ipadr} from '../../Utils/Resuse';
<<<<<<< HEAD
import * as XLSX from "xlsx";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
=======
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = `${ipadr}`

=======
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  const API_BASE_URL = `${ipadr}`

  // User info from localStorage
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const userId = LS.get('userid');
  const userPosition = LS.get('position');
  const userName = LS.get('name');
  const isAdmin = LS.get('isadmin');

<<<<<<< HEAD
=======
  // Determine user role
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const getUserRole = () => {
    if (isAdmin) return 'admin';
    if (userPosition === 'HR') return 'hr';
    if (userPosition === 'Manager') return 'manager';
    return 'user';
  };

  const userRole = getUserRole();

<<<<<<< HEAD
=======
  // Fetch attendance data based on user role
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const fetchAttendanceData = async (year) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '';
      
      switch (userRole) {
        case 'admin':
          url = `${API_BASE_URL}/attendance/admin/overview?year=${year}`;
          break;
        case 'hr':
<<<<<<< HEAD
          url = `${API_BASE_URL}/attendance/admin/overview?year=${year}`;
          break;
        case 'manager':
=======
          // For HR, we'll need to implement the endpoint later
          // For now, use admin endpoint as placeholder
          url = `${API_BASE_URL}/attendance/admin/overview?year=${year}`;
          break;
        case 'manager':
          // Fetch manager's own data first
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
          url = `${API_BASE_URL}/attendance/user/${userId}`;
          break;
        case 'user':
          url = `${API_BASE_URL}/attendance/user/${userId}`;
          break;
        default:
          throw new Error('Unknown user role');
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      const data = await response.json();
      setAttendanceData(data);

<<<<<<< HEAD
=======
      // If manager, also fetch team data
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
      if (userRole === 'manager') {
        const teamResponse = await fetch(`${API_BASE_URL}/attendance/team/${userName}?year=${year}`);
        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setAttendanceData(prev => ({ ...prev, teamData }));
        }
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedYear);
  }, [selectedYear, userRole]);

<<<<<<< HEAD
=======
  // Get year options
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 3; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

<<<<<<< HEAD
=======
  // Get departments for filter (admin/hr only)
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const getDepartments = () => {
    if (!attendanceData || !attendanceData.department_wise_stats) return [];
    return Object.keys(attendanceData.department_wise_stats);
  };

<<<<<<< HEAD
=======
  // Filter employees based on search term and department
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const getFilteredEmployees = () => {
    if (!attendanceData) return [];

    let employees = selectedDepartment === 'all' 
      ? attendanceData.all_employee_stats 
      : attendanceData.department_wise_stats[selectedDepartment]?.employees || [];

<<<<<<< HEAD
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      employees = employees.filter(employee => {
        const nameLower = employee.username.toLowerCase();
        const searchWords = searchLower.split(/\s+/);
        return searchWords.every(word => nameLower.includes(word));
      });
=======
    // Apply search filter
    if (searchTerm.trim()) {
      employees = employees.filter(employee =>
        employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.user_info?.email && employee.user_info.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
    }

    return employees;
  };

<<<<<<< HEAD
=======
  // Clear search
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const clearSearch = () => {
    setSearchTerm('');
  };

<<<<<<< HEAD
  const downloadExcel = () => {
    if (!attendanceData) {
      alert("No data available to download.");
      return;
    }

    let exportData = [];

    if (userRole === "admin" || userRole === "hr") {
      const employees = getFilteredEmployees();
      exportData = employees.map((emp) => ({
        Name: emp.username,
        Email: emp.user_info?.email || "N/A",
        Department: emp.user_info?.department || "N/A",
        Position: emp.user_info?.position || "N/A",
        Present_Days: emp.present_days,
        Leave_Days: emp.leave_days_taken,
        Attendance_Percentage: emp.attendance_percentage?.toFixed(1) + "%",
      }));
    } else if (userRole === "manager" && attendanceData?.teamData?.team_stats) {
      const filteredTeamMembers = attendanceData.teamData.team_stats.filter(member => {
        if (!searchTerm.trim()) return true;
        
        const searchLower = searchTerm.toLowerCase().trim();
        const nameLower = member.username.toLowerCase();
        const searchWords = searchLower.split(/\s+/);
        return searchWords.every(word => nameLower.includes(word));
      });
      
      exportData = filteredTeamMembers.map((member) => ({
        Name: member.username,
        Email: member.user_info?.email || "N/A",
        Department: member.user_info?.department || "N/A",
        Present_Days: member.present_days,
        Attendance_Percentage: member.attendance_percentage?.toFixed(1) + "%",
      }));
    } else if (userRole === "user") {
      const stats = attendanceData.attendance_stats;
      exportData = [
        {
          Name: attendanceData.user_info?.name || "N/A",
          Email: attendanceData.user_info?.email || "N/A",
          Working_Days: stats?.total_working_days || 0,
          Present_Days: stats?.present_days || 0,
          Leave_Days: stats?.leave_days_taken || 0,
          Attendance_Percentage: stats?.attendance_percentage?.toFixed(1) + "%",
        },
      ];
    }

    if (exportData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AttendanceData");

    const fileName = searchTerm 
      ? `attendance_${userRole}_${searchTerm}_${selectedYear}.xlsx`
      : `attendance_${userRole}_${selectedYear}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

=======
  // Render user's personal attendance (for regular users)
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const renderUserAttendance = () => {
    if (!attendanceData) return null;

    const { user_info, attendance_stats } = attendanceData;

    return (
<<<<<<< HEAD
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-600" />
=======
      <div className="space-y-6">
        {/* Personal Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faUserTie} className="mr-3 text-blue-600" />
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
              Personal Attendance
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Year {selectedYear}</p>
<<<<<<< HEAD
              <p className="text-base font-semibold text-blue-600">{user_info?.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Working Days</p>
=======
              <p className="text-lg font-semibold text-blue-600">{user_info?.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Working Days</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">{attendance_stats?.total_working_days || 0}</p>
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Present Days</p>
=======
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Present Days</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">{attendance_stats?.present_days || 0}</p>
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faPercentage} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Attendance %</p>
=======
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPercentage} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Attendance %</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">
                    {attendance_stats?.attendance_percentage?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faClock} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Leave Days</p>
=======
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Leave Days</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">{attendance_stats?.leave_days_taken || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-white rounded-lg p-4 shadow-lg border">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Attendance Status</h3>
          <div className="flex items-center justify-between">
            <div className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${
=======
        {/* Attendance Status */}
        <div className="bg-white rounded-lg p-6 shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Status</h3>
          <div className="flex items-center justify-between">
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
              attendance_stats?.attendance_percentage >= 90 
                ? 'bg-green-100 text-green-800' 
                : attendance_stats?.attendance_percentage >= 75 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {attendance_stats?.attendance_percentage >= 90 ? 'Excellent Attendance' : 
               attendance_stats?.attendance_percentage >= 75 ? 'Good Attendance' : 'Needs Improvement'}
            </div>
<<<<<<< HEAD
            <p className="text-xs text-gray-500">
=======
            <p className="text-sm text-gray-500">
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
              Last Updated: {new Date(attendance_stats?.last_updated).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      </div>
    );
  };

<<<<<<< HEAD
=======
  // Render manager's view (personal + team data)
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const renderManagerView = () => {
    if (!attendanceData) return null;

    const { user_info, attendance_stats, teamData } = attendanceData;

<<<<<<< HEAD
    const filteredTeamMembers = teamData?.team_stats?.filter(member => {
      if (!searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase().trim();
      const nameLower = member.username.toLowerCase();
      const searchWords = searchLower.split(/\s+/);
      return searchWords.every(word => nameLower.includes(word));
    }) || [];

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow border">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-600" />
            Manager Dashboard - {user_info?.name}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faPercentage} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Attendance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {attendance_stats?.attendance_percentage?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Present Days</p>
                  <p className="text-2xl font-bold text-blue-600">{attendance_stats?.present_days || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Team Size</p>
                  <p className="text-2xl font-bold text-blue-600">{teamData?.team_size || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faChartBar} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Team Avg</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {teamData?.average_attendance?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
=======
    // Filter team members based on search
    const filteredTeamMembers = teamData?.team_stats?.filter(member =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.user_info?.email && member.user_info.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    return (
      <div className="space-y-6">
        {/* Manager's Personal Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FontAwesomeIcon icon={faUserTie} className="mr-3 text-blue-600" />
            Manager Dashboard - {user_info?.name}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Your Attendance</p>
              <p className="text-2xl font-bold text-blue-600">
                {attendance_stats?.attendance_percentage?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-blue-600">{attendance_stats?.present_days || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Team Size</p>
              <p className="text-2xl font-bold text-blue-600">{teamData?.team_size || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Team Avg</p>
              <p className="text-2xl font-bold text-blue-600">
                {teamData?.average_attendance?.toFixed(1) || 0}%
              </p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {teamData && teamData.team_stats && teamData.team_stats.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-lg border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-600" />
                Team Members Attendance
              </h3>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-56"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                <button
                  onClick={downloadExcel}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-1" />
                  <span className="hidden sm:inline">Download Excel</span>
                </button>
              </div>
            </div>
            
            <div className="mb-2 text-xs text-gray-600">
              Showing {filteredTeamMembers.length} of {teamData.team_stats.length} team members
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  (Search to download specific member's attendance)
                </span>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <div className="max-h-[calc(100vh-420px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTeamMembers.length > 0 ? (
                      filteredTeamMembers.map((member, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{member.username}</div>
                            <div className="text-xs text-gray-500">{member.user_info?.email}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {member.user_info?.department || 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {member.present_days}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {member.attendance_percentage?.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.attendance_percentage >= 90 
                                ? 'bg-green-100 text-green-800' 
                                : member.attendance_percentage >= 75 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.attendance_percentage >= 90 ? 'Excellent' : 
                               member.attendance_percentage >= 75 ? 'Good' : 'Poor'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500 text-sm">
                          {searchTerm ? `No team members found matching "${searchTerm}"` : 'No team members found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
=======
        {/* Team Members */}
        {teamData && teamData.team_stats && teamData.team_stats.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-lg border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-3 text-blue-600" />
                Team Members Attendance
              </h3>
              
              {/* Search Input for Team Members */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="mb-2 text-sm text-gray-600">
              Showing {filteredTeamMembers.length} of {teamData.team_stats.length} team members
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeamMembers.length > 0 ? (
                    filteredTeamMembers.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{member.username}</div>
                          <div className="text-sm text-gray-500">{member.user_info?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {member.user_info?.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.present_days}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.attendance_percentage?.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            member.attendance_percentage >= 90 
                              ? 'bg-green-100 text-green-800' 
                              : member.attendance_percentage >= 75 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {member.attendance_percentage >= 90 ? 'Excellent' : 
                             member.attendance_percentage >= 75 ? 'Good' : 'Poor'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? `No team members found matching "${searchTerm}"` : 'No team members found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
            </div>
          </div>
        )}
      </div>
    );
  };

<<<<<<< HEAD
=======
  // Render admin view (all employees)
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const renderAdminView = () => {
    if (!attendanceData) return null;

    const filteredEmployees = getFilteredEmployees();

    return (
<<<<<<< HEAD
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faChartBar} className="mr-2 text-indigo-600" />
              Company Attendance Overview
            </h2>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Departments</option>
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Employees</p>
=======
      <div className="space-y-6">
        {/* Admin Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FontAwesomeIcon icon={faChartBar} className="mr-3 text-indigo-600" />
              Company Attendance Overview
            </h2>
            <div className="flex gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {getDepartments().map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">{attendanceData.total_employees}</p>
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faPercentage} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overall Company Average</p>
=======
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPercentage} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Overall Company Average</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">
                    {attendanceData.overall_average_attendance?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faBuilding} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Departments</p>
=======
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBuilding} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">{getDepartments().length}</p>
                </div>
              </div>
            </div>
            
<<<<<<< HEAD
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600 text-xl mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Year</p>
=======
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Year</p>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  <p className="text-2xl font-bold text-blue-600">{attendanceData.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
              <h3 className="text-base font-semibold text-gray-800">
=======
        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                {selectedDepartment === 'all'
                  ? 'All Employees'
                  : `${selectedDepartment} Department`} 
                Attendance Details
              </h3>
<<<<<<< HEAD

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-56"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                <button
                  onClick={downloadExcel}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-1" />
                  <span className="hidden sm:inline">Download Excel</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-600">
=======
              
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
              Showing {filteredEmployees.length} of {
                selectedDepartment === 'all' 
                  ? attendanceData.all_employee_stats?.length || 0
                  : attendanceData.department_wise_stats[selectedDepartment]?.employees?.length || 0
              } employees
              {searchTerm && (
<<<<<<< HEAD
                <span className="ml-2">
                  matching "<span className="text-blue-600 font-medium">{searchTerm}</span>"
                  <span className="ml-1 text-blue-600">
                    (Download exports searched results)
                  </span>
=======
                <span className="ml-2 text-blue-600">
                  matching "{searchTerm}"
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
<<<<<<< HEAD
            <div className="max-h-[calc(100vh-420px)] overflow-y-auto">
              <table className="min-w-full w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attend %</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Leave</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
=======
            <div className="max-h-85 overflow-y-auto">
              <table className="min-w-full w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee, index) => (
                      <tr key={index} className="hover:bg-gray-50">
<<<<<<< HEAD
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.username}</div>
                          <div className="text-xs text-gray-500">{employee.user_info?.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {employee.user_info?.department || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {employee.user_info?.position || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {employee.present_days}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.attendance_percentage?.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {employee.leave_days_taken}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
=======
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.username}</div>
                          <div className="text-sm text-gray-500">{employee.user_info?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {employee.user_info?.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {employee.user_info?.position || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.present_days}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.attendance_percentage?.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.leave_days_taken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              employee.attendance_percentage >= 90
                                ? 'bg-green-100 text-green-800'
                                : employee.attendance_percentage >= 75
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {employee.attendance_percentage >= 90
                              ? 'Excellent'
                              : employee.attendance_percentage >= 75
                              ? 'Good'
                              : 'Poor'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
<<<<<<< HEAD
                      <td colSpan="7" className="px-4 py-6 text-center text-gray-500 text-sm">
=======
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                        {searchTerm ? `No employees found matching "${searchTerm}"` : 'No employees found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

<<<<<<< HEAD
=======
  // Main render function
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading attendance data...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      );
    }

    switch (userRole) {
      case 'admin':
        return renderAdminView();
      case 'manager':
        return renderManagerView();
      case 'hr':
<<<<<<< HEAD
        return renderAdminView();
=======
        return renderAdminView(); // For now, HR sees admin view
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
      case 'user':
        return renderUserAttendance();
      default:
        return <div>Access denied</div>;
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-6 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Attendance Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
=======
    <div className="bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Attendance Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
              >
                {getYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
<<<<<<< HEAD
              <div className="text-xs sm:text-sm text-gray-600">
=======
              <div className="text-sm text-gray-600">
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
                Role: <span className="font-semibold capitalize">{userRole}</span>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        </div>

<<<<<<< HEAD
=======
        {/* Main Content */}
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
        {renderContent()}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Attendance;

// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faCalendarCheck, faUsers, faUserTie, faChartBar, faClock, faPercentage, faCalendarDays, faBuilding, faSearch, faTimes} from '@fortawesome/free-solid-svg-icons';
// import { LS, ipadr} from '../../Utils/Resuse';

// const Attendance = () => {
//   const [attendanceData, setAttendanceData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedDepartment, setSelectedDepartment] = useState('all');
//   const [searchTerm, setSearchTerm] = useState(''); // New state for search

//   const API_BASE_URL = `${ipadr}`

//   // User info from localStorage
//   const userId = LS.get('userid');
//   const userPosition = LS.get('position');
//   const userName = LS.get('name');
//   const isAdmin = LS.get('isadmin');

//   // Determine user role
//   const getUserRole = () => {
//     if (isAdmin) return 'admin';
//     if (userPosition === 'HR') return 'hr';
//     if (userPosition === 'Manager') return 'manager';
//     return 'user';
//   };

//   const userRole = getUserRole();

//   // Fetch attendance data based on user role
//   const fetchAttendanceData = async (year) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       let url = '';
      
//       switch (userRole) {
//         case 'admin':
//           url = `${API_BASE_URL}/attendance/admin/overview?year=${year}`;
//           break;
//         case 'hr':
//           // For HR, we'll need to implement the endpoint later
//           // For now, use admin endpoint as placeholder
//           url = `${API_BASE_URL}/attendance/admin/overview?year=${year}`;
//           break;
//         case 'manager':
//           // Fetch manager's own data first
//           url = `${API_BASE_URL}/attendance/user/${userId}`;
//           break;
//         case 'user':
//           url = `${API_BASE_URL}/attendance/user/${userId}`;
//           break;
//         default:
//           throw new Error('Unknown user role');
//       }

//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error('Failed to fetch attendance data');
//       }
//       const data = await response.json();
//       setAttendanceData(data);

//       // If manager, also fetch team data
//       if (userRole === 'manager') {
//         const teamResponse = await fetch(`${API_BASE_URL}/attendance/team/${userName}?year=${year}`);
//         if (teamResponse.ok) {
//           const teamData = await teamResponse.json();
//           setAttendanceData(prev => ({ ...prev, teamData }));
//         }
//       }
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendanceData(selectedYear);
//   }, [selectedYear, userRole]);

//   // Get year options
//   const getYearOptions = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let i = 0; i < 3; i++) {
//       years.push(currentYear - i);
//     }
//     return years;
//   };

//   // Get departments for filter (admin/hr only)
//   const getDepartments = () => {
//     if (!attendanceData || !attendanceData.department_wise_stats) return [];
//     return Object.keys(attendanceData.department_wise_stats);
//   };

//   // Filter employees based on search term and department
//   const getFilteredEmployees = () => {
//     if (!attendanceData) return [];

//     let employees = selectedDepartment === 'all' 
//       ? attendanceData.all_employee_stats 
//       : attendanceData.department_wise_stats[selectedDepartment]?.employees || [];

//     // Apply search filter
//     if (searchTerm.trim()) {
//       employees = employees.filter(employee =>
//         employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (employee.user_info?.email && employee.user_info.email.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     return employees;
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   // Render user's personal attendance (for regular users)
//   const renderUserAttendance = () => {
//     if (!attendanceData) return null;

//     const { user_info, attendance_stats } = attendanceData;

//     return (
//       <div className="space-y-6">
//         {/* Personal Info Card */}
//         <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-200">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//               <FontAwesomeIcon icon={faUserTie} className="mr-3 text-blue-600" />
//               Personal Attendance
//             </h2>
//             <div className="text-right">
//               <p className="text-sm text-gray-600">Year {selectedYear}</p>
//               <p className="text-lg font-semibold text-blue-600">{user_info?.name}</p>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Working Days</p>
//                   <p className="text-2xl font-bold text-blue-600">{attendance_stats?.total_working_days || 0}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Present Days</p>
//                   <p className="text-2xl font-bold text-blue-600">{attendance_stats?.present_days || 0}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faPercentage} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Attendance %</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {attendance_stats?.attendance_percentage?.toFixed(1) || 0}%
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faClock} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Leave Days</p>
//                   <p className="text-2xl font-bold text-blue-600">{attendance_stats?.leave_days_taken || 0}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Attendance Status */}
//         <div className="bg-white rounded-lg p-6 shadow-lg border">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Status</h3>
//           <div className="flex items-center justify-between">
//             <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
//               attendance_stats?.attendance_percentage >= 90 
//                 ? 'bg-green-100 text-green-800' 
//                 : attendance_stats?.attendance_percentage >= 75 
//                 ? 'bg-yellow-100 text-yellow-800' 
//                 : 'bg-red-100 text-red-800'
//             }`}>
//               {attendance_stats?.attendance_percentage >= 90 ? 'Excellent Attendance' : 
//                attendance_stats?.attendance_percentage >= 75 ? 'Good Attendance' : 'Needs Improvement'}
//             </div>
//             <p className="text-sm text-gray-500">
//               Last Updated: {new Date(attendance_stats?.last_updated).toLocaleDateString("en-GB")}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render manager's view (personal + team data)
//   const renderManagerView = () => {
//     if (!attendanceData) return null;

//     const { user_info, attendance_stats, teamData } = attendanceData;

//     // Filter team members based on search
//     const filteredTeamMembers = teamData?.team_stats?.filter(member =>
//       member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (member.user_info?.email && member.user_info.email.toLowerCase().includes(searchTerm.toLowerCase()))
//     ) || [];

//     return (
//       <div className="space-y-6">
//         {/* Manager's Personal Stats */}
//         <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-200">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
//             <FontAwesomeIcon icon={faUserTie} className="mr-3 text-blue-600" />
//             Manager Dashboard - {user_info?.name}
//           </h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-600">Your Attendance</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {attendance_stats?.attendance_percentage?.toFixed(1) || 0}%
//               </p>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-600">Present Days</p>
//               <p className="text-2xl font-bold text-blue-600">{attendance_stats?.present_days || 0}</p>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-600">Team Size</p>
//               <p className="text-2xl font-bold text-blue-600">{teamData?.team_size || 0}</p>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <p className="text-sm text-gray-600">Team Avg</p>
//               <p className="text-2xl font-bold text-blue-600">
//                 {teamData?.average_attendance?.toFixed(1) || 0}%
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Team Members */}
//         {teamData && teamData.team_stats && teamData.team_stats.length > 0 && (
//           <div className="bg-white rounded-lg p-6 shadow-lg border">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <FontAwesomeIcon icon={faUsers} className="mr-3 text-blue-600" />
//                 Team Members Attendance
//               </h3>
              
//               {/* Search Input for Team Members */}
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search team members..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <div className="mb-2 text-sm text-gray-600">
//               Showing {filteredTeamMembers.length} of {teamData.team_stats.length} team members
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredTeamMembers.length > 0 ? (
//                     filteredTeamMembers.map((member, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{member.username}</div>
//                           <div className="text-sm text-gray-500">{member.user_info?.email}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {member.user_info?.department || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {member.present_days}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {member.attendance_percentage?.toFixed(1)}%
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                             member.attendance_percentage >= 90 
//                               ? 'bg-green-100 text-green-800' 
//                               : member.attendance_percentage >= 75 
//                               ? 'bg-yellow-100 text-yellow-800' 
//                               : 'bg-red-100 text-red-800'
//                           }`}>
//                             {member.attendance_percentage >= 90 ? 'Excellent' : 
//                              member.attendance_percentage >= 75 ? 'Good' : 'Poor'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
//                         {searchTerm ? `No team members found matching "${searchTerm}"` : 'No team members found'}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render admin view (all employees)
//   const renderAdminView = () => {
//     if (!attendanceData) return null;

//     const filteredEmployees = getFilteredEmployees();

//     return (
//       <div className="space-y-6">
//         {/* Admin Overview */}
//         <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-200">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//               <FontAwesomeIcon icon={faChartBar} className="mr-3 text-indigo-600" />
//               Company Attendance Overview
//             </h2>
//             <div className="flex gap-4">
//               <select
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Departments</option>
//                 {getDepartments().map(dept => (
//                   <option key={dept} value={dept}>{dept}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Total Employees</p>
//                   <p className="text-2xl font-bold text-blue-600">{attendanceData.total_employees}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faPercentage} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Overall Company Average</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {attendanceData.overall_average_attendance?.toFixed(1)}%
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faBuilding} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Departments</p>
//                   <p className="text-2xl font-bold text-blue-600">{getDepartments().length}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FontAwesomeIcon icon={faCalendarDays} className="text-blue-600 text-xl mr-3" />
//                 <div>
//                   <p className="text-sm text-gray-600">Year</p>
//                   <p className="text-2xl font-bold text-blue-600">{attendanceData.year}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Employee Table */}
//         <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
//           <div className="px-6 py-4 bg-gray-50 border-b">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {selectedDepartment === 'all'
//                   ? 'All Employees'
//                   : `${selectedDepartment} Department`} 
//                 Attendance Details
//               </h3>
              
//               {/* Search Input */}
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search employees..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <div className="text-sm text-gray-600">
//               Showing {filteredEmployees.length} of {
//                 selectedDepartment === 'all' 
//                   ? attendanceData.all_employee_stats?.length || 0
//                   : attendanceData.department_wise_stats[selectedDepartment]?.employees?.length || 0
//               } employees
//               {searchTerm && (
//                 <span className="ml-2 text-blue-600">
//                   matching "{searchTerm}"
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <div className="max-h-85 overflow-y-auto">
//               <table className="min-w-full w-full">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredEmployees.length > 0 ? (
//                     filteredEmployees.map((employee, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{employee.username}</div>
//                           <div className="text-sm text-gray-500">{employee.user_info?.email}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {employee.user_info?.department || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {employee.user_info?.position || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {employee.present_days}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {employee.attendance_percentage?.toFixed(1)}%
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {employee.leave_days_taken}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               employee.attendance_percentage >= 90
//                                 ? 'bg-green-100 text-green-800'
//                                 : employee.attendance_percentage >= 75
//                                 ? 'bg-yellow-100 text-yellow-800'
//                                 : 'bg-red-100 text-red-800'
//                             }`}
//                           >
//                             {employee.attendance_percentage >= 90
//                               ? 'Excellent'
//                               : employee.attendance_percentage >= 75
//                               ? 'Good'
//                               : 'Poor'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
//                         {searchTerm ? `No employees found matching "${searchTerm}"` : 'No employees found'}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Main render function
//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
//           <span className="ml-3 text-gray-600">Loading attendance data...</span>
//         </div>
//       );
//     }

//     if (error) {
//       return (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//       );
//     }

//     switch (userRole) {
//       case 'admin':
//         return renderAdminView();
//       case 'manager':
//         return renderManagerView();
//       case 'hr':
//         return renderAdminView(); // For now, HR sees admin view
//       case 'user':
//         return renderUserAttendance();
//       default:
//         return <div>Access denied</div>;
//     }
//   };

//   return (
//     <div className="bg-gray-50 py-8 px-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-4xl font-bold text-gray-900">
//               Attendance Dashboard
//             </h1>
//             <div className="flex items-center gap-4">
//               <select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 {getYearOptions().map(year => (
//                   <option key={year} value={year}>{year}</option>
//                 ))}
//               </select>
//               <div className="text-sm text-gray-600">
//                 Role: <span className="font-semibold capitalize">{userRole}</span>
//               </div>
//             </div>
//           </div>
//           <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
//         </div>

//         {/* Main Content */}
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default Attendance;
=======
export default Attendance;
>>>>>>> 3650a4d1c71190f0215d3fef0e081c80a4dfc274
