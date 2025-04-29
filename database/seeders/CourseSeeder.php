<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Assessment;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'title' => 'Advanced JavaScript',
                'description' => 'Deep dive into advanced JavaScript concepts, ES6+, async programming, and more.',
                'image_url' => 'courses/js-advanced.jpg',
                'category' => 'Programming',
                'difficulty_level' => 'Advanced',
                'duration_minutes' => 12 * 60,
            ],
            [
                'title' => 'Laravel for Beginners',
                'description' => 'A beginner-friendly introduction to Laravel, covering routing, controllers, and Blade.',
                'image_url' => 'courses/laravel-beginners.jpg',
                'category' => 'Web Development',
                'difficulty_level' => 'Beginner',
                'duration_minutes' => 10 * 60,
            ],
            [
                'title' => 'Python Data Science',
                'description' => 'Learn Python for data science, including NumPy, Pandas, and visualization.',
                'image_url' => 'courses/python-data-science.jpg',
                'category' => 'Data Science',
                'difficulty_level' => 'Intermediate',
                'duration_minutes' => 14 * 60,
            ],
            [
                'title' => 'React Fundamentals',
                'description' => 'Master the fundamentals of React, components, hooks, and state management.',
                'image_url' => 'courses/react-fundamentals.jpg',
                'category' => 'Web Development',
                'difficulty_level' => 'Beginner',
                'duration_minutes' => 11 * 60,
            ],
            [
                'title' => 'Web Development Intro',
                'description' => 'Kickstart your web development journey with HTML, CSS, and JavaScript basics.',
                'image_url' => 'courses/web-dev-intro.jpg',
                'category' => 'Web Development',
                'difficulty_level' => 'Beginner',
                'duration_minutes' => 8 * 60,
            ],
        ];

        foreach ($courses as $courseData) {
            $course = Course::create($courseData);
            // Add a sample assessment for each course
            Assessment::create([
                'course_id' => $course->id,
                'title' => $courseData['title'] . ' Quiz',
                'description' => 'Test your knowledge of ' . $courseData['title'] . '.',
                'time_limit' => 15,
                'passing_score' => 70,
                'is_published' => true,
                'max_attempts' => 3
            ]);
        }
    }
} 