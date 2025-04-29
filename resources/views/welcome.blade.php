<!DOCTYPE html>
<!--
/**
 * LearnSphere - A Modern Learning Platform
 * Created by: Aryan
 * Copyright © {{ date('Y') }} All rights reserved.
 * 
 * IMPORTANT: This platform was created by Aryan. This attribution must remain
 * intact and may not be removed or modified without explicit written permission.
 */
-->
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth" x-data x-bind:class="{ 'dark': localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches) }">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="LearnSphere - Created by Aryan. A personalized learning platform tailored to your career path.">
        <meta name="author" content="Aryan">
        <meta name="copyright" content="© {{ date('Y') }} Aryan. All rights reserved.">
        <meta property="og:title" content="LearnSphere - Personalized Learning Platform">
        <meta property="og:image" content="{{ asset('images/og-banner.jpg') }}">
        <title>LearnSphere by Aryan</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <!-- Add AOS Library -->
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <!-- Add particles.js -->
        <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
        <!-- Add GSAP -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
        <!-- Add Vanilla Tilt -->
        <script src="https://cdn.jsdelivr.net/npm/vanilla-tilt@1.7.2/dist/vanilla-tilt.min.js"></script>
        <style>
            /* Hide scrollbar for Chrome, Safari and Opera */
            ::-webkit-scrollbar {
                display: none;
            }

            /* Hide scrollbar for IE, Edge and Firefox */
            html {
                scroll-padding-top: 100px !important;
                scroll-behavior: smooth;
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }

            body {
                overflow-y: scroll; /* Keep scrolling functionality */
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }

            #scroll-bar {
                position: fixed;
                top: 0;
                left: 0;
                height: 4px;
                background: #9333ea;
                width: 0;
                z-index: 9999;
            }

            .track-card {
                position: relative;
                transition: transform 0.3s ease;
                cursor: pointer;
                overflow: hidden;
            }

            .track-card::before {
                content: '';
                position: absolute;
                top: -100%;
                left: -100%;
                width: 300%;
                height: 300%;
                background: radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%);
                transition: transform 0.5s ease-out;
                pointer-events: none;
                opacity: 0;
            }

            .track-card:active {
                transform: scale(0.98);
            }

            .track-card.glow::before {
                opacity: 1;
                animation: glowEffect 0.8s ease-out;
            }

            @keyframes glowEffect {
                0% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%);
                    opacity: 0;
                }
            }

            .glassmorphism {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            }

            .dark .glassmorphism {
                background: rgba(17, 24, 39, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            #particles-js {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: -1;
            }

            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
            }

            .floating {
                animation: float 6s ease-in-out infinite;
            }
        </style>
    </head>
    <body class="bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        <div id="particles-js"></div>
        <div id="scroll-bar"></div>

        <!-- Navbar -->
        <nav class="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow fixed w-full top-0 z-50">
            <h1 class="text-2xl font-bold">LearnSphere</h1>
            <div class="space-x-4">
                <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">🌙</button>
                <a href="#tracks" class="hover:underline">Tracks</a>
                <a href="#testimonials" class="hover:underline">Testimonials</a>
                <a href="{{ route('login') }}" class="hover:underline">Login</a>
                <a href="{{ route('register') }}" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Register</a>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="pt-40 px-6 text-center min-h-screen flex flex-col justify-center items-center">
            <div class="max-w-4xl mx-auto glassmorphism p-8 rounded-2xl" data-aos="fade-up">
                <h2 class="text-4xl md:text-6xl font-bold mb-6">Your Personalized Learning Path</h2>
                <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">LearnSphere guides you through tailored learning experiences based on your goals, skills, and interests.</p>
                <a href="{{ route('register') }}" class="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl">
                    Get Started
                </a>
            </div>
            <div class="mt-12 floating" data-aos="fade-up" data-aos-delay="200">
                <img src="{{ asset('images/hero-illustration.svg') }}" alt="Learning Illustration" class="w-96 mx-auto" loading="lazy">
            </div>
        </section>

        <!-- Tracks Section -->
        <div id="tracks" style="position: relative; top: -100px; height: 0;"></div>
        <section class="py-20 px-6">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold text-center mb-12" data-aos="fade-up">Explore Learning Tracks</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="track-card glassmorphism p-8 rounded-xl" data-aos="fade-up" data-aos-delay="100">
                        <h3 class="text-xl font-bold mb-4">Full-Stack Web Dev</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Master modern web development with HTML, CSS, JavaScript, Laravel, and React.</p>
                        <div class="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                            <div class="bg-purple-600 h-2 rounded-full" style="width: 75%"></div>
                        </div>
                    </div>
                    <div class="track-card glassmorphism p-8 rounded-xl" data-aos="fade-up" data-aos-delay="200">
                        <h3 class="text-xl font-bold mb-4">Data Science</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Learn Python, Pandas, Machine Learning, and SQL for data analysis.</p>
                        <div class="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                            <div class="bg-purple-600 h-2 rounded-full" style="width: 60%"></div>
                        </div>
                    </div>
                    <div class="track-card glassmorphism p-8 rounded-xl" data-aos="fade-up" data-aos-delay="300">
                        <h3 class="text-xl font-bold mb-4">Cybersecurity</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Master network security, ethical hacking, and essential security tools.</p>
                        <div class="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                            <div class="bg-purple-600 h-2 rounded-full" style="width: 45%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section id="testimonials" class="py-20 px-6">
            <div class="max-w-6xl mx-auto">
                <h2 class="text-3xl font-bold text-center mb-12" data-aos="fade-up">Student Stories</h2>
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="glassmorphism p-8 rounded-xl" data-aos="fade-up" data-aos-delay="100">
                        <p class="text-gray-600 dark:text-gray-300 mb-6">"LearnSphere guided me from beginner to pro. The learning path structure is amazing!"</p>
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                <span class="text-purple-600 dark:text-purple-300 font-semibold">S</span>
                            </div>
                            <div>
                                <p class="font-semibold">Sarah Johnson</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Data Science Track</p>
                            </div>
                        </div>
                    </div>
                    <div class="glassmorphism p-8 rounded-xl" data-aos="fade-up" data-aos-delay="200">
                        <p class="text-gray-600 dark:text-gray-300 mb-6">"Interactive content and progress tracking made learning fun and consistent."</p>
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                <span class="text-purple-600 dark:text-purple-300 font-semibold">A</span>
                            </div>
                            <div>
                                <p class="font-semibold">Arjun Patel</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Web Dev Track</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA Section -->
        <section class="py-20 px-6 bg-purple-600 text-white">
            <div class="max-w-4xl mx-auto text-center glassmorphism p-8 rounded-xl" data-aos="fade-up">
                <h2 class="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
                <p class="text-lg text-purple-100 mb-8">Join thousands of learners building their futures with LearnSphere.</p>
                <a href="{{ route('register') }}" class="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl inline-block">
                    Sign Up Now
                </a>
            </div>
        </section>

        <!-- Scroll to Top Button -->
        <button id="scroll-top" class="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all opacity-0 invisible">
            ↑
        </button>

        <!-- Initialize AOS -->
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Initialize particles.js
                particlesJS.load('particles-js', '/particles.json', function() {
                    console.log('particles.js loaded');
                });

                // Initialize Vanilla Tilt
                VanillaTilt.init(document.querySelectorAll(".track-card"), {
                    max: 15,
                    speed: 400,
                    glare: true,
                    "max-glare": 0.2,
                });

                // GSAP Animations
                gsap.from(".track-card", {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.2
                });

                // Track card click animation
                const trackCards = document.querySelectorAll('.track-card');
                
                trackCards.forEach(card => {
                    card.addEventListener('click', function(e) {
                        // Remove glow class from all cards
                        trackCards.forEach(c => c.classList.remove('glow'));
                        
                        // Add glow class to clicked card
                        this.classList.add('glow');
                        
                        // Create ripple effect
                        const rect = this.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        this.style.setProperty('--x', x + 'px');
                        this.style.setProperty('--y', y + 'px');
                        
                        // Remove glow class after animation
                        setTimeout(() => {
                            this.classList.remove('glow');
                        }, 800);
                    });
                });

                // Initialize AOS
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true
                });

                // Scroll Progress Bar
                window.onscroll = () => {
                    const scrollBar = document.getElementById("scroll-bar");
                    const scrollTop = document.getElementById("scroll-top");
                    const height = document.documentElement.scrollHeight - window.innerHeight;
                    const scrolled = (window.scrollY / height) * 100;
                    scrollBar.style.width = `${scrolled}%`;

                    // Show/hide scroll to top button
                    if (window.scrollY > 500) {
                        scrollTop.classList.remove('opacity-0', 'invisible');
                        scrollTop.classList.add('opacity-100', 'visible');
                    } else {
                        scrollTop.classList.add('opacity-0', 'invisible');
                        scrollTop.classList.remove('opacity-100', 'visible');
                    }
                };

                // Scroll to Top
                document.getElementById('scroll-top').addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });

                // Dark Mode Toggle
                const toggleBtn = document.getElementById('theme-toggle');
                const html = document.documentElement;

                function updateTheme(isDark) {
                    if (isDark) {
                        html.classList.add('dark');
                        toggleBtn.textContent = '☀️';
                        localStorage.setItem('theme', 'dark');
                    } else {
                        html.classList.remove('dark');
                        toggleBtn.textContent = '🌙';
                        localStorage.setItem('theme', 'light');
                    }
                }

                toggleBtn.addEventListener('click', () => {
                    const isDark = !html.classList.contains('dark');
                    updateTheme(isDark);
                });

                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
                prefersDark.addEventListener('change', (e) => {
                    if (!localStorage.getItem('theme')) {
                        updateTheme(e.matches);
                    }
                });

                // Initial theme setup
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    updateTheme(savedTheme === 'dark');
                } else {
                    updateTheme(prefersDark.matches);
                }
            });
        </script>

        <!-- Update the footer section -->
        <footer class="bg-gray-900 text-gray-300 py-8">
            <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div class="mb-4 md:mb-0">
                    <span class="font-bold text-white">LearnSphere</span> &copy; {{ date('Y') }}
                    <span class="ml-2">Created by <span class="text-purple-400 font-semibold">Aryan</span></span>
                </div>
                <div class="space-x-4">
                    <a href="{{ route('login') }}" class="hover:text-white">Login</a>
                    <a href="{{ route('register') }}" class="hover:text-white">Register</a>
                    <a href="#" class="hover:text-white">Contact</a>
                </div>
            </div>
        </footer>
    </body>
</html> 