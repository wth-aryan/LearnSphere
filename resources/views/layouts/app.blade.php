<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <style>
            /* Custom Styles */
            body {
                font-family: 'Inter', sans-serif;
            }

            /* Dashboard Cards */
            .dashboard-card {
                background: #ffffff;
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                text-align: center;
                width: 100%;
                max-width: 300px;
                margin: 10px auto;
            }

            .dashboard-card:hover {
                transform: scale(1.02);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            }

            .card-icon {
                font-size: 40px;
                margin-bottom: 10px;
                color: #6c63ff;
            }

            .card-title {
                font-weight: 600;
                font-size: 18px;
                color: #333;
                margin-bottom: 5px;
            }

            .card-number {
                font-size: 24px;
                font-weight: bold;
                color: #6c63ff;
            }

            /* Gradient Backgrounds */
            .gradient-bg {
                background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
            }

            /* Card Hover Effects */
            .hover-scale {
                transition: all 0.3s ease;
            }
            .hover-scale:hover {
                transform: translateY(-2px) scale(1.01);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            /* Button Animations */
            .btn-animate {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            .btn-animate:hover {
                transform: translateY(-1px);
            }
            .btn-animate::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 120%;
                height: 120%;
                background: rgba(255, 255, 255, 0.2);
                transform: translate(-50%, -50%) scale(0);
                border-radius: 50%;
                transition: transform 0.5s ease;
            }
            .btn-animate:active::after {
                transform: translate(-50%, -50%) scale(1);
            }

            /* Progress Bar Animation */
            .progress-bar {
                position: relative;
                overflow: hidden;
            }
            .progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 30px;
                background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
                animation: shimmer 2s infinite;
            }
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .responsive-grid {
                    grid-template-columns: 1fr !important;
                }
                .responsive-padding {
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                }
            }

            /* Custom Scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #f1f5f9;
            }
            ::-webkit-scrollbar-thumb {
                background: #94a3b8;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #64748b;
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen gradient-bg">
            @include('layouts.navigation')

            <!-- Page Heading -->
            @if (isset($header))
                <header class="bg-white shadow-sm mt-16 backdrop-blur-sm bg-white/80">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif

            <!-- Page Content -->
            <main class="pt-16">
                {{ $slot }}
            </main>
        </div>
    </body>
</html>
