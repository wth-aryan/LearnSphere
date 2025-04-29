<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;

class AssessmentController extends Controller
{
    public function index()
    {
        $assessments = Assessment::all();
        return view('assessments.index', compact('assessments'));
    }

    public function show($id)
    {
        $assessment = Assessment::findOrFail($id);
        return view('assessments.show', compact('assessment'));
    }

    public function submit(Request $request, $id)
    {
        $assessment = Assessment::findOrFail($id);
        $user = Auth::user();
        $answers = $request->input('answers', []);
        $score = $this->calculateScore($assessment, $answers);
        $submission = AssessmentSubmission::create([
            'assessment_id' => $assessment->id,
            'user_id' => $user->id,
            'answers' => json_encode($answers),
            'score' => $score,
            'submitted_at' => now(),
        ]);
        // Optionally update user skills here
        return redirect()->route('assessments.show', $id)->with('success', 'Assessment submitted!');
    }

    private function calculateScore($assessment, $answers)
    {
        // Dummy scoring logic for now
        return is_array($answers) ? count($answers) : 0;
    }
} 