<?php
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WritingQuestionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Tutor\ReviewController;
use App\Http\Controllers\WritingController;
use App\Http\Controllers\AIWritingFeedbackController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Fortify\Features;
use App\Models\Tutor;
use Inertia\Inertia;
use App\Http\Controllers\ListeningController;

/*
|--------------------------------------------------------------------------
| Public / Welcome
|--------------------------------------------------------------------------
*/
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | BOOK TUTOR FLOW
    |--------------------------------------------------------------------------
    */

    Route::get('speaking', function () {
        return 
        redirect()->route('book.tutor.list', ['type' => 'speaking']);
    })->name('speaking');

    Route::get('book-tutor/{type}', function ($type) {

        $tutors = Tutor::all();

        return Inertia::render('bookings/tutor-list', [
            'type' => $type,
            'tutors' => $tutors,
        ]);

    })->name('book.tutor.list');

    Route::get('payment-method', function (Request $request) {
        return Inertia::render('payment-method', [
            'tutorId' => $request->tutorId,
            'tutorName' => $request->tutorName,
            'specialization' => $request->specialization,
            'selectedSlot' => $request->selectedSlot,
        ]);
    })->name('payment.method');

    /*
    |--------------------------------------------------------------------------
    | BOOKING STORE (IMPORTANT FIX)
    |--------------------------------------------------------------------------
    */
    Route::post('bookings', [BookingController::class, 'store'])
        ->name('bookings.store');

    /*
    |--------------------------------------------------------------------------
    | WRITING MODULE
    |--------------------------------------------------------------------------
    */

    Route::get('writing', [WritingController::class, 'index'])->name('writing.index');
    Route::get('writing/task1', [WritingController::class, 'task1Types'])->name('writing.task1.types');
    Route::get('writing/task1/{chartType}', [WritingController::class, 'task1Questions'])->name('writing.task1.questions');
    Route::get('writing/task1/{question}/practice', [WritingController::class, 'task1Practice'])->name('writing.task1.practice');
    Route::post('writing/{question}/submit', [WritingController::class, 'submit'])->name('writing.submit');
    Route::get('writing/submission/{submission}', [WritingController::class, 'submission'])->name('writing.submission');

    /*
    |--------------------------------------------------------------------------
    | AI FEEDBACK (STEP 1 - TRIGGER ONLY)
    |--------------------------------------------------------------------------
    */
    Route::post('ai-feedback/{id}', [AIWritingFeedbackController::class, 'generateFeedback'])
        ->name('ai.feedback');

    /*
    |--------------------------------------------------------------------------
    | AI DETAILED FEEDBACK PAGE
    |--------------------------------------------------------------------------
    */
    Route::get('ai-feedback/{id}', [AIWritingFeedbackController::class, 'show'])
        ->name('ai.feedback.show');

    /*
    |--------------------------------------------------------------------------
    | TASK 2
    |--------------------------------------------------------------------------
    */

    Route::get('writing/task2', [WritingController::class, 'task2Types'])->name('writing.task2.types');
    Route::get('writing/task2/{essayType}', [WritingController::class, 'task2Questions'])->name('writing.task2.questions');
    Route::get('writing/task2/{question}/guided', [WritingController::class, 'task2Guided'])->name('writing.task2.guided');

    Route::get('listening', [ListeningController::class, 'index'])->name('listening.index');
});

/*
|--------------------------------------------------------------------------
| Tutor Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:tutor,admin'])
    ->prefix('tutor')
    ->name('tutor.')
    ->group(function () {

        Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
        Route::get('reviews/{submission}', [ReviewController::class, 'show'])->name('reviews.show');
        Route::post('reviews/{submission}', [ReviewController::class, 'store'])->name('reviews.store');
    });

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('writing-questions', WritingQuestionController::class)->except(['show']);
    });

require __DIR__.'/settings.php';
require __DIR__.'/api.php';