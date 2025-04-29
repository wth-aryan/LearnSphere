@extends('layouts.app')

@section('content')
<div class="bg-white p-6 rounded shadow max-w-lg mx-auto">
    <h2 class="text-xl font-bold mb-4">Edit Learning Path</h2>
    <form action="{{ route('learning-paths.update', $learningPath->id) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-4">
            <label class="block font-semibold mb-1">Title</label>
            <input type="text" name="title" class="w-full border rounded p-2" value="{{ $learningPath->title }}" required>
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-1">Description</label>
            <textarea name="description" class="w-full border rounded p-2">{{ $learningPath->description }}</textarea>
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-1">Courses</label>
            <select name="courses[]" multiple class="w-full border rounded p-2">
                @foreach($courses as $course)
                    <option value="{{ $course->id }}" @if($learningPath->courses->contains($course->id)) selected @endif>{{ $course->title }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
    </form>
</div>
@endsection 