<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LearningPath;
use App\Models\Course;

class LearningPathController extends Controller
{
    public function index()
    {
        $learningPaths = Auth::user()->learningPaths;
        return view('learning-paths.index', compact('learningPaths'));
    }

    public function show($id)
    {
        $learningPath = LearningPath::with('courses')->findOrFail($id);
        return view('learning-paths.show', compact('learningPath'));
    }

    public function create()
    {
        $courses = Course::all();
        return view('learning-paths.create', compact('courses'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'courses' => 'array',
        ]);
        $learningPath = Auth::user()->learningPaths()->create($data);
        if (!empty($data['courses'])) {
            $learningPath->courses()->sync($data['courses']);
        }
        return redirect()->route('learning-paths.index')->with('success', 'Learning path created!');
    }

    public function edit($id)
    {
        $learningPath = LearningPath::findOrFail($id);
        $courses = Course::all();
        return view('learning-paths.edit', compact('learningPath', 'courses'));
    }

    public function update(Request $request, $id)
    {
        $learningPath = LearningPath::findOrFail($id);
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'courses' => 'array',
        ]);
        $learningPath->update($data);
        if (!empty($data['courses'])) {
            $learningPath->courses()->sync($data['courses']);
        }
        return redirect()->route('learning-paths.index')->with('success', 'Learning path updated!');
    }

    public function destroy($id)
    {
        $learningPath = LearningPath::findOrFail($id);
        $learningPath->delete();
        return redirect()->route('learning-paths.index')->with('success', 'Learning path deleted!');
    }
} 