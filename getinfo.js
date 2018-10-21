const fs = require('fs');

var https = require('https');

var options = []

let interests = {
	'Agriculture' : 						'2016.academics.program.bachelors.agriculture',
	'Conservation' : 						'2016.academics.program.bachelors.resources',
	'Architecture' : 						'2016.academics.program.bachelors.architecture',
	'Gender Studies' : 						'2016.academics.program.bachelors.ethnic_cultural_gender',
	'Communication/Journalism' : 			'2016.academics.program.bachelors.communication',
	'Communications Technologies' : 		'2016.academics.program.bachelors.communications_technology',
	'Computer Science' : 					'2016.academics.program.bachelors.computer',
	'Culinary Services' : 					'2016.academics.program.bachelors.personal_culinary',
	'Education' : 							'2016.academics.program.bachelors.education',
	'Engineering' : 						'2016.academics.program.bachelors.engineering',
	'Linguistics/Foreign Languages' : 		'2016.academics.program.bachelors.language',
	'Human Sciences' : 						'2016.academics.program.bachelors.family_consumer_science',
	'Legal Studies' : 						'2016.academics.program.bachelors.legal',
	'English Language and Literature' : 	'2016.academics.program.bachelors.english',
	'Liberal Arts' : 						'2016.academics.program.bachelors.humanities',
	'Library Science' : 					'2016.academics.program.bachelors.library',
	'Biology/Biomedical Studies' : 			'2016.academics.program.bachelors.biological',
	'Math/Statistics' : 					'2016.academics.program.bachelors.mathematics',
	'Interdisciplinary Studies' : 			'2016.academics.program.bachelors.multidiscipline',
	'Parks, Recreation, & Fitness' : 		'2016.academics.program.bachelors.history',
	'Philosophy/Religion' : 				'2016.academics.program.bachelors.philosophy_religious',
	'Theology/Vocation' : 					'2016.academics.program.bachelors.theology_religious_vocation',
	'Physical Sciences' : 					'2016.academics.program.bachelors.physical_science',
	'Psychology' : 							'2016.academics.program.bachelors.psychology',
	'Law Enforcement/Firefighting' : 		'2016.academics.program.bachelors.security_law_enforcement',
	'Public Administration/Social Service': '2016.academics.program.bachelors.public_administration_social_service',
	'Social Sciences' : 					'2016.academics.program.bachelors.social_science',
	'Construction'					: 		'2016.academics.program.bachelors.construction',
	'Mechanic/Repair Technologies' : 		'2016.academics.program.bachelors.mechanic_repair_technology',
	'Visual and Performing Arts' :  		'2016.academics.program.bachelors.visual_performing',
	'Health Professions' : 					'2016.academics.program.bachelors.health',
	'Business, Marketing' : 				'2016.academics.program.bachelors.business_marketing',
	'History' : 							'2016.academics.program.bachelors.history'
};

var ACTScore = 25;
var SATScore = 1500;
var interest = '2016.academics.program.bachelors.history';

/*interestPairs = Object.entries(interests).forEach(function(interest){
	if(interest == interestPairs[i][0]){
		interest = interestPairs[i][1];
		console.log(interest);
	}
})

for(i of interestPairs){
	console.log(interestPairs[i]);
}*/


var request = https.get('https://api.data.gov/ed/collegescorecard/v1/schools.json?2016.admissions.sat_scores.average.overall__range=1..'+String(SATScore)+'&2016.admissions.act_scores.midpoint.cumulative__range=1..'+String(ACTScore)+'&'+interest+'=1&_fields=id,school.name,school.school_url,school.price_calculator_url,2016.admissions.admission_rate.overall,2016.admissions.sat_scores.average.overall,2016.admissions.act_scores.midpoint.cumulative,location.lat,location.lon,'+interest+'&_page=0&api_key=CLrEDVd3e6xkedC7yXINFXON3DnI1NnwSrUdA8qU', function(res) {
	//var schoolInfo = '';
	res.on('data', function(data) {
		fs.appendFile('schoolInfo.json', data, (err)=> {
			if (err){
				throw err;
			}
			let schoolInfo = JSON.parse(data);
			if(schoolInfo.metadata.total > 20){
				let pages = (schoolInfo.metadata.total / schoolInfo.metadata.per_page) + 1;
				getAllPages(0,pages);
			}
		});
	});

	res.on('end', function () {
		console.log('completed');
	});



	console.log('whats up');
}).on("error", (err) => {
	console.log('error');
})
request.end();

function getAllPages(page, pages){
	var request = https.get('https://api.data.gov/ed/collegescorecard/v1/schools.json?'+interest+'=1&2016.admissions.sat_scores.average.overall__range=1..'+String(SATScore)+'&2016.admissions.act_scores.midpoint.cumulative__range=1..'+String(ACTScore)+'&_fields=id,school.name,school.school_url,school.price_calculator_url,2016.admissions.admission_rate.overall,2016.admissions.sat_scores.average.overall,2016.admissions.act_scores.midpoint.cumulative,location.lat,location.lon,&_page='+String(page)+'&api_key=CLrEDVd3e6xkedC7yXINFXON3DnI1NnwSrUdA8qU', function(res) {
	//var schoolInfo = '';
	res.on('data', function(data) {
		fs.appendFile('schoolInfo.json', data, (err)=> {
			if (err){
				throw err;
			}
		});
	});

	res.on('end', function () {
		console.log('completed');
	});



	console.log('whats up');
	}).on("error", (err) => {
		console.log('error');
	})
	request.end();
	if(page<pages){
		setTimeout( ()=>{
			getAllPages(page+1,pages);

		},300);
	}
}

