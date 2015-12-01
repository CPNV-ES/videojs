<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Video JS</title>
		<meta name="viewport" content="width=device-width,initial-scale=1.0">
		<link href="css/style.css" rel="stylesheet">
		<script src="js/modernizr.custom.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style1.css" />
		<link rel="stylesheet" type="text/css" href="fonts/font-awesome-4.3.0/css/font-awesome.min.css" />


	</head>
	<body>
		<div id="maxwidth">
			<header id="header" class="cl-effect-1">
				<img id="logo" src="img/logo.png">
				<a class="linkheader" href="#">A propos </a>
				<a class="linkheader" href="#">Mettre à jour</a>
				<a class="linkheader search" href="#">Rechercher &#8628;
					<div id="search">
						<form>
							<label><p>Nom du film: <input></p></label>
							<label><p>Réalisateur : <input></p></label>
							<label><p>Genre : <input name="genre" id="listgenre" list="genre"></p>
								<datalist id="genre">
									<select>
										<option value="Action">Action</option>
										<option value="Animé">Animé</option>
										<option value="Fantastique">Fantastique</option>
										<option value="Western">Western</option>
									</select>
								</datalist>
							</label>
							<label><button type="submit">Envoyer</button></label>
						</form>
					</div>
				</a>
			</header>
		<!--	<section id="content">-->
		<div class="container">
		<div id="theSidebar" class="sidebar">
			<?php

			$json_url = "data/data.json";
			$json = file_get_contents($json_url);
			$films = json_decode($json, TRUE);

			?>
		</div>
				<div id="theGrid" class="main">
						<section class="grid">
								<?php
								// on parcours le tableau
								foreach ($films['film'] as $key=>$val) {
									?>
									<a class="grid__item" href="#">
										<?php
										if($val['info']){
											// si le film est existant
											?>
											<img class="film-img" src="https://image.tmdb.org/t/p/w396<?php echo $val['info']['poster_path'];?>">
											<h2 class="title title--preview"><?php echo $val['info']['original_title'];?></h2>
											<div class="loader"></div>
											<span class="category"><?php echo $val['info']['release_date'];?></span>
											<!--<div class="meta meta--preview">
												<img class="meta__avatar" src="img/authors/1.png" alt="author01" />
												<span class="meta__date"><i class="fa fa-calendar-o"></i> 9 Apr</span>
												<span class="meta__reading-time"><i class="fa fa-clock-o"></i> 3 min read</span>
											</div>-->
											<?php
										}else{
											// si le film n'existe pas
											?>
											<img class="film-img" src="img/noposter.png">
											<h2 class="title title--preview">Film non-identifié</h2>
											<div class="loader"></div>
											<span class="category">Aucune info</span>
											<!--<div class="meta meta--preview">
												<img class="meta__avatar" src="img/authors/1.png" alt="author01" />
												<span class="meta__date"><i class="fa fa-calendar-o"></i> 9 Apr</span>
												<span class="meta__reading-time"><i class="fa fa-clock-o"></i> 3 min read</span>
											</div>-->
											<?php
										}
										?>
									</a>
									<?php
								}
							?>
						</section>
					</section>
					<section class="content">
						<div class="scroll-wrap">
							<?php
							// boulce contenu détail
								foreach ($films['film'] as $key=>$val) {

										if($val['info']){
										// si le film est existant
										?>
										<article class="content__item">
											<div class="w25">
											<img src="https://image.tmdb.org/t/p/w396<?php echo $val['info']['poster_path'];?>">
											</div>
											<div class="w75">
												<h2 class="title title--full"><?php echo $val['info']['original_title'];?></h2>
												<div class="note">
													<span class="star">
														<span class="star-blue" style="width:<?php echo $val['info']['vote_average']*140/10;?>px;"></span>
													</span>
													<p class="small"> <?php echo $val['info']['vote_average'];?>/10 sur  <?php echo $val['info']['vote_count'];?> votes</p>
											</div>
												<!--<div class="meta meta--full">
													<img class="meta__avatar" src="img/authors/1.png" alt="author01" />
													<span class="meta__author">Matthew Walters</span>
													<span class="meta__date"><i class="fa fa-calendar-o"></i> 9 Apr</span>
													<span class="meta__reading-time"><i class="fa fa-clock-o"></i> 3 min read</span>
												</div>-->
												<p><?php echo $val['info']['overview'];?></p>
												<div class="w50 info_film">
													<h4>Informations</h4>

													<p><i class="fa fa-clock-o"></i> Durée : <?php echo $val['info']['runtime'];?> minutes</p>
													<p><i class="fa fa-money"></i> Chiffre d'affaires : <?php  echo "$ ".number_format($val['info']['revenue'],0);?></p>
													<p><i class="fa fa-money"></i> Budget : <?php echo "$ ".number_format($val['info']['budget'],0);?></p>

												</div>
												<div class="w50 info_film">
													<h4>Genre</h4>
													<?php
													foreach ($val['info']['genres'] as $key=>$genre) {
														echo "<p><i class=\"fa fa-angle-right\"></i> ".$genre['name']."</p>";
													}
													?>
												</div>
												<div class="w50 info_film">
													<h4>Production</h4>
													<?php
													foreach ($val['info']['production_companies'] as $key=>$prod) {
														echo "<p><i class=\"fa fa-angle-right\"></i> ".$prod['name']."</p>";
													}
													?>

												</div>

												<div class="w50 info_film">

													<h4>Pays producteurs</h4>
													<?php
													foreach ($val['info']['production_countries'] as $key=>$prod_pays) {
														echo "<p><i class=\"fa fa-angle-right\"></i> ".$prod_pays['name']."</p>";
													}
													?>
												</div>

											</div>
										</article>
									<?php
								}else{
									// si le film n'existe pas
									?>
									<article class="content__item">
										<h2 class="title title--full">Film non identifié</h2>
										<!--<div class="meta meta--full">
											<img class="meta__avatar" src="img/authors/1.png" alt="author01" />
											<span class="meta__author">Matthew Walters</span>
											<span class="meta__date"><i class="fa fa-calendar-o"></i> 9 Apr</span>
											<span class="meta__reading-time"><i class="fa fa-clock-o"></i> 3 min read</span>
										</div>-->
										<p>Nom du fichier : <?php echo $val['file'];?></p>
									</article>
									<?php
									}
							}
							?>
					</div>
					<button class="close-button"><i class="fa fa-close"></i><span>Close</span></button>
				</section>
				</div>
			</div>
		</div>
			<!--</section>-->
			<footer id="footer"></footer>
		</div>
	<script src="js/classie.js"></script>
	<script src="js/main.js"></script>
	</body>
</html>
