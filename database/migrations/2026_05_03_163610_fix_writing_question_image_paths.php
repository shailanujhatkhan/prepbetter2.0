<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $paths = [
            'Total Revenue of ABC Corp., 2018-2022' => 'writing-images/bar-revenue.png',
            'Internet Users by Region, 2010-2020' => 'writing-images/bar-internet.png',
            'Average Temperature in London, 2015-2023' => 'writing-images/line-temperature.png',
            'Population Growth Trends in Three Cities' => 'writing-images/line-population.png',
            'Household Expenditure Breakdown' => 'writing-images/pie-expenditure.png',
            'Energy Sources Distribution by Country' => 'writing-images/pie-energy.png',
            'City Centre Development Plan' => 'writing-images/map-city.png',
            'Chocolate Manufacturing Process' => 'writing-images/process-chocolate.png',
        ];

        foreach ($paths as $title => $imagePath) {
            DB::table('writing_questions')
                ->where('title', $title)
                ->update(['image_path' => $imagePath]);
        }
    }

    public function down(): void
    {
        //
    }
};