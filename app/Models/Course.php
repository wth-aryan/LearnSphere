<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'duration_minutes',
        'difficulty_level',
        'category',
        'instructor',
        'prerequisites',
        'what_you_will_learn',
        'status',
        'enrolled_count',
        'lessons_count'
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function learningPaths()
    {
        return $this->belongsToMany(LearningPath::class, 'course_learning_path');
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
} 