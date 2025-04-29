<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Lesson;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $courseLessons = [
            'Advanced JavaScript' => [
                [
                    'title' => 'ES6+ Features',
                    'description' => 'Learn modern JavaScript features including arrow functions, destructuring, and modules.',
                    'duration' => '45 minutes'
                ],
                [
                    'title' => 'Async Programming',
                    'description' => 'Master Promises, async/await, and handling asynchronous operations.',
                    'duration' => '60 minutes'
                ],
                [
                    'title' => 'Design Patterns',
                    'description' => 'Common JavaScript design patterns and best practices.',
                    'duration' => '50 minutes'
                ],
                [
                    'title' => 'Performance Optimization',
                    'description' => 'Techniques for writing efficient and performant JavaScript code.',
                    'duration' => '55 minutes'
                ]
            ],
            'Laravel for Beginners' => [
                [
                    'title' => 'Introduction to Laravel',
                    'description' => 'Understanding MVC architecture and Laravel basics.',
                    'duration' => '40 minutes'
                ],
                [
                    'title' => 'Routing and Controllers',
                    'description' => 'Creating routes and handling HTTP requests with controllers.',
                    'duration' => '45 minutes'
                ],
                [
                    'title' => 'Blade Templates',
                    'description' => 'Building views with Laravel\'s Blade templating engine.',
                    'duration' => '50 minutes'
                ],
                [
                    'title' => 'Database and Eloquent',
                    'description' => 'Working with databases using Laravel\'s Eloquent ORM.',
                    'duration' => '55 minutes'
                ]
            ],
            'Python Data Science' => [
                [
                    'title' => 'NumPy Fundamentals',
                    'description' => 'Working with numerical data using NumPy arrays and operations.',
                    'duration' => '50 minutes'
                ],
                [
                    'title' => 'Pandas for Data Analysis',
                    'description' => 'Data manipulation and analysis with Pandas DataFrames.',
                    'duration' => '60 minutes'
                ],
                [
                    'title' => 'Data Visualization',
                    'description' => 'Creating visualizations using Matplotlib and Seaborn.',
                    'duration' => '45 minutes'
                ],
                [
                    'title' => 'Statistical Analysis',
                    'description' => 'Basic statistical analysis and hypothesis testing.',
                    'duration' => '55 minutes'
                ]
            ],
            'React Fundamentals' => [
                [
                    'title' => 'Components and Props',
                    'description' => 'Understanding React components and props system.',
                    'duration' => '45 minutes'
                ],
                [
                    'title' => 'State and Hooks',
                    'description' => 'Managing state with useState and other React hooks.',
                    'duration' => '50 minutes'
                ],
                [
                    'title' => 'Event Handling',
                    'description' => 'Handling user interactions and events in React.',
                    'duration' => '40 minutes'
                ],
                [
                    'title' => 'Component Lifecycle',
                    'description' => 'Understanding component lifecycle and useEffect.',
                    'duration' => '55 minutes'
                ]
            ],
            'Web Development Intro' => [
                [
                    'title' => 'HTML Basics',
                    'description' => 'Introduction to HTML tags and document structure.',
                    'duration' => '40 minutes'
                ],
                [
                    'title' => 'CSS Styling',
                    'description' => 'Styling web pages with CSS and layout techniques.',
                    'duration' => '45 minutes'
                ],
                [
                    'title' => 'JavaScript Basics',
                    'description' => 'Introduction to JavaScript programming basics.',
                    'duration' => '50 minutes'
                ],
                [
                    'title' => 'Responsive Design',
                    'description' => 'Making websites responsive for different screen sizes.',
                    'duration' => '45 minutes'
                ]
            ]
        ];

        foreach ($courseLessons as $courseTitle => $lessons) {
            $course = Course::where('title', $courseTitle)->first();
            if ($course) {
                foreach ($lessons as $index => $lessonData) {
                    Lesson::create([
                        'course_id' => $course->id,
                        'title' => $lessonData['title'],
                        'description' => $lessonData['description'],
                        'duration' => $lessonData['duration'],
                        'order' => $index + 1
                    ]);
                }
            }
        }
    }
} 