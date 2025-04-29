<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'time_limit',
        'passing_score',
        'is_published',
        'max_attempts'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'time_limit' => 'integer',
        'passing_score' => 'integer',
        'max_attempts' => 'integer'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(AssessmentQuestion::class)->orderBy('order');
    }

    public function submissions()
    {
        return $this->hasMany(AssessmentSubmission::class);
    }

    public function userResults()
    {
        return $this->hasMany(AssessmentSubmission::class, 'assessment_id');
    }

    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class);
    }
} 