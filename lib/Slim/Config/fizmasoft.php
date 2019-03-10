<?php

class Fizmasoft 
{
	private $cyr;
	private $lat;

    public function __construct()
    {
        $this->cyr = array(
	        'а','б','в','г','ғ','д','е','ё','ж','з','и','й','к','қ','л','м','н','о','п',
	        'р','с','т','у','ў','ф','х','ҳ','ц','ч','ш','щ','ъ','ы','ь','э','ю','я',

	        'А','Б','В','Г','Ғ','Д','Е','Ё','Ж','З','И','Й','К','Қ','Л','М','Н','О','П',
	        'Р','С','Т','У','Ў','Ф','Х','Ҳ','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я'
	    );

        $this->lat = array(
	        'a','b','v','g','g','d','e','io','zh','z','i','y','k','q','l','m','n','o','p',
	        'r','s','t','u','o','f','x','h','ts','ch','sh','sht','a','i','y','e','yu','ya',

	        'a','b','v','g','g','d','e','io','zh','z','i','y','k','q','l','m','n','o','p',
	        'r','s','t','u','o','f','x','h','ts','ch','sh','sht','a','i','y','e','yu','ya',
	    );
    }

    public function translit($value) {
    	return preg_replace("/[^\w]+/", "", str_replace($this->cyr, $this->lat, $value));
    }
}

?>