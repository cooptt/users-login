
const Analizer = require("./analizer/analizer").Analizer;
const request = require('request');


class IntegrationTests {

	testLoadCatalogueFromFolders(){
		
		let analizerResult = new Analizer();

		analizerResult.addVideoGame("animal crossing eds juego compra disponible","3DS/animal_crossing_eds_juego_compra_disponible.png");
		analizerResult.addVideoGame("fifa soccer 2016 u.e ps3 -","PS3/fifa_soccer_2016_u.e_ps3_-.png");
		analizerResult.addVideoGame("","PS4/.png");
		analizerResult.addVideoGame("crash bandicoot n. sane trilogy","SWITCH/crash_bandicoot_n._sane_trilogy.png");
		analizerResult.addVideoGame("angry birds trilogy -","WiiU/angry_birds_trilogy_-.png");
		analizerResult.addVideoGame("far cry","XBOX360/far_cry.png");
		analizerResult.addVideoGame("assassins creed odyssey gold edition","XBOXONE/assassins_creed_odyssey_gold_edition.png");

		let correctAnswer = Array.from(analizerResult._catalogue._map.values()).sort(function(a, b){
			return a.getTitle() > b.getTitle();
		});

		let analizerTest = new Analizer();

		analizerTest.loadCatalogueFromFolders("analizer/catalogue/");

		setTimeout(
			function() {

				if(analizerResult.getCatalogueSize() !== analizerTest.getCatalogueSize()){
					console.log("testLoadCatalogue : Different sizes", false);
					return;
				}

				let testAnswer = Array.from(analizerTest._catalogue._map.values()).sort(function(a, b){
					return a.getTitle() > b.getTitle();
				});


				for(let i = 0; i < analizerResult.getCatalogueSize(); i++){
					let gameA = correctAnswer[i];
					let gameB = testAnswer[i];

					if(gameA._title !== gameB._title || gameA._image !== gameB._image){
						console.log("testLoadCatalogue : Different games", false);
						return;
					}
				}


				//console.log("testLoadCatalogue :", true);

			}, 1000);
	}

	testLogin(){
		let options = {
			method : 'POST',
			url : 'http://localhost:8080/signin',
			headers: { 
				'User-Agent':'Mozilla/5.0',
				'authorization' : 'abcdef' }
		}

		request(options, (err, res, body) => {
			if( err ){
				throw err;
			} else{
				let json = JSON.parse(body);
				console.log(json);
			}
		});
	}

	
	testPOST(rsc, body){
		let options = {
			method : 'POST',
			url : 'http://localhost:8080' + rsc  ,
			form : body,
			headers: { 
				'User-Agent':'Mozilla/5.0',
				'authorization' : 'abcdef' }
		}

		request(options, (err, res, body) => {
			if( err ){
				throw err;
			} else{
				let json = JSON.parse(body);
				console.log(json);
			}
		});
	}



	testGET(rsc){
		let options = {
			method : 'GET',
			url : 'http://localhost:8080' + rsc  ,
			headers: { 
				'User-Agent':'Mozilla/5.0',
				'authorization' : 'abcdef' }
		}

		request(options, (err, res, body) => {
			if( err ){
				throw err;
			} else{
				let json = JSON.parse(body);
				console.log(json);
			}
		});
	}


	testGetUserProperties(){
		this.testGET('/getUserProperties');
	}

	testGetCatalogue(){
		this.testGET('/getCatalogue');
	}

	testAddSellOffer(){
		let rsc = '/addSellOffer'
		let body = {
			videoGameId:0,
			price:500,
		}
		this.testPOST(rsc, body);
	}	




	runAllTests(){
		console.log("IntegrationTest started ...");
		//this.testLoadCatalogueFromFolders();
		this.testLogin();
		this.testGetUserProperties();
		this.testGetCatalogue();
		this.testAddSellOffer();
	}

}

exports.IntegrationTests = IntegrationTests;