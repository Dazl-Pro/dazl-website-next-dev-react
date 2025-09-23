@extends('layouts.app')

@section('content')
<div class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div class="absolute inset-0 bg-black opacity-20"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">
                DAZL Pro
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-blue-100">
                The Complete Real Estate & Home Services Marketplace
            </p>
            <p class="text-lg mb-12 text-blue-100 max-w-3xl mx-auto">
                Connect Real Estate Agents, Service Professionals, and Homeowners through comprehensive Property Home Diagnostic (PHD) reports and project bidding.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="{{ route('register', ['type' => 'realtor']) }}" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
                    Join as Real Estate Agent
                </a>
                <a href="{{ route('register', ['type' => 'professional']) }}" class="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 transition border-2 border-blue-300">
                    Join as Service Professional
                </a>
                <a href="{{ route('register', ['type' => 'customer']) }}" class="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition border-2 border-white">
                    Join as Homeowner
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Features Section -->
<div class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">How DAZL Pro Works</h2>
            <p class="text-xl text-gray-600">Three user types, one powerful platform</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <!-- Real Estate Agents -->
            <div class="text-center">
                <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Real Estate Agents</h3>
                <p class="text-gray-600">Create comprehensive Property Home Diagnostic (PHD) reports, manage client projects, and connect homeowners with qualified service professionals.</p>
            </div>

            <!-- Service Professionals -->
            <div class="text-center">
                <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Service Professionals</h3>
                <p class="text-gray-600">Browse project opportunities, submit competitive bids, and grow your business by connecting with homeowners who need your services.</p>
            </div>

            <!-- Homeowners -->
            <div class="text-center">
                <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Homeowners</h3>
                <p class="text-gray-600">Receive detailed property diagnostic reports, review professional bids, and choose the best service providers for your home improvement projects.</p>
            </div>
        </div>
    </div>
</div>

<!-- Stats Section -->
<div class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
            <div class="text-center">
                <div class="text-4xl font-bold text-blue-600 mb-2">1,600+</div>
                <div class="text-gray-600">PHD Reports Generated</div>
            </div>
            <div class="text-center">
                <div class="text-4xl font-bold text-green-600 mb-2">184</div>
                <div class="text-gray-600">Real Estate Agents</div>
            </div>
            <div class="text-center">
                <div class="text-4xl font-bold text-purple-600 mb-2">174</div>
                <div class="text-gray-600">Service Professionals</div>
            </div>
            <div class="text-center">
                <div class="text-4xl font-bold text-orange-600 mb-2">800+</div>
                <div class="text-gray-600">Happy Homeowners</div>
            </div>
        </div>
    </div>
</div>

<!-- CTA Section -->
<div class="py-16 bg-blue-600">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-xl text-blue-100 mb-8">Join thousands of professionals already using DAZL Pro</p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="{{ route('register') }}" class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
                Sign Up Now
            </a>
            <a href="{{ route('login') }}" class="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition border-2 border-white">
                Login to Your Account
            </a>
        </div>
    </div>
</div>
@endsection