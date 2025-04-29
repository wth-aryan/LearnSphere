<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Statistics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Enrolled Courses -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-indigo-100">
                            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <div class="ml-5">
                            <h3 class="text-lg font-semibold text-gray-900">Enrolled Courses</h3>
                            <div class="mt-1 flex items-baseline">
                                <p class="text-2xl font-bold text-indigo-600">{{ $courses->count() }}</p>
                                <p class="ml-2 text-sm text-gray-500">courses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Learning Paths -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-emerald-100">
                            <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                            </svg>
                        </div>
                        <div class="ml-5">
                            <h3 class="text-lg font-semibold text-gray-900">Learning Paths</h3>
                            <div class="mt-1 flex items-baseline">
                                <p class="text-2xl font-bold text-emerald-600">{{ $learningPaths->count() }}</p>
                                <p class="ml-2 text-sm text-gray-500">active paths</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Completed Lessons -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6">
                    <div class="flex items-center">
                        <div class="p-3 rounded-full bg-amber-100">
                            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                            </svg>
                        </div>
                        <div class="ml-5">
                            <h3 class="text-lg font-semibold text-gray-900">Completed Lessons</h3>
                            <div class="mt-1 flex items-baseline">
                                <p class="text-2xl font-bold text-amber-600">{{ $completedLessons ?? 0 }}</p>
                                <p class="ml-2 text-sm text-gray-500">lessons</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- My Courses Section -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">My Courses</h2>
                    <a href="{{ route('courses.index') }}" class="text-indigo-600 hover:text-indigo-900 font-medium text-sm inline-flex items-center group">
                        View All Courses
                        <svg class="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>

                @if($courses->count() > 0)
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @foreach($courses->take(3) as $course)
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-2xl group hover:shadow-lg transition-all duration-300">
                                <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                                    <img src="{{ asset('images/' . Str::slug($course->title) . '.jpg') }}" 
                                         alt="{{ $course->title }}" 
                                         class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                         onerror="this.src='{{ asset('images/default-course.jpg') }}'">
                                </div>
                                <div class="p-6">
                                    <h3 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                                        {{ $course->title }}
                                    </h3>
                                    <div class="mt-4">
                                        <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                                            <span>Progress</span>
                                            <span>{{ $course->progress ?? '0' }}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                                                 style="width: {{ $course->progress ?? '0' }}%"></div>
                                        </div>
                                    </div>
                                    <div class="mt-6">
                                        <a href="{{ route('courses.show', $course->id) }}" 
                                           class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 w-full justify-center">
                                            Continue Learning
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-12 bg-white rounded-2xl shadow-sm">
                        <div class="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg class="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">No courses enrolled</h3>
                        <p class="mt-1 text-sm text-gray-500">Start your learning journey by enrolling in a course.</p>
                        <a href="{{ route('courses.index') }}" 
                           class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                            Browse Courses
                        </a>
                    </div>
                @endif
            </div>

            <!-- My Learning Paths Section -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">My Learning Paths</h2>
                    <a href="{{ route('learning-paths.index') }}" class="text-indigo-600 hover:text-indigo-900 font-medium text-sm inline-flex items-center group">
                        View All Paths
                        <svg class="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>

                @if($learningPaths->count() > 0)
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @foreach($learningPaths->take(3) as $path)
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-2xl group hover:shadow-lg transition-all duration-300">
                                <div class="p-6">
                                    <div class="flex items-center mb-4">
                                        <div class="p-2 rounded-lg bg-emerald-100">
                                            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                            </svg>
                                        </div>
                                        <h3 class="ml-3 text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
                                            {{ $path->title }}
                                        </h3>
                                    </div>
                                    <p class="text-sm text-gray-500 line-clamp-2 mb-4">
                                        {{ $path->description }}
                                    </p>
                                    <div class="mb-4">
                                        <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                                            <span>Progress</span>
                                            <span>{{ $path->progress ?? '0' }}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
                                                 style="width: {{ $path->progress ?? '0' }}%"></div>
                                        </div>
                                    </div>
                                    <a href="{{ route('learning-paths.show', $path->id) }}" 
                                       class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 w-full justify-center">
                                        Continue Path
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-12 bg-white rounded-2xl shadow-sm">
                        <div class="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg class="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">No learning paths started</h3>
                        <p class="mt-1 text-sm text-gray-500">Choose a learning path to start your journey.</p>
                        <a href="{{ route('learning-paths.index') }}" 
                           class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300">
                            Browse Learning Paths
                        </a>
                    </div>
                @endif
            </div>

            <!-- Recent Activity -->
            <div>
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Recent Activity</h2>
                </div>
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6">
                    <div class="text-center py-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mx-auto flex items-center justify-center mb-4">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">No recent activity</h3>
                        <p class="mt-1 text-sm text-gray-500">Your recent learning activities will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
