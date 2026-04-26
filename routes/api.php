<?php

use App\Http\Controllers\Api\Admin\ReadingQuestionController as AdminReadingController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\WritingQuestionController as AdminWritingQuestionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController as ApiBookingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ListeningController as ApiListeningController;
use App\Http\Controllers\Api\ReadingController as ApiReadingController;
use App\Http\Controllers\Api\Tutor\AvailabilityController as TutorAvailabilityApiController;
use App\Http\Controllers\Api\Tutor\ReviewController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WritingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Api\AudioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIWritingFeedbackController;

// ── Public auth (no CSRF required — already excluded for api/*) ───────────────

Route::get('/test-audio-route', function () {
    return 'audio route works';
});
Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
});

Route::prefix('api')->middleware(['auth'])->group(function () {

    // ── Current user ──────────────────────────────────────────────────────────
    Route::get('/user', [UserController::class, 'show']);
    Route::patch('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::delete('/user', [UserController::class, 'destroy']);
    

    // ── Dashboard ─────────────────────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ── Writing (all authenticated users) ────────────────────────────────────
    Route::prefix('writing')->group(function () {
        Route::get('/task1/types', [WritingController::class, 'task1Types']);
        Route::get('/task1/{chartType}/questions', [WritingController::class, 'task1Questions']);
        Route::get('/task1/{question}', [WritingController::class, 'task1Practice']);
        Route::get('/task2/types', [WritingController::class, 'task2Types']);
        Route::get('/task2/{essayType}/questions', [WritingController::class, 'task2Questions']);
        Route::get('/task2/{question}/detail', [WritingController::class, 'task2Detail']);
        Route::post('/{question}/submit', [WritingController::class, 'submit']);
        Route::get('/submissions', [WritingController::class, 'mySubmissions']);
        Route::get('/submissions/{submission}', [WritingController::class, 'submission']);
        Route::get('/guides/{taskType}', [WritingController::class, 'guideSteps']);
        Route::get('/guides/{taskType}/{essayType}', [WritingController::class, 'guideSteps']);
    });

    // ── Listening ─────────────────────────────────────────────────────────────
    Route::prefix('listening')->group(function () {
        Route::get('/', [ApiListeningController::class, 'index']);
        Route::get('/{listening}', [ApiListeningController::class, 'show']);
    });

    // ── Reading ───────────────────────────────────────────────────────────────
    Route::prefix('reading')->group(function () {
        Route::get('/', [ApiReadingController::class, 'index']);
        Route::get('/{reading}', [ApiReadingController::class, 'show']);
    });

    // ── Bookings ──────────────────────────────────────────────────────────────
    Route::prefix('bookings')->group(function () {
        Route::get('/tutors', [ApiBookingController::class, 'tutors']);
        Route::get('/', [ApiBookingController::class, 'index']);
        Route::post('/', [ApiBookingController::class, 'store']);
    });

    // ── Tutor (tutor + admin) ─────────────────────────────────────────────────
    Route::prefix('tutor')->middleware(['role:tutor,admin'])->group(function () {
        Route::get('/reviews', [ReviewController::class, 'index']);
        Route::get('/reviews/{submission}', [ReviewController::class, 'show']);
        Route::post('/reviews/{submission}/feedback', [ReviewController::class, 'store']);
        Route::get('/availability', [TutorAvailabilityApiController::class, 'index']);
        Route::put('/availability', [TutorAvailabilityApiController::class, 'update']);
    });

    // ── Admin ─────────────────────────────────────────────────────────────────
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        Route::apiResource('/users', AdminUserController::class);
        Route::apiResource('/writing-questions', AdminWritingQuestionController::class);
        Route::apiResource('/reading-questions', AdminReadingController::class);
    });

    // ── AI FEEDBACK ───────────────────────────────────────────────────────────
    Route::post('/ai-feedback/{id}', [AIWritingFeedbackController::class, 'generateFeedback']);
    Route::get('/ai-feedback/{id}', [AIWritingFeedbackController::class, 'show']);

});