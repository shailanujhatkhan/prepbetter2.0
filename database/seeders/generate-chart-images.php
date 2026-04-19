<?php

/**
 * Generate placeholder chart images for writing question seeds.
 * Run: php database/seeders/generate-chart-images.php
 */

$outputDir = __DIR__ . '/../../storage/app/public/writing-images';
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

function createImage(string $filename, string $title, callable $drawFn): void
{
    global $outputDir;
    $w = 800;
    $h = 500;
    $img = imagecreatetruecolor($w, $h);

    $white = imagecolorallocate($img, 255, 255, 255);
    $black = imagecolorallocate($img, 40, 40, 40);
    $gray = imagecolorallocate($img, 200, 200, 200);
    $blue = imagecolorallocate($img, 66, 133, 244);
    $red = imagecolorallocate($img, 234, 67, 53);
    $green = imagecolorallocate($img, 52, 168, 83);
    $yellow = imagecolorallocate($img, 251, 188, 4);
    $purple = imagecolorallocate($img, 128, 90, 213);
    $colors = compact('white', 'black', 'gray', 'blue', 'red', 'green', 'yellow', 'purple');

    imagefill($img, 0, 0, $white);
    imagerectangle($img, 0, 0, $w - 1, $h - 1, $gray);

    // Title
    imagestring($img, 5, ($w - strlen($title) * 9) / 2, 15, $title, $black);

    $drawFn($img, $w, $h, $colors);

    imagepng($img, "$outputDir/$filename");
    imagedestroy($img);
    echo "Created: $filename\n";
}

// 1. Bar Graph - Revenue
createImage('bar-revenue.png', 'TOTAL REVENUE OF ABC CORP., 2018-2022', function ($img, $w, $h, $c) {
    $values = [30, 38, 46, 54, 63];
    $years = ['2018', '2019', '2020', '2021', '2022'];
    $maxVal = 70;
    $baseX = 120;
    $baseY = $h - 70;
    $barW = 80;
    $gap = 30;
    $chartH = $baseY - 60;

    // Y axis
    imageline($img, $baseX, 50, $baseX, $baseY, $c['black']);
    imageline($img, $baseX, $baseY, $w - 40, $baseY, $c['black']);
    imagestring($img, 3, 20, $baseY / 2 - 40, 'Revenue (M USD)', $c['black']);

    for ($i = 0; $i <= 7; $i++) {
        $y = $baseY - ($i / 7) * $chartH;
        imageline($img, $baseX, (int)$y, $w - 40, (int)$y, $c['gray']);
        imagestring($img, 3, $baseX - 30, (int)$y - 7, (string)($i * 10), $c['black']);
    }

    foreach ($values as $i => $v) {
        $x = $baseX + $gap + $i * ($barW + $gap);
        $barH = ($v / $maxVal) * $chartH;
        $y1 = (int)($baseY - $barH);
        imagefilledrectangle($img, $x, $y1, $x + $barW, $baseY, $c['blue']);
        imagestring($img, 3, $x + 20, $baseY + 8, $years[$i], $c['black']);
    }
});

// 2. Bar Graph - Internet Users
createImage('bar-internet.png', 'INTERNET USERS BY REGION (MILLIONS), 2010-2020', function ($img, $w, $h, $c) {
    $regions = ['Asia', 'Europe', 'N.America', 'Africa'];
    $data2010 = [100, 80, 70, 20];
    $data2020 = [250, 120, 95, 60];
    $maxVal = 280;
    $baseX = 120;
    $baseY = $h - 70;
    $barW = 35;
    $groupGap = 50;
    $chartH = $baseY - 60;

    imageline($img, $baseX, 50, $baseX, $baseY, $c['black']);
    imageline($img, $baseX, $baseY, $w - 40, $baseY, $c['black']);

    foreach ($regions as $i => $region) {
        $gx = $baseX + $groupGap + $i * ($barW * 2 + $groupGap + 10);

        $h1 = ($data2010[$i] / $maxVal) * $chartH;
        imagefilledrectangle($img, $gx, (int)($baseY - $h1), $gx + $barW, $baseY, $c['blue']);

        $h2 = ($data2020[$i] / $maxVal) * $chartH;
        imagefilledrectangle($img, $gx + $barW + 4, (int)($baseY - $h2), $gx + $barW * 2 + 4, $baseY, $c['red']);

        imagestring($img, 3, $gx + 5, $baseY + 8, $region, $c['black']);
    }

    // Legend
    imagefilledrectangle($img, $w - 150, 50, $w - 130, 65, $c['blue']);
    imagestring($img, 3, $w - 125, 52, '2010', $c['black']);
    imagefilledrectangle($img, $w - 150, 72, $w - 130, 87, $c['red']);
    imagestring($img, 3, $w - 125, 74, '2020', $c['black']);
});

// 3. Line Graph - Temperature
createImage('line-temperature.png', 'AVERAGE TEMPERATURE IN LONDON, 2015-2023', function ($img, $w, $h, $c) {
    $values = [11, 12, 11.5, 12.5, 13, 12, 13.5, 14, 13.5];
    $years = ['15', '16', '17', '18', '19', '20', '21', '22', '23'];
    $minVal = 9;
    $maxVal = 16;
    $baseX = 120;
    $baseY = $h - 70;
    $chartH = $baseY - 60;
    $chartW = $w - $baseX - 60;

    imageline($img, $baseX, 50, $baseX, $baseY, $c['black']);
    imageline($img, $baseX, $baseY, $w - 40, $baseY, $c['black']);

    $points = [];
    foreach ($values as $i => $v) {
        $x = $baseX + ($i / (count($values) - 1)) * $chartW;
        $y = $baseY - (($v - $minVal) / ($maxVal - $minVal)) * $chartH;
        $points[] = [(int)$x, (int)$y];
        imagestring($img, 3, (int)$x - 5, $baseY + 8, $years[$i], $c['black']);
    }

    for ($i = 0; $i < count($points) - 1; $i++) {
        imageline($img, $points[$i][0], $points[$i][1], $points[$i + 1][0], $points[$i + 1][1], $c['blue']);
        imagesetthickness($img, 2);
    }

    foreach ($points as [$px, $py]) {
        imagefilledellipse($img, $px, $py, 10, 10, $c['blue']);
    }
});

// 4. Line Graph - Population
createImage('line-population.png', 'POPULATION GROWTH IN THREE CITIES, 2000-2025', function ($img, $w, $h, $c) {
    $cityA = [2, 2.5, 3, 3.8, 4.5, 5.2];
    $cityB = [4, 4.2, 4.1, 4.3, 4.5, 4.6];
    $cityC = [1, 1.5, 2.5, 3, 2.8, 3.5];
    $years = ['2000', '2005', '2010', '2015', '2020', '2025'];
    $minVal = 0;
    $maxVal = 6;
    $baseX = 120;
    $baseY = $h - 70;
    $chartH = $baseY - 60;
    $chartW = $w - $baseX - 80;

    imageline($img, $baseX, 50, $baseX, $baseY, $c['black']);
    imageline($img, $baseX, $baseY, $w - 40, $baseY, $c['black']);

    $drawLine = function ($data, $color) use ($img, $baseX, $baseY, $chartH, $chartW, $minVal, $maxVal) {
        $pts = [];
        foreach ($data as $i => $v) {
            $x = $baseX + ($i / (count($data) - 1)) * $chartW;
            $y = $baseY - (($v - $minVal) / ($maxVal - $minVal)) * $chartH;
            $pts[] = [(int)$x, (int)$y];
        }
        for ($i = 0; $i < count($pts) - 1; $i++) {
            imageline($img, $pts[$i][0], $pts[$i][1], $pts[$i + 1][0], $pts[$i + 1][1], $color);
        }
        foreach ($pts as [$px, $py]) {
            imagefilledellipse($img, $px, $py, 8, 8, $color);
        }
    };

    $drawLine($cityA, $c['blue']);
    $drawLine($cityB, $c['red']);
    $drawLine($cityC, $c['green']);

    foreach ($years as $i => $y) {
        $x = $baseX + ($i / (count($years) - 1)) * $chartW;
        imagestring($img, 3, (int)$x - 12, $baseY + 8, $y, $c['black']);
    }

    // Legend
    imageline($img, $w - 160, 55, $w - 130, 55, $c['blue']);
    imagestring($img, 3, $w - 125, 48, 'City A', $c['black']);
    imageline($img, $w - 160, 75, $w - 130, 75, $c['red']);
    imagestring($img, 3, $w - 125, 68, 'City B', $c['black']);
    imageline($img, $w - 160, 95, $w - 130, 95, $c['green']);
    imagestring($img, 3, $w - 125, 88, 'City C', $c['black']);
});

// 5. Pie Chart - Expenditure
createImage('pie-expenditure.png', 'HOUSEHOLD EXPENDITURE BREAKDOWN', function ($img, $w, $h, $c) {
    $slices = [
        ['Housing', 35, $c['blue']],
        ['Food', 25, $c['red']],
        ['Transport', 15, $c['green']],
        ['Education', 12, $c['yellow']],
        ['Other', 13, $c['purple']],
    ];
    $cx = $w / 2 - 60;
    $cy = $h / 2 + 10;
    $r = 160;
    $start = 0;

    foreach ($slices as [$label, $pct, $color]) {
        $end = $start + ($pct / 100) * 360;
        imagefilledarc($img, (int)$cx, (int)$cy, $r * 2, $r * 2, (int)$start, (int)$end, $color, IMG_ARC_PIE);
        $start = $end;
    }

    // Legend
    $ly = 80;
    foreach ($slices as [$label, $pct, $color]) {
        $lx = $w - 200;
        imagefilledrectangle($img, $lx, $ly, $lx + 15, $ly + 15, $color);
        imagestring($img, 3, $lx + 22, $ly + 1, "$label ($pct%)", $c['black']);
        $ly += 25;
    }
});

// 6. Pie Chart - Energy
createImage('pie-energy.png', 'ENERGY SOURCES BY COUNTRY', function ($img, $w, $h, $c) {
    $drawPie = function ($cx, $cy, $r, $data, $label) use ($img, $c) {
        $start = 0;
        foreach ($data as [$pct, $color]) {
            $end = $start + ($pct / 100) * 360;
            imagefilledarc($img, (int)$cx, (int)$cy, $r * 2, $r * 2, (int)$start, (int)$end, $color, IMG_ARC_PIE);
            $start = $end;
        }
        imagestring($img, 4, (int)($cx - strlen($label) * 4.5), (int)($cy + $r + 10), $label, $c['black']);
    };

    $drawPie(160, 260, 90, [[40, $c['blue']], [30, $c['red']], [20, $c['green']], [10, $c['yellow']]], 'Country A');
    $drawPie(400, 260, 90, [[25, $c['blue']], [25, $c['red']], [35, $c['green']], [15, $c['yellow']]], 'Country B');
    $drawPie(640, 260, 90, [[50, $c['blue']], [15, $c['red']], [25, $c['green']], [10, $c['yellow']]], 'Country C');

    // Legend
    $items = [['Coal', $c['blue']], ['Gas', $c['red']], ['Renewable', $c['green']], ['Nuclear', $c['yellow']]];
    $lx = 200;
    foreach ($items as [$label, $color]) {
        imagefilledrectangle($img, $lx, $h - 45, $lx + 12, $h - 33, $color);
        imagestring($img, 3, $lx + 17, $h - 44, $label, $c['black']);
        $lx += 120;
    }
});

// 7. Map - City Centre
createImage('map-city.png', 'CITY CENTRE: BEFORE AND AFTER REDEVELOPMENT', function ($img, $w, $h, $c) {
    $mid = $w / 2;
    imageline($img, (int)$mid, 40, (int)$mid, $h - 20, $c['gray']);

    imagestring($img, 4, (int)$mid / 2 - 25, 45, 'BEFORE', $c['black']);
    imagestring($img, 4, (int)$mid + $mid / 2 - 20, 45, 'AFTER', $c['black']);

    // Before side
    imagefilledrectangle($img, 60, 120, 180, 200, $c['green']);
    imagestring($img, 3, 90, 152, 'Park', $c['black']);
    imagefilledrectangle($img, 200, 120, 350, 200, $c['gray']);
    imagestring($img, 3, 235, 152, 'Factory', $c['black']);
    imagefilledrectangle($img, 60, 230, 180, 310, $c['yellow']);
    imagestring($img, 3, 78, 262, 'Houses', $c['black']);
    imagefilledrectangle($img, 200, 230, 350, 310, $c['blue']);
    imagestring($img, 3, 235, 262, 'School', $c['black']);
    imageline($img, 60, 350, 350, 350, $c['black']);
    imagestring($img, 3, 165, 355, 'Main Road', $c['black']);

    // After side
    $ox = (int)$mid + 20;
    imagefilledrectangle($img, $ox, 120, $ox + 120, 200, $c['green']);
    imagestring($img, 3, $ox + 30, 152, 'Park', $c['black']);
    imagefilledrectangle($img, $ox + 140, 120, $ox + 290, 200, $c['purple']);
    imagestring($img, 3, $ox + 185, 152, 'Mall', $c['black']);
    imagefilledrectangle($img, $ox, 230, $ox + 120, 310, $c['red']);
    imagestring($img, 3, $ox + 18, 262, 'Apartments', $c['black']);
    imagefilledrectangle($img, $ox + 140, 230, $ox + 290, 310, $c['blue']);
    imagestring($img, 3, $ox + 175, 262, 'School', $c['black']);
    imageline($img, $ox, 350, $ox + 290, 350, $c['black']);
    imagestring($img, 3, $ox + 105, 355, 'Main Road', $c['black']);
});

// 8. Process Diagram - Chocolate
createImage('process-chocolate.png', 'CHOCOLATE MANUFACTURING PROCESS', function ($img, $w, $h, $c) {
    $steps = ['Harvest\nCocoa Beans', 'Ferment\n(5-7 days)', 'Dry in\nSunlight', 'Roast\nBeans', 'Grind to\nCocoa Paste', 'Mix with\nSugar/Milk', 'Mould &\nPackage'];
    $boxW = 90;
    $boxH = 55;
    $startX = 40;
    $y = $h / 2 - $boxH / 2;
    $gap = ($w - $startX * 2 - $boxW * count($steps)) / (count($steps) - 1);

    foreach ($steps as $i => $step) {
        $x = (int)($startX + $i * ($boxW + $gap));
        $bgColor = ($i === 0 || $i === count($steps) - 1) ? $c['blue'] : $c['green'];
        $textColor = ($i === 0 || $i === count($steps) - 1) ? $c['white'] : $c['black'];
        imagefilledroundrect($img, $x, (int)$y, $x + $boxW, (int)$y + $boxH, 8, $bgColor);

        $lines = explode("\n", $step);
        foreach ($lines as $li => $line) {
            $tw = strlen($line) * 7;
            imagestring($img, 3, (int)($x + ($boxW - $tw) / 2), (int)$y + 12 + $li * 18, $line, $textColor);
        }

        // Arrow
        if ($i < count($steps) - 1) {
            $ax1 = $x + $boxW + 3;
            $ax2 = (int)($startX + ($i + 1) * ($boxW + $gap)) - 3;
            $ay = (int)$y + $boxH / 2;
            imageline($img, $ax1, $ay, $ax2, $ay, $c['black']);
            imagefilledpolygon($img, [$ax2, $ay, $ax2 - 8, $ay - 5, $ax2 - 8, $ay + 5], $c['black']);
        }
    }

    // Step numbers
    foreach ($steps as $i => $step) {
        $x = (int)($startX + $i * ($boxW + $gap));
        imagestring($img, 2, (int)($x + $boxW / 2 - 5), (int)$y - 18, 'Step ' . ($i + 1), $c['gray']);
    }
});

function imagefilledroundrect($img, $x1, $y1, $x2, $y2, $r, $color)
{
    imagefilledrectangle($img, $x1 + $r, $y1, $x2 - $r, $y2, $color);
    imagefilledrectangle($img, $x1, $y1 + $r, $x2, $y2 - $r, $color);
    imagefilledellipse($img, $x1 + $r, $y1 + $r, $r * 2, $r * 2, $color);
    imagefilledellipse($img, $x2 - $r, $y1 + $r, $r * 2, $r * 2, $color);
    imagefilledellipse($img, $x1 + $r, $y2 - $r, $r * 2, $r * 2, $color);
    imagefilledellipse($img, $x2 - $r, $y2 - $r, $r * 2, $r * 2, $color);
}

echo "\nDone! 8 images generated.\n";
