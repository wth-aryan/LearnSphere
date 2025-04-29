<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ $course->title }}
            </h2>
            <a href="{{ route('courses.index') }}" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Courses
            </a>
        </div>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Course Hero Section -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="md:col-span-2">
                            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ $course->title }}</h1>
                            <p class="text-gray-600 mb-6">{{ $course->description }}</p>
                            <div class="grid grid-cols-3 gap-4 mb-6">
                                <div class="text-center p-4 bg-gray-50 rounded-lg">
                                    <span class="block text-sm text-gray-500">Duration</span>
                                    <span class="block text-lg font-semibold">{{ $course->duration ?? '4 weeks' }}</span>
                                </div>
                                <div class="text-center p-4 bg-gray-50 rounded-lg">
                                    <span class="block text-sm text-gray-500">Difficulty</span>
                                    <span class="block text-lg font-semibold">{{ $course->difficulty ?? 'Intermediate' }}</span>
                                </div>
                                <div class="text-center p-4 bg-gray-50 rounded-lg">
                                    <span class="block text-sm text-gray-500">Category</span>
                                    <span class="block text-lg font-semibold">{{ $course->category ?? 'Development' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="md:col-span-1">
                            @php
                                $total = $course->lessons->count();
                                $completed = $course->lessons->filter(fn($l) => $l->progress->where('user_id', auth()->id())->whereNotNull('completed_at')->count())->count();
                                $percent = $total ? intval(($completed/$total)*100) : 0;
                            @endphp
                            <div class="bg-white p-6 rounded-lg border border-gray-200">
                                <div class="text-center mb-4">
                                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-3">
                                        <span class="text-2xl font-bold text-blue-600">{{ $percent }}%</span>
                                    </div>
                                    <h3 class="text-lg font-semibold">Course Progress</h3>
                                    <p class="text-sm text-gray-500">{{ $completed }} of {{ $total }} lessons completed</p>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3">
                                    <div class="bg-blue-600 h-3 rounded-full transition-all duration-500" style="width: {{ $percent }}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lessons Section -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-4">Course Lessons</h3>
                    <div class="space-y-3">
                        @foreach($course->lessons as $index => $lesson)
                            @php
                                $done = $lesson->progress->where('user_id', auth()->id())->whereNotNull('completed_at')->count();
                            @endphp
                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full {{ $done ? 'bg-green-100' : 'bg-gray-200' }}">
                                        <span class="text-sm font-medium {{ $done ? 'text-green-600' : 'text-gray-600' }}">{{ $index + 1 }}</span>
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-medium text-gray-900">{{ $lesson->title }}</h4>
                                        @if($lesson->duration)
                                            <p class="text-sm text-gray-500">Duration: {{ $lesson->duration }}</p>
                                        @endif
                                    </div>
                                </div>
                                @if($done)
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <svg class="mr-1.5 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Completed
                                    </span>
                                @else
                                    <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Start Lesson
                                    </button>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- Course Assessments Section -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold">Course Assessments</h3>
                        <span class="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">{{ count($course->assessments) }} Quizzes</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        @forelse($course->assessments as $assessment)
                            @php
                                $latestSubmission = $assessment->submissions()
                                    ->where('user_id', auth()->id())
                                    ->latest()
                                    ->first();
                                $isCompleted = $latestSubmission && $latestSubmission->score >= $assessment->passing_score;
                            @endphp
                            <div class="border border-gray-200 rounded-lg overflow-hidden">
                                <div class="p-6">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center space-x-3">
                                            <div class="flex-shrink-0">
                                                <span class="flex h-10 w-10 items-center justify-center rounded-full {{ $isCompleted ? 'bg-green-100' : 'bg-blue-100' }}">
                                                    @if($isCompleted)
                                                        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    @else
                                                        <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                                        </svg>
                                                    @endif
                                                </span>
                                            </div>
                                            <div>
                                                <h4 class="text-lg font-medium text-gray-900">{{ $assessment->title }}</h4>
                                                <p class="text-sm text-gray-500">
                                                    {{ $assessment->questions_count ?? 0 }} questions • 
                                                    {{ $assessment->time_limit }} minutes
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p class="text-gray-600 text-sm mb-4">{{ $assessment->description }}</p>

                                    @if($latestSubmission)
                                        <div class="mb-4 p-3 {{ $isCompleted ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200' }} border rounded-md">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <div class="text-sm font-medium {{ $isCompleted ? 'text-green-800' : 'text-yellow-800' }}">
                                                        Last Attempt
                                                    </div>
                                                    <div class="text-sm {{ $isCompleted ? 'text-green-700' : 'text-yellow-700' }}">
                                                        Score: {{ $latestSubmission->score }}%
                                                    </div>
                                                </div>
                                                <div class="text-sm text-gray-500">
                                                    {{ $latestSubmission->created_at->diffForHumans() }}
                                                </div>
                                            </div>
                                        </div>
                                    @endif

                                    <div class="flex items-center justify-between">
                                        <div class="text-sm text-gray-500">
                                            Passing Score: {{ $assessment->passing_score }}%
                                        </div>
                                        <a href="{{ route('assessments.show', $assessment) }}" 
                                           class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white {{ $isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700' }} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            {{ $isCompleted ? 'Review Quiz' : ($latestSubmission ? 'Retake Quiz' : 'Start Quiz') }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                                <h3 class="mt-4 text-lg font-medium text-gray-900">No assessments available</h3>
                                <p class="mt-1 text-gray-500">Check back later for course quizzes.</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout> 