<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LearningPathController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Courses
    Route::resource('courses', CourseController::class);
    Route::post('courses/{course}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
    Route::get('courses/{course}/complete', [CourseController::class, 'complete'])->name('courses.complete');

    // Learning Paths
    Route::resource('learning-paths', LearningPathController::class);
    Route::get('learning-paths/{learningPath}/enroll', [LearningPathController::class, 'enroll'])->name('learning-paths.enroll');

    // Assessments
    Route::resource('assessments', AssessmentController::class);
    Route::post('assessments/{assessment}/submit', [AssessmentController::class, 'submit'])->name('assessments.submit');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
