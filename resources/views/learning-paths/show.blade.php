<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $learningPath->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <p class="mb-6 text-gray-600">{{ $learningPath->description }}</p>
                    
                    <h3 class="font-semibold text-lg mb-4">Courses in this Path</h3>
                    @php
                        $total = $learningPath->courses->count();
                        $completed = $learningPath->courses->filter(fn($c) => $c->lessons->every(fn($l) => $l->progress->where('user_id', auth()->id())->whereNotNull('completed_at')->count()))->count();
                        $percent = $total ? intval(($completed/$total)*100) : 0;
                    @endphp

                    <div class="mb-6">
                        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div class="bg-green-600 h-2.5 rounded-full transition-all duration-300" style="width: {{ $percent }}%"></div>
                        </div>
                        <span class="text-sm text-gray-500">{{ $percent }}% complete</span>
                    </div>

                    <div class="space-y-4">
                        @foreach($learningPath->courses as $course)
                            @php
                                $done = $course->lessons->every(fn($l) => $l->progress->where('user_id', auth()->id())->whereNotNull('completed_at')->count());
                            @endphp
                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="flex-shrink-0">
                                        @if($done)
                                            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </span>
                                        @else
                                            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                            </span>
                                        @endif
                                    </div>
                                    <div>
                                        <h4 class="text-lg font-medium text-gray-900">{{ $course->title }}</h4>
                                        @if($done)
                                            <span class="text-sm text-green-600">Completed</span>
                                        @else
                                            <span class="text-sm text-gray-500">In Progress</span>
                                        @endif
                                    </div>
                                </div>
                                <a href="{{ route('courses.show', $course) }}" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                    View Course
                                </a>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>