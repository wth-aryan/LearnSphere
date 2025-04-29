<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\QuestionOption;

class AssessmentSeeder extends Seeder
{
    public function run(): void
    {
        // Get the Web Development course
        $course = Course::where('title', 'Introduction to Web Development')->first();
        
        if ($course) {
            // Create HTML Basics Quiz
            $htmlQuiz = Assessment::create([
                'course_id' => $course->id,
                'title' => 'HTML Basics Quiz',
                'description' => 'Test your knowledge of HTML fundamentals',
                'time_limit' => 15,
                'passing_score' => 70,
                'is_published' => true,
                'max_attempts' => 3
            ]);

            // Question 1
            $q1 = AssessmentQuestion::create([
                'assessment_id' => $htmlQuiz->id,
                'content' => 'What does HTML stand for?',
                'type' => 'multiple_choice',
                'points' => 2,
                'order' => 1
            ]);

            QuestionOption::create([
                'question_id' => $q1->id,
                'content' => 'Hyper Text Markup Language',
                'is_correct' => true,
                'order' => 1
            ]);

            QuestionOption::create([
                'question_id' => $q1->id,
                'content' => 'High Tech Modern Language',
                'is_correct' => false,
                'order' => 2
            ]);

            QuestionOption::create([
                'question_id' => $q1->id,
                'content' => 'Hyperlinks and Text Markup Language',
                'is_correct' => false,
                'order' => 3
            ]);

            // Question 2
            $q2 = AssessmentQuestion::create([
                'assessment_id' => $htmlQuiz->id,
                'content' => 'Which tag is used to create a hyperlink?',
                'type' => 'multiple_choice',
                'points' => 2,
                'order' => 2
            ]);

            QuestionOption::create([
                'question_id' => $q2->id,
                'content' => '<a>',
                'is_correct' => true,
                'order' => 1
            ]);

            QuestionOption::create([
                'question_id' => $q2->id,
                'content' => '<link>',
                'is_correct' => false,
                'order' => 2
            ]);

            QuestionOption::create([
                'question_id' => $q2->id,
                'content' => '<href>',
                'is_correct' => false,
                'order' => 3
            ]);

            // Question 3
            $q3 = AssessmentQuestion::create([
                'assessment_id' => $htmlQuiz->id,
                'content' => 'Explain the difference between <div> and <span> elements.',
                'type' => 'text',
                'correct_answer' => 'div is a block-level element while span is an inline element',
                'points' => 3,
                'order' => 3
            ]);

            // Create CSS Fundamentals Quiz
            $cssQuiz = Assessment::create([
                'course_id' => $course->id,
                'title' => 'CSS Fundamentals Quiz',
                'description' => 'Test your understanding of CSS basics',
                'time_limit' => 20,
                'passing_score' => 75,
                'is_published' => true,
                'max_attempts' => 3
            ]);

            // Question 1
            $q1 = AssessmentQuestion::create([
                'assessment_id' => $cssQuiz->id,
                'content' => 'What does CSS stand for?',
                'type' => 'multiple_choice',
                'points' => 2,
                'order' => 1
            ]);

            QuestionOption::create([
                'question_id' => $q1->id,
                'content' => 'Cascading Style Sheets',
                'is_correct' => true,
                'order' => 1
            ]);

            QuestionOption::create([
                'question_id' => $q1->id,
                'content' => 'Computer Style Sheets',
                'is_correct' => false,
                'order' => 2
            ]);

            QuestionOption::create([
                'question_id' => $q1->id,
                'content' => 'Creative Style System',
                'is_correct' => false,
                'order' => 3
            ]);

            // Question 2
            $q2 = AssessmentQuestion::create([
                'assessment_id' => $cssQuiz->id,
                'content' => 'Which property is used to change the text color?',
                'type' => 'multiple_choice',
                'points' => 2,
                'order' => 2
            ]);

            QuestionOption::create([
                'question_id' => $q2->id,
                'content' => 'color',
                'is_correct' => true,
                'order' => 1
            ]);

            QuestionOption::create([
                'question_id' => $q2->id,
                'content' => 'text-color',
                'is_correct' => false,
                'order' => 2
            ]);

            QuestionOption::create([
                'question_id' => $q2->id,
                'content' => 'font-color',
                'is_correct' => false,
                'order' => 3
            ]);
        }
    }
} 