<!DOCTYPE html>
<html>
<head>
	<title>PhantomJS webserver example</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style type="text/css">
		body{margin:0;font-family:Helvetica,Arial,sans-serif;overflow-x:hidden}form{background:#f5f5f5;padding:1em;margin:0}div{padding:0 1em}p{font-size:.75em;margin:.5em 0}input{margin-right:0;background:#fff;font-size:1.3em;border:0;border-left:3px solid #08f;padding:.5em;display:inline-block;max-width:80%}a{color:#08f;text-decoration:none}hr{margin:0;border:2px solid #eee;clear:both}img{box-shadow:0 0 3px #aaa;border-radius:2px;max-width:50%}h2{font-size:1.3em;font-weight:400}span{color:#ccc}img{float:left;margin-bottom:2em}.meta{}.meta h2{margin:0}ul{margin:0;padding:0;margin-bottom:2em}li{list-style:none;margin-top:.5em}@media (max-width:700px){img{margin-bottom:0}.meta,img{max-width:100%;padding:1em 0}.gihub{display:none;}}
	</style>
</head>
<body>
<a class="gihub" href="https://github.com/benfoxall/phantomjs-webserver-example/"><img style="position: absolute; top: 0; right: 0; border: 0;box-shadow:none" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
	<form method="post">
		<p>
			Phantomjs webserver example - 
			<a href="https://github.com/benfoxall/phantomjs-webserver-example/">source on github</a>
		</p>
		<input type="url" name="url" value="http://phantomjs.org/" size="70" required tabindex=1>
		<input type="submit" value="&raquo;">
	</form>

	<script id="query-template" type="text/x-handlebars-template">

		<h2>POST / <span>?{{#each params}}{{name}}={{value}}{{/each}}</span></h2>

		<div class="meta">
			{{#each items}}
				{{#if title}}
					<h2>{{id}}: {{title}}</h2>
				{{/if}}
			{{/each}}
		</div>
		</hr>

	</script>


	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min.js"></script>
	<script type="text/javascript">

		var template = Handlebars.compile($("#query-template").html());

		// gotcha - mongoose doesn't like a trailing 'utf8' on the content type
		$.ajaxSetup({contentType:'application/x-www-form-urlencoded'});


		$('form').on('submit', function(e){
			e.preventDefault();
			var $form = $(this);
			var params = $form.serializeArray();

			var data = {params:params};
			var $el = $('<div>').insertAfter($form);
			$el.html(template(data));

			$.post('', params)
			.then(function(response){

				// json and image split to lines (FF doesn't like image uris in json)
				var parts = response.split("\n");
				data.items = $.parseJSON(parts[0]);

				$el.html(template(data));

				// if(chartsLoaded){

				// 	data.meta.link_areas.unshift(['URL', 'Area'])

				// 	var datatable = google.visualization.arrayToDataTable(data.meta.link_areas);

				// 	var options = {
				// 		title:"Links by area",
				// 		legend:{position:'none'},
				// 		pieSliceText:'none'
				// 	};

				// 	var chart = new google.visualization.PieChart($el.find('.pie-chart').get(0));
				// 	chart.draw(datatable, options);

				// }

			})
		});

		$(document).on('click','div a', function(e){
			e.preventDefault();
			$('input[name=url]').val(this.href).submit();
			$('body').animate({scrollTop:0});
		});
	</script>


	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
    	var chartsLoaded;
		google.load("visualization", "1", {packages:["corechart"]});
		google.setOnLoadCallback(function(){
			chartsLoaded = true;
		});
    </script>
</body>
</html>