<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = App\Models\User::all();
echo "Users in DB: " . $users->count() . "\n";
foreach ($users as $u) {
    echo "  ID:{$u->id} name:{$u->name} email:{$u->email}\n";
}
