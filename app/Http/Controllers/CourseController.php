<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\LearningPath;

/**
 * Controller for managing courses.
 */
class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     */
    public function index()
    {
        $courses = Course::paginate(9);
        return view('courses.index', compact('courses'));
    }

    /**
     * Display the specified course.
     */
    public function show($id)
    {
        $course = Course::with(['lessons', 'assessments'])->findOrFail($id);
        return view('courses.show', compact('course'));
    }

    /**
     * Enroll the authenticated user in the specified course.
     */
    public function enroll(Request $request, Course $course)
    {
        $user = Auth::user();
        $learningPath = $user->learningPaths()->firstOrCreate([
            'title' => 'My Learning Path',
            'description' => 'Auto-generated path.'
        ]);
        $learningPath->courses()->syncWithoutDetaching([$course->id]);
        return redirect()->route('courses.show', $course)->with('success', 'Enrolled in course!');
    }
} 