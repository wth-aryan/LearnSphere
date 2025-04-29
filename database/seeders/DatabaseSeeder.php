<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        $this->call([
            DefaultUserSeeder::class,
            UserSeeder::class,
            CourseSeeder::class,
            LessonSeeder::class,
            AssessmentSeeder::class,
            QuizSeeder::class,
        ]);
    }
} 