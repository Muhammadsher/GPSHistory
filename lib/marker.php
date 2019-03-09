<?php
header('Content-Type: image/png');

if(!function_exists('imagepalettetotruecolor'))
{
    function imagepalettetotruecolor(&$src)
    {
        if(imageistruecolor($src))
        {
            return(true);
        }

        $dst = imagecreatetruecolor(imagesx($src), imagesy($src));

        imagecopy($dst, $src, 0, 0, 0, 0, imagesx($src), imagesy($src));
        imagedestroy($src);

        $src = $dst;

        return(true);
    }
}

function hex2RGB($hex) 
{
        preg_match("/^#{0,1}([0-9a-f]{1,6})$/i",$hex,$match);
        if(!isset($match[1]))
            return false;

        switch (strlen($match[1])) {
        	case 6:
        		list($r, $g, $b) = array($hex[0].$hex[1],$hex[2].$hex[3],$hex[4].$hex[5]);
        		break;
        	case 3:
        		list($r, $g, $b) = array($hex[0].$hex[0],$hex[1].$hex[1],$hex[2].$hex[2]);
        		break;
        	case 2:
        		list($r, $g, $b) = array($hex[0].$hex[1],$hex[0].$hex[1],$hex[0].$hex[1]);
        		break;
        	case 1:
        		list($r, $g, $b) = array($hex.$hex,$hex.$hex,$hex.$hex);
        		break;
        	
        	default:
        		return false;
        		break;
        }

        $color = array();
        $color[] = hexdec($r);
        $color[] = hexdec($g);
        $color[] = hexdec($b);

        return $color;
}

if (isset($_GET["color"])) {

	if (!isset($_GET["size"])) $_GET["size"] = "x";

	$rgb = hex2RGB($_GET["color"]);

	$file="../images/markers-".$_GET["size"].".png";
	
	$im = imagecreatefrompng($file);

	imagepalettetotruecolor($im);

	for ($x = 0; $x < imagesx($im); $x++) {
	   for ($y = 0; $y < imagesy($im); $y++) {
	      $col=imagecolorat($im,$x,$y);
	      $alpha = ($col & 0x7F000000) >> 24;
	      $repl=imagecolorallocatealpha($im, $rgb[0], $rgb[1], $rgb[2], $alpha);
	      imagesetpixel($im,$x,$y,$repl); 
	   }
	}
	
	imagesavealpha( $im, true );
	imagepng($im);
	imagedestroy($im);
}
?>