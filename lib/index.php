<?php
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';
require 'Slim/Config/conf.php';

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();
/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, `Slim::patch`, and `Slim::delete`
 * is an anonymous function.
 */

$app->response->headers->set('Access-Control-Allow-Origin', '*');
$app->response->headers->set('Content-Type', 'application/json');
$app->response->headers->set('charset', 'utf-8');

$app->get('/history/devices', function() use ($app, $db, $fs) {
	$json = $db->json("SELECT devices.uid, devices.gid, devices.display_name, devices.description, devices.limit_speed, groups.gname, uzbekistan.name FROM devices JOIN groups ON devices.gid = groups.uid JOIN uzbekistan ON devices.reg_id = uzbekistan.id ORDER BY devices.gid ASC, uzbekistan.sort ASC, devices.uid ASC");
	$app->response->write($json);
});

$app->post('/history/export', function() use ($app, $db, $fs) {
	$data = json_decode($app->request->getBody());
	$data->devices = implode(", ", $data->devices);

	$db->query("SELECT l.did, d.display_name, min(date_time) as minDate, max(date_time) as maxDate, (SELECT coalesce(round((gds_length(ST_MakeLine(coordinate)) / 1000)::numeric, 2), 0) as distance from log_data lm WHERE date_time between '{$data->date->start}' AND '{$data->date->end}' AND did = l.did) FROM log_data l INNER JOIN devices d ON l.did = d.uid WHERE date_time between '{$data->date->start}' AND '{$data->date->end}' AND l.did IN ({$data->devices}) GROUP BY l.did, d.display_name ORDER BY did;");

	$data = $db->fetchAll();
	$app->response->write(json_encode($data));

});

$app->post('/history/devices', function() use ($app, $db, $fs) {
	$data = json_decode($app->request->getBody());
	$data->devices = implode(", ", $data->devices);

	$q = "SELECT json_agg(fc.*) as data FROM (SELECT 
			'Feature' as type,
			did as device_id,
			(SELECT device_icon FROM devices WHERE uid = did LIMIT 1),
			(SELECT display_name as name FROM devices WHERE uid = did LIMIT 1),
			(SELECT row_to_json(d.*) as prop FROM (SELECT groups.gname, device_key, to_char(life_time, 'YYYY-MM-DD HH24:MI:SS') as life_time, description FROM devices JOIN groups ON devices.gid = groups.uid WHERE devices.uid = did LIMIT 1) d),
			ST_AsGeoJson(ST_Transform(ST_Multi(ST_MakeLine(log_data.coordinate)), 4326))::json AS geometry,
			row_to_json((SELECT l.*::record AS l FROM (
				SELECT
					json_agg(log_data.speed) as speed, 
					json_agg(EXTRACT(EPOCH FROM log_data.date_time) * 1000) as time,
					json_object(array['color'], array[concat('#',to_hex((random()*10000000)::integer))]) as path_option
				) l)) as properties
			FROM public.log_data WHERE date_time BETWEEN '{$data->date->start}' AND '{$data->date->end}' AND did IN ({$data->devices}) GROUP BY did) fc;";
			 
			 
	$db->query($q);
			
	$data = $db->fetchAssoc();

	if (isset($data["data"]))
		$app->response->write($data["data"]);
	else
		$app->response->write('[]');

});

$app->run();