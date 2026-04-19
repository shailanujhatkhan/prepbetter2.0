<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WritingQuestionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Tutor\ReviewController;
use App\Http\Controllers\WritingController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// All authenticated users share one dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Writing module
    Route::get('writing', [WritingController::class, 'index'])->name('writing.index');
    Route::get('writing/task1', [WritingController::class, 'task1Types'])->name('writing.task1.types');
    Route::get('writing/task1/{chartType}', [WritingController::class, 'task1Questions'])->name('writing.task1.questions');
    Route::get('writing/task1/{question}/practice', [WritingController::class, 'task1Practice'])->name('writing.task1.practice');
    Route::post('writing/{question}/submit', [WritingController::class, 'submit'])->name('writing.submit');
    Route::get('writing/submission/{submission}', [WritingController::class, 'submission'])->name('writing.submission');
    
    // Task 2: Guided Essay Flow
    Route::get('writing/task2', [WritingController::class, 'task2Types'])->name('writing.task2.types');
    Route::get('writing/task2/{essayType}', [WritingController::class, 'task2Questions'])->name('writing.task2.questions');
    Route::get('writing/task2/{question}/guided', [WritingController::class, 'task2Guided'])->name('writing.task2.guided');
});

// Tutor routes (tutor + admin can access)
Route::middleware(['auth', 'verified', 'role:tutor,admin'])->prefix('tutor')->name('tutor.')->group(function () {
    Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::get('reviews/{submission}', [ReviewController::class, 'show'])->name('reviews.show');
    Route::post('reviews/{submission}', [ReviewController::class, 'store'])->name('reviews.store');
});

// Admin routes (admin only)
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('writing-questions', WritingQuestionController::class)->except(['show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/api.php';
