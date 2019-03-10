<?php

include "pgsql.php";
include "fizmasoft.php";

$db = new DB("localhost", "gis_new", "postgres", "postgres");
$db->open();
$db->encode("utf8");

$fs = new Fizmasoft();

?>