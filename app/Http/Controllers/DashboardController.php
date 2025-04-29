<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\LearningPath;
use App\Models\Progress;
use App\Models\Assessment;
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get courses with their lessons and progress
        $courses = $user->courses()
            ->with(['lessons.progress' => function($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->get()
            ->map(function ($course) {
                $totalLessons = $course->lessons->count();
                $completedLessons = $course->lessons->filter(function($lesson) {
                    return $lesson->progress->isNotEmpty();
                })->count();
                
                return (object)[
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'image_url' => $course->image_url,
                    'category' => $course->category,
                    'difficulty_level' => $course->difficulty_level,
                    'duration_minutes' => $course->duration_minutes,
                    'total_lessons' => $totalLessons,
                    'progress' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0
                ];
            }) ?? new Collection();

        // Get learning paths with their courses and lessons
        $learningPaths = $user->learningPaths()
            ->with(['courses.lessons.progress' => function($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->get()
            ->map(function ($path) {
                $totalLessons = $path->courses->sum(function($course) {
                    return $course->lessons->count();
                });
                
                $completedLessons = $path->courses->sum(function($course) {
                    return $course->lessons->filter(function($lesson) {
                        return $lesson->progress->isNotEmpty();
                    })->count();
                });
                
                return (object)[
                    'id' => $path->id,
                    'title' => $path->title,
                    'description' => $path->description,
                    'total_courses' => $path->courses->count(),
                    'total_lessons' => $totalLessons,
                    'progress' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0
                ];
            }) ?? new Collection();

        // Get assessments
        $assessments = Assessment::whereHas('course', function ($query) use ($user) {
                $query->whereHas('users', function ($q) use ($user) {
                    $q->where('users.id', $user->id);
                });
            })
            ->orWhereHas('learningPath', function ($query) use ($user) {
                $query->whereHas('users', function ($q) use ($user) {
                    $q->where('users.id', $user->id);
                });
            })
            ->with(['userResults' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->get()
            ->map(function ($assessment) {
                $result = $assessment->userResults->first();
                return (object)[
                    'id' => $assessment->id,
                    'title' => $assessment->title,
                    'description' => $assessment->description,
                    'total_marks' => $assessment->total_marks,
                    'passing_marks' => $assessment->passing_marks,
                    'score' => $result ? $result->score : null,
                    'status' => $result ? $result->status : 'not_started'
                ];
            }) ?? new Collection();

        return view('dashboard', compact('courses', 'learningPaths', 'assessments'));
    }
} 