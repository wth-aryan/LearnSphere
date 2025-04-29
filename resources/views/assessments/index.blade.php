<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Assessments') }}
            </h2>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        @forelse($assessments as $assessment)
                            <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                                <div class="p-6">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center space-x-3">
                                            <div class="flex-shrink-0">
                                                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                                    <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div>
                                                <h3 class="text-lg font-medium text-gray-900">{{ $assessment->title }}</h3>
                                                @if($assessment->time_limit)
                                                    <p class="text-sm text-gray-500">Time Limit: {{ $assessment->time_limit }} minutes</p>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p class="text-gray-600 text-sm mb-4">{{ $assessment->description }}</p>
                                    
                                    @php
                                        $submission = $assessment->submissions()->where('user_id', auth()->id())->latest()->first();
                                    @endphp
                                    
                                    @if($submission)
                                        <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                            <div class="flex items-center space-x-2">
                                                <svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <div>
                                                    <div class="text-sm font-medium text-green-800">Last Attempt</div>
                                                    <div class="text-sm text-green-700">Score: {{ $submission->score }}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    @endif
                                    
                                    <div class="mt-4">
                                        <a href="{{ route('assessments.show', $assessment) }}" 
                                           class="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            {{ $submission ? 'Retake Assessment' : 'Start Assessment' }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                                <h3 class="mt-4 text-lg font-medium text-gray-900">No assessments available</h3>
                                <p class="mt-1 text-gray-500">Check back later for new assessments.</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>