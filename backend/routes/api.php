<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminEventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventAdminController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:30,1')->group(function () {
    Route::get('events', [EventController::class, 'index']);
    Route::get('events/{slug}', [EventController::class, 'show']);
    Route::get('events/{slug}/testimonials', [EventController::class, 'testimonials']);
    Route::get('events/{slug}/display-settings', [EventController::class, 'displaySettings']);
    Route::get('testimonials', [TestimonialController::class, 'index']);
});

Route::get('events/{slug}/testimonials/stream', [EventController::class, 'streamTestimonials']);

Route::middleware('throttle:5,1')->post('testimonials', [TestimonialController::class, 'store']);

Route::prefix('admin')->middleware('throttle:60,1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware(['auth:sanctum', 'role:super_admin'])->group(function () {
        Route::apiResource('events', AdminEventController::class);
        Route::post('events/{id}/regenerate-qr', [AdminEventController::class, 'regenerateQR']);
        Route::get('events/{id}/admins', [AdminEventController::class, 'admins']);
        Route::post('events/{id}/admins', [AdminEventController::class, 'assignAdmin']);
        Route::post('events/{id}/admins/create', [AdminEventController::class, 'createAdminUser']);
        Route::delete('events/{id}/admins/{userId}', [AdminEventController::class, 'removeAdmin']);
        Route::get('users', [AdminEventController::class, 'users']);
        Route::post('users', [AdminEventController::class, 'storeUser']);
        Route::put('users/{id}', [AdminEventController::class, 'updateUser']);
        Route::delete('users/{id}', [AdminEventController::class, 'deleteUser']);
        Route::put('users/{id}/password', [AdminEventController::class, 'resetPassword']);

        Route::get('stats', [AdminController::class, 'stats']);
        Route::get('testimonials', [AdminController::class, 'testimonials']);
        Route::delete('testimonials/{id}', [AdminController::class, 'takedown']);
        Route::post('testimonials/{id}/restore', [AdminController::class, 'restore']);
        Route::post('testimonials/batch', [AdminController::class, 'batch']);
        Route::get('settings/{key}', [AdminController::class, 'settings']);
        Route::post('settings', [AdminController::class, 'updateSettings']);
        Route::post('testimonials/{id}/priority', [AdminController::class, 'setPriority']);
        Route::get('submitters', [AdminController::class, 'submitters']);

        Route::get('events/{id}/display-settings', [AdminController::class, 'getDisplaySettings']);
        Route::put('events/{id}/display-settings', [AdminController::class, 'updateDisplaySettings']);
        Route::post('events/{id}/upload-logo', [AdminController::class, 'uploadLogo']);
        Route::post('events/{id}/upload-background', [AdminController::class, 'uploadBackground']);
    });
});

Route::middleware(['auth:sanctum', 'role:event_admin', 'throttle:60,1'])->prefix('event-admin')->group(function () {
    Route::get('events', [EventAdminController::class, 'events']);
    Route::get('events/{id}', [EventAdminController::class, 'show']);
    Route::post('events/{id}/refresh-qr', [EventAdminController::class, 'refreshQR']);
    Route::get('testimonials', [EventAdminController::class, 'testimonials']);
    Route::post('testimonials/batch', [EventAdminController::class, 'batch']);
    Route::post('testimonials/{id}/takedown', [EventAdminController::class, 'takedown']);
    Route::post('testimonials/{id}/restore', [EventAdminController::class, 'restore']);
    Route::post('testimonials/{id}/priority', [EventAdminController::class, 'setPriority']);
    Route::post('events/{id}/banned-words', [EventAdminController::class, 'updateBannedWords']);
    Route::get('events/{id}/display-settings', [EventAdminController::class, 'getDisplaySettings']);
    Route::put('events/{id}/display-settings', [EventAdminController::class, 'updateDisplaySettings']);
    Route::post('events/{id}/upload-logo', [EventAdminController::class, 'uploadLogo']);
    Route::post('events/{id}/upload-background', [EventAdminController::class, 'uploadBackground']);
});
