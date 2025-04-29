<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ $assessment->title }}
            </h2>
            <a href="{{ route('assessments.index') }}" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Assessments
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <div class="mb-8">
                        <p class="text-gray-600">{{ $assessment->description }}</p>
                        @if($assessment->time_limit)
                            <div class="mt-4 flex items-center text-sm text-gray-500">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Time Limit: {{ $assessment->time_limit }} minutes
                            </div>
                        @endif
                    </div>

                    @php
                        $submission = $assessment->submissions()->where('user_id', auth()->id())->latest()->first();
                    @endphp

                    @if($submission)
                        <div class="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 class="text-lg font-medium text-green-800 mb-2">Previous Submission</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <div class="text-sm text-green-600">Score</div>
                                    <div class="text-2xl font-bold text-green-800">{{ $submission->score }}%</div>
                                </div>
                                <div>
                                    <div class="text-sm text-green-600">Submitted</div>
                                    <div class="text-gray-900">{{ $submission->submitted_at->diffForHumans() }}</div>
                                </div>
                            </div>
                        </div>
                    @endif

                    <form action="{{ route('assessments.submit', $assessment->id) }}" method="POST" class="space-y-6">
                        @csrf
                        @foreach($assessment->questions as $index => $question)
                            <div class="bg-gray-50 rounded-lg p-6">
                                <div class="mb-4">
                                    <h4 class="text-lg font-medium text-gray-900">Question {{ $index + 1 }}</h4>
                                    <p class="mt-1 text-gray-600">{{ $question->content }}</p>
                                </div>
                                
                                @if($question->type === 'multiple_choice')
                                    <div class="space-y-3">
                                        @foreach($question->options as $option)
                                            <label class="flex items-center space-x-3">
                                                <input type="radio" 
                                                       name="answers[{{ $question->id }}]" 
                                                       value="{{ $option->id }}"
                                                       class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                                                <span class="text-gray-700">{{ $option->content }}</span>
                                            </label>
                                        @endforeach
                                    </div>
                                @else
                                    <textarea name="answers[{{ $question->id }}]" 
                                              rows="4" 
                                              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                              placeholder="Enter your answer here..."></textarea>
                                @endif
                            </div>
                        @endforeach

                        <div class="flex items-center justify-end space-x-4">
                            <button type="submit" 
                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Submit Assessment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>