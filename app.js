const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const People = require('./people');
const fs = require('fs');
const csvtojson = require('csvtojson');
const convertApi = require('convertapi')('WVtafgw805hwjkhQ');
const cors = require('cors');

const PORT = 3001;
const app = express();

app.use(express.static('public'));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', './views');

/* Handle file input for excel format */
var excelStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/excelUploads');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

var excelUploads = multer({
	storage: excelStorage
});


/* Send excel spreadsheets to database */
app.post('/uploadExcelFile', excelUploads.single('uploadFile'), (req, res) => {

	const importFile = (xlxsPath) => {
		var csvFileName;
		var csvUploadsPath = `${__dirname}/public/csvUploads`;

		/* Pass CSV files to database */
		const writeToDB = () => {
			csvtojson().fromFile(`${csvUploadsPath}/${csvFileName}`)
			.then(source => {
				source.map((person) => {	
					const personData = new People({
						id_number: person.id_number,
						record_number: person.record_number,
						name: person.name,
						cpf_rg: person.cpf_rg,
						nis: person.nis,
						phone: person.phone,
						neighborhood: person.neighborhood
					})

					personData.save();
					console.log('----------------------------')
					console.log(`Inserting ${person.name} to database.`);
					console.log('----------------------------')

				})
				console.log('----------------------------')
				console.log(`=== ${source[0].neighborhood} inserted ===`)
				console.log('Data saved')
			})
		}

		/* Convert XLSX into CSV */
		convertApi.convert('csv', {
			File: xlxsPath
		}, 'xlsx')
			.then((result) => {
				console.log('xlsx converted to csv')
				csvFileName = result.response.Files[0].FileName;
				result.file.save(csvUploadsPath)
				setTimeout(() => {
					writeToDB();
				}, 1500)
		});
	}

	importFile('./public' + '/excelUploads/' + req.file.filename);

	res.redirect('/');
})

/* Render ejs page for excel file input */
app.get('/', (req, res) => {
	res.render('index');
})

app.get('/getPeople', (req, res) => {
	People.find()
		.then((result) => {



		})
		.catch((err) => {throw err})
})

/* Get duplicated people on database */
var duplicatedPeople = [];
app.get('/getRepeatedNames', (req, res) => {

	const firstArrayOfNames = []; // Store people's data for checking
	var duplicatedCounter = 0; // Amount of duplicates

	People.find()
		.then((result) => {
			// Remove blank data
			const realPeople = [];
			realPeople.push(result.filter((person) => {
				return person.name.length > 0;
			}))

			realPeople[0].map((eachPerson) => {

				// Enhanced data
				var enhancedName = eachPerson.name.toLowerCase();
				var enhancedCpfRg = eachPerson.cpf_rg.replace(/[^a-z0-9]/gi, '')
				var enhancedNis = eachPerson.nis.replace(/[^a-z0-9]/gi, '')
				var enhancedPhone = eachPerson.phone.replace(/[^a-z0-9]/gi, '')

				// Push db data into array
				firstArrayOfNames.push({
					id: eachPerson._id,
					name: enhancedName,
					neighborhood: eachPerson.neighborhood,
					phone: enhancedPhone,
					nis: enhancedNis,
					cpf_rg: enhancedCpfRg
				});

				// Check for duplicates
				
				firstArrayOfNames.map((eachArrayPerson) => {
					if (eachArrayPerson.name === enhancedName && eachArrayPerson.id != eachPerson._id && eachArrayPerson.cpf_rg === enhancedCpfRg){

						console.log('------------------------------------')
						console.log(`O beneficiado`)
						console.log(`ID: ${eachArrayPerson.id}\nNome: ${eachArrayPerson.name}\nBairro: ${eachArrayPerson.neighborhood}\nNIS: ${eachArrayPerson.nis}\nCPF: ${eachArrayPerson.cpf_rg}\n`)
						console.log(`É o mesmo que`)
						console.log(`ID: ${eachPerson.id}\nNome: ${enhancedName}\nBairro: ${eachPerson.neighborhood}\nNIS: ${enhancedNis}\nCPF: ${enhancedCpfRg}\n`)
						console.log('------------------------------------')


						

						++duplicatedCounter;
						duplicatedPeople.push({
							name: eachArrayPerson.name,
							neighborhood: eachArrayPerson.neighborhood,
							nis: eachArrayPerson.nis,
							cpf_rg: eachArrayPerson.cpf_rg
						})
					}
				})
			})
		})
		.catch((err) => {throw err})
})



app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	
	// Connect to MongoDB Database
	mongoose.connect('mongodb://localhost:27017/People')
	.then(() => {
		console.log('Database is connected')
	});
});