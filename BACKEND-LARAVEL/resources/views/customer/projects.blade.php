@extends('layouts.dashboard')

@section('page-title', 'My Projects')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">My Projects</h1>
            <p class="text-gray-600">Track your home improvement projects and service requests</p>
        </div>
        <a href="{{ route('customer.projects.create') }}"
           class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            New Project
        </a>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-500">Total Projects</div>
                    <div class="text-2xl font-bold text-gray-900">8</div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-500">Active Projects</div>
                    <div class="text-2xl font-bold text-gray-900">3</div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-500">Completed</div>
                    <div class="text-2xl font-bold text-gray-900">5</div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-500">Total Spent</div>
                    <div class="text-2xl font-bold text-gray-900">$32K</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Active Projects -->
    <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Active Projects</h3>
        </div>
        <div class="p-6 space-y-6">
            <!-- Project 1 -->
            <div class="border border-gray-200 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">Kitchen Renovation</h4>
                        <p class="text-gray-600">Complete kitchen remodel with new cabinets and appliances</p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        In Progress
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <span class="text-sm font-medium text-gray-500">Contractor:</span>
                        <div class="text-sm text-gray-900">Johnson Construction</div>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-gray-500">Budget:</span>
                        <div class="text-sm text-gray-900">$18,500</div>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-gray-500">Timeline:</span>
                        <div class="text-sm text-gray-900">6 weeks</div>
                    </div>
                </div>

                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>65%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: 65%"></div>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        View Details
                    </button>
                    <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
                        Message Contractor
                    </button>
                </div>
            </div>

            <!-- Project 2 -->
            <div class="border border-gray-200 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">Bathroom Plumbing Repair</h4>
                        <p class="text-gray-600">Fix leaking shower and replace fixtures</p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Pending Bids
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <span class="text-sm font-medium text-gray-500">Bids Received:</span>
                        <div class="text-sm text-gray-900">4 contractors</div>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-gray-500">Budget Range:</span>
                        <div class="text-sm text-gray-900">$2,800 - $4,200</div>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-gray-500">Posted:</span>
                        <div class="text-sm text-gray-900">3 days ago</div>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Review Bids
                    </button>
                    <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
                        Edit Project
                    </button>
                </div>
            </div>

            <!-- Project 3 -->
            <div class="border border-gray-200 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">HVAC Maintenance</h4>
                        <p class="text-gray-600">Annual HVAC system inspection and tune-up</p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Scheduled
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <span class="text-sm font-medium text-gray-500">Contractor:</span>
                        <div class="text-sm text-gray-900">CoolAir HVAC Services</div>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-gray-500">Cost:</span>
                        <div class="text-sm text-gray-900">$180</div>
                    </div>
                    <div>
                        <span class="text-sm font-medium text-gray-500">Scheduled:</span>
                        <div class="text-sm text-gray-900">March 28, 2024</div>
                    </div>
                </div>

                <div class="flex space-x-3">
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        View Details
                    </button>
                    <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">
                        Reschedule
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Completed Projects -->
    <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Recently Completed</h3>
        </div>
        <div class="p-6">
            <div class="space-y-4">
                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 class="font-medium text-gray-900">Roof Inspection & Repair</h4>
                        <p class="text-sm text-gray-600">Completed by ABC Roofing • $850</p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Completed Feb 15, 2024</div>
                        <button class="text-blue-600 hover:text-blue-700 text-sm">Leave Review</button>
                    </div>
                </div>

                <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h4 class="font-medium text-gray-900">Electrical Panel Upgrade</h4>
                        <p class="text-sm text-gray-600">Completed by PowerUp Electric • $2,400</p>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-500">Completed Jan 22, 2024</div>
                        <span class="text-green-600 text-sm">★★★★★ Reviewed</span>
                    </div>
                </div>
            </div>

            <div class="mt-6 text-center">
                <a href="{{ route('customer.projects.history') }}" class="text-blue-600 hover:text-blue-700">
                    View all completed projects →
                </a>
            </div>
        </div>
    </div>
</div>
@endsection