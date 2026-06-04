<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $relationships = ['Teman', 'Keluarga', 'Rekan Kerja', 'Lainnya'];

        $names = [
            'Anita Wijaya', 'Budi Santoso', 'Citra Dewi', 'Denny Pratama', 'Eka Putri',
            'Fajar Hidayat', 'Gita Permata', 'Hendra Gunawan', 'Indah Lestari', 'Joko Susilo',
            'Kartika Sari', 'Lukman Hakim', 'Mega Puspita', 'Nanda Kusuma', 'Olivia Tan',
            'Putra Ramadhan', 'Ratna Sari', 'Satria Wibawa', 'Tia Anggraini', 'Umar Zain',
            'Vina Marliana', 'Wawan Setiawan', 'Yuni Astuti', 'Zaki Firmansyah', 'Ayu Pratiwi',
            'Bagas Prakoso', 'Cici Permata Sari', 'Dimas Ardiansyah', 'Eva Nurhaliza', 'Farhan Kurniawan',
            'Gina Safitri', 'Haris Munandar', 'Intan Permata Hati', 'Jefri Alamsyah', 'Kiki Amalia',
            'Leo Pratama', 'Mira Susanti', 'Novi Andriani', 'Omar Hakim', 'Puji Lestari',
            'Qori Ainun', 'Rizky Fadillah', 'Sari Dewi Lestari', 'Teguh Prasetyo', 'Uli Siregar',
            'Vera Oktaviani', 'Wahyu Hidayat', 'Xena Mariana', 'Yoga Pratama', 'Zahra Amalia',
        ];

        $texts = [
            'Acara pernikahannya sangat megah dan tak terlupakan! Terima kasih untuk seluruh tim.',
            'Momen sakral yang penuh kebahagiaan. Semoga langgeng selalu!',
            'Weddingnya aesthetic banget, make upnya flawless, dekorasinya cantik!',
            'Suasana haru dan bahagia bercampur jadi satu. Perfect!',
            'Pernikahan impian jadi kenyataan. Semua detailnya diperhatikan dengan baik.',
            'Dari awal sampai akhir acara berjalan lancar. Sungguh profesional!',
            'Ga nyangka bisa dapat pengalaman se-wow ini. Makasih ya!',
            'The best wedding ever! Semua tamu terkesan dengan acaranya.',
            'Terima kasih sudah membuat hari spesial kami menjadi sempurna.',
            'Indah, elegan, dan penuh cinta. Tidak ada kata lain selain sempurna!',
            'Semua tamu bilang ini pernikahan paling berkesan yang pernah mereka datangi.',
            'Berkat kalian, hari bahagia kami jadi semakin berkesan. Thank you!',
            'Videography dan photography nya keren abis! Hasilnya cinematic banget.',
            'Konsep pernikahannya unik dan beda dari yang lain. Love it!',
            'Lancar, meriah, dan khidmat. Kombinasi yang sempurna.',
            'Makanannya enak-enak, pelayanannya ramah, dekorasinya cantik. 10/10!',
            'Semua undangan pada betah sampe akhir acara. Sukses terus!',
            'Hari yang paling membahagiakan dalam hidup kami. Terima kasih tim!',
            'Sangat recommended! Acara pernikahan berkualitas dengan harga terjangkau.',
            'Dekorasi bunganya cantik banget, fotonya aesthetic semua.推荐!',
            'Acara berjalan hikmat dan penuh sukacita. Tuhan memberkati!',
            'Pelayanannya ramah dan profesional. Semua tamu puas!',
            'Ga nyangka acara semewah ini dengan budget yang masuk akal. Mantap!',
            'Suasananya romantis banget, bikin mewek 💕',
            'Berkat doa dan dukungan semua, acara lancar tanpa hambatan.',
            'Cateringnya enak, tempatnya nyaman, dekorasi wah. Lengkap!',
            'Momen pertama kali liat pengantin jalan ke pelaminan bikin haru semua tamu.',
            'Terima kasih sudah mengabadikan momen terindah kami dengan sempurna.',
            'Acara pernikahan yang penuh berkah dan kehangatan. Terharu!',
            'Semua tamu pada senyum-senyum terus, suasananya happy banget!',
            'Konsep outdoor-nya kece parah, fotonya natural dan cantik.',
            'Live music-nya bagus banget, bikin suasana makin meriah.',
            'Dari prewedding sampe acara inti, semua berjalan lancar.',
            'Ga ada kata yang bisa mendeskripsikan kebahagiaan hari ini.',
            'Semua undangan pada bilang ini pernikahan terindah yang pernah mereka lihat.',
            'Tata riasnya flawless, make up pengantinnya glowing banget!',
            'Hari yang penuh kejutan manis dan momen tak terlupakan.',
            'Prosesi adatnya berjalan khidmat, modern tapi tetap tradisional.',
            'Bunga-bunganya fresh dan wangi, dekorasi living flower banget.',
            'Satu kata: SEMPURNA! Semua tim bekerja luar biasa.',
        ];

        $photos = collect(File::files(storage_path('app/public/photos')))
            ->map(fn($f) => 'photos/' . $f->getFilename())
            ->toArray();

        if (empty($photos)) {
            $this->command->warn('Tidak ada foto di storage/app/public/photos!');
            $photos[] = null;
        }

        $this->command->info('Found ' . count($photos) . ' photos');

        $events = Event::all();

        if ($events->isEmpty()) {
            $this->command->error('Tidak ada event! Jalankan EventsSeeder dulu.');
            return;
        }

        Testimonial::truncate();

        $priorityPerEvent = floor(10 / $events->count());

        foreach ($events as $event) {
            foreach (range(0, 49) as $i) {
                $isPriority = $i < $priorityPerEvent;
                Testimonial::create([
                    'event_id' => $event->id,
                    'name' => $names[array_rand($names)],
                    'phone_email' => 'guest_' . $event->id . '_' . ($i + 1) . '@example.com',
                    'relationship' => $relationships[array_rand($relationships)],
                    'testimonial' => $texts[array_rand($texts)],
                    'photo' => $photos[array_rand($photos)],
                    'is_active' => true,
                    'is_priority' => $isPriority,
                ]);
            }
        }

        $this->command->info(($events->count() * 50) . ' testimonials seeded across ' . $events->count() . ' events!');
    }
}
