'use client';

import { useState, useEffect } from 'react';

type Employee = {
  id: number;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  designation: string;
  branch: string;
};

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees');
    if (res.ok) {
      const data = await res.json();
      setEmployees(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing ? `/api/employees/${editingId}` : '/api/employees';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({});
      setEditingId(null);
      fetchEmployees();
    } else {
      alert('Error saving employee');
    }
  };

  const handleEdit = (emp: Employee) => {
    setFormData(emp);
    setEditingId(emp.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchEmployees();
    }
  };

  const inputClass = "border border-gray-300 p-2.5 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Employee Management System</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your team members and their information.</p>
        </header>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
            {editingId ? 'Edit Employee Details' : 'Add New Employee'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="e.g. Jane"
                required
                className={inputClass}
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Last Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Doe"
                className={inputClass}
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="e.g. +1 555-0123"
                className={inputClass}
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Designation</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                required
                className={inputClass}
                value={formData.designation || ''}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Branch / Location</label>
              <input
                type="text"
                placeholder="e.g. New York"
                required
                className={inputClass}
                value={formData.branch || ''}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({});
                  }}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                {editingId ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>

        {/* Directory Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Employee Directory</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="p-4 uppercase tracking-wider text-xs">Name</th>
                  <th className="p-4 uppercase tracking-wider text-xs">Phone Number</th>
                  <th className="p-4 uppercase tracking-wider text-xs">Designation</th>
                  <th className="p-4 uppercase tracking-wider text-xs">Branch</th>
                  <th className="p-4 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">
                      {emp.firstName} {emp.lastName || ''}
                    </td>
                    <td className="p-4 text-gray-600">{emp.phoneNumber}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {emp.designation}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {emp.branch}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 bg-gray-50/50">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <p>No employees found. Add one above.</p>
                      </div>
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
}
