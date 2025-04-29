@extends('layouts.app')

@section('content')
<div class="bg-white text-gray-900 font-sans">
    {{-- Hero Section --}}
    <section class="min-h-screen flex items-center justify-center flex-col text-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-6 relative overflow-hidden">
        {{-- Optional: Add a hero SVG or illustration here --}}
        <div class="absolute inset-0 pointer-events-none opacity-60">
            <!-- Example SVG background or illustration can go here -->
            <svg width="100%" height="100%" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="500" cy="100" r="80" fill="#a5b4fc" />
                <circle cx="100" cy="300" r="120" fill="#c4b5fd" />
            </svg>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold mb-4 z-10">Welcome to LearnSphere</h1>
        <p class="text-lg md:text-xl mb-8 max-w-2xl z-10">Your personalized learning path platform designed to help you grow your skills efficiently and confidently.</p>
        <div class="flex space-x-4 z-10">
            <a href="{{ route('login') }}" class="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition">Login</a>
            <a href="{{ route('register') }}" class="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition">Register</a>
        </div>
    </section>

    {{-- About Section --}}
    <section class="py-20 px-6 text-center bg-gray-50">
        <h2 class="text-3xl font-bold text-indigo-700 mb-6">Why Choose LearnSphere?</h2>
        <p class="max-w-3xl mx-auto text-gray-700">LearnSphere adapts to your goals and interests by providing structured learning paths, practical assignments, and insightful progress tracking. Whether you're a beginner or a pro, we guide your journey with precision.</p>
    </section>

    {{-- Features Section --}}
    <section class="py-20 px-6 bg-white">
        <h2 class="text-3xl font-bold text-center text-indigo-700 mb-12">Platform Features</h2>
        <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-indigo-50 p-6 rounded-lg shadow text-center">
                <h3 class="text-xl font-semibold mb-2">Learning Paths</h3>
                <p class="text-sm text-gray-600">Follow curated journeys in Web Dev, Data Science, and more.</p>
            </div>
            <div class="bg-indigo-50 p-6 rounded-lg shadow text-center">
                <h3 class="text-xl font-semibold mb-2">Expert Courses</h3>
                <p class="text-sm text-gray-600">Get access to real-world projects and pro-level guidance.</p>
            </div>
            <div class="bg-indigo-50 p-6 rounded-lg shadow text-center">
                <h3 class="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p class="text-sm text-gray-600">Monitor your growth with visual dashboards and stats.</p>
            </div>
            <div class="bg-indigo-50 p-6 rounded-lg shadow text-center">
                <h3 class="text-xl font-semibold mb-2">Community Support</h3>
                <p class="text-sm text-gray-600">Join our learner community and never study alone again.</p>
            </div>
        </div>
    </section>

    {{-- Testimonials Section --}}
    <section class="py-20 px-6 bg-gray-50">
        <h2 class="text-3xl font-bold text-center text-indigo-700 mb-12">What Our Learners Say</h2>
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-lg shadow text-center flex flex-col items-center">
                <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <span class="text-2xl font-bold text-indigo-700">A</span>
                </div>
                <p class="text-gray-700 mb-4">“LearnSphere made it easy for me to switch careers into web development. The learning paths and community support are amazing!”</p>
                <span class="font-semibold text-indigo-700">Ananya S.</span>
            </div>
            <div class="bg-white p-8 rounded-lg shadow text-center flex flex-col items-center">
                <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <span class="text-2xl font-bold text-indigo-700">R</span>
                </div>
                <p class="text-gray-700 mb-4">“The progress tracking dashboard keeps me motivated. I love the real-world projects and expert guidance.”</p>
                <span class="font-semibold text-indigo-700">Rahul M.</span>
            </div>
            <div class="bg-white p-8 rounded-lg shadow text-center flex flex-col items-center">
                <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <span class="text-2xl font-bold text-indigo-700">S</span>
                </div>
                <p class="text-gray-700 mb-4">“I never thought online learning could be this engaging. The community is always there to help!”</p>
                <span class="font-semibold text-indigo-700">Sneha T.</span>
            </div>
        </div>
    </section>

    {{-- Call to Action --}}
    <section class="py-20 px-6 text-center bg-indigo-600 text-white">
        <h2 class="text-3xl font-bold mb-4">Start Your Learning Journey Today</h2>
        <p class="mb-6">Join thousands of learners leveling up their careers with LearnSphere.</p>
        <a href="{{ route('register') }}" class="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-100 transition">Get Started</a>
    </section>

    {{-- Optional: Testimonials or animation sections can be added here --}}
</div>
@endsection 