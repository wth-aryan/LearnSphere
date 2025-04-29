<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\QuizQuestion;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        $courseQuizzes = [
            'Advanced JavaScript' => [
                'quiz' => [
                    'title' => 'Advanced JavaScript Quiz',
                    'description' => 'Test your knowledge of Advanced JavaScript concepts.',
                    'duration_minutes' => 15,
                    'passing_score' => 70,
                ],
                'questions' => [
                    [
                        'question' => 'What is the output of: const [a, ...rest] = [1, 2, 3, 4];',
                        'options' => ['a = 1, rest = [2, 3, 4]', 'a = [1], rest = [2, 3, 4]', 'a = 1, rest = 2, 3, 4', 'Error'],
                        'correct_answer' => 'a = 1, rest = [2, 3, 4]',
                        'explanation' => 'This is array destructuring with rest parameters. The first value is assigned to a, and the remaining values are collected into an array called rest.'
                    ],
                    [
                        'question' => 'Which statement about async/await is correct?',
                        'options' => [
                            'async functions always return a Promise',
                            'await can be used outside async functions',
                            'async/await only works with setTimeout',
                            'await blocks the entire application'
                        ],
                        'correct_answer' => 'async functions always return a Promise',
                        'explanation' => 'async functions automatically wrap the return value in a Promise, even if you return a non-Promise value.'
                    ],
                    [
                        'question' => 'What is the purpose of the Symbol type in JavaScript?',
                        'options' => [
                            'To create unique identifiers',
                            'To define mathematical constants',
                            'To compress strings',
                            'To encrypt data'
                        ],
                        'correct_answer' => 'To create unique identifiers',
                        'explanation' => 'Symbols are primitive values that are guaranteed to be unique, making them ideal for object property keys when you want to avoid name collisions.'
                    ],
                    [
                        'question' => 'What is the correct way to create a generator function?',
                        'options' => [
                            'function* generator() {}',
                            'function generator*() {}',
                            'generator function() {}',
                            'async function generator() {}'
                        ],
                        'correct_answer' => 'function* generator() {}',
                        'explanation' => 'Generator functions are defined using the function* syntax, which allows them to pause execution using the yield keyword.'
                    ],
                    [
                        'question' => 'What is the purpose of the WeakMap object?',
                        'options' => [
                            'To store key-value pairs where keys must be objects and are weakly referenced',
                            'To create a map that performs poorly',
                            'To store only string keys',
                            'To create an immutable map'
                        ],
                        'correct_answer' => 'To store key-value pairs where keys must be objects and are weakly referenced',
                        'explanation' => 'WeakMap allows object keys to be garbage collected when there are no other references to them, which helps prevent memory leaks.'
                    ]
                ]
            ]
        ];

        foreach ($courseQuizzes as $courseTitle => $quizData) {
            $course = Course::where('title', $courseTitle)->first();
            if ($course) {
                $quiz = Quiz::create([
                    'course_id' => $course->id,
                    'title' => $quizData['quiz']['title'],
                    'description' => $quizData['quiz']['description'],
                    'duration_minutes' => $quizData['quiz']['duration_minutes'],
                    'passing_score' => $quizData['quiz']['passing_score'],
                ]);

                foreach ($quizData['questions'] as $questionData) {
                    QuizQuestion::create([
                        'quiz_id' => $quiz->id,
                        'question' => $questionData['question'],
                        'options' => $questionData['options'],
                        'correct_answer' => $questionData['correct_answer'],
                        'explanation' => $questionData['explanation'],
                    ]);
                }
            }
        }
    }
} 