<?php

include "pgsql.php";
include "fizmasoft.php";

$db = new DB("101.1.0.1", "gis_new", "postgres", "postgres");
$db->open();
$db->encode("utf8");

$fs = new Fizmasoft();

?>