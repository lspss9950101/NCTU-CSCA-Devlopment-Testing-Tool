var express = require('express');
var app = express();
var path = require('path');
var axios = require('axios');
var {exec} = require('child_process');

app.use(express.json());
app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname));

app.get('/', (req, res)=>{
	let option = {
		root: path.resolve('dist'),
	}
	res.sendFile("index.html", option);
});

var port = parseInt(process.argv[2]);

var token = '';

const fetchXSRFToken = (req, res) => {
	let method = req.body.method;
	let domain = req.body.domain;
	let url = req.body.url;
	let headers = req.body.headers;
	let body = req.body.body;
	let response = {};
	
	let XSRFUrl = domain;
	
	let options = {
		url: XSRFUrl,
		method: 'GET',
		headers: {
			'Cookie' : headers.Cookie
		}
	};
	
	axios(options)
	.then((res) => {
		let headers = res.headers;
	//	console.log(headers['set-cookie'][0]);
		token = headers['set-cookie'][0];
//		console.log(token);
		token = token.substr(11, token.length - 19);
		console.log('XSRF-token : ' + token);
	})
	.catch((err)=>{
		console.log(err);
	})
	.then(()=>{
		headers = JSONAppend(headers, 'X-XSRF-TOKEN', token);
	
		let options;
		
		if(method == 'POST'){		
			options = {
				url: domain + url,
				method: method,
				headers: headers,
				data: JSON.parse(body)
			};
			console.log('Body' + JSON.stringify(options.data));
		}else{
			options = {
				url: domain + url,
				method: method,
				headers: headers
			};
		}
	
		axios(options)
		.then((res_a)=>{
			//console.log('[Response]' + res_a.data);
			response = {response: res_a.data};
		})
		.catch((err)=>{
			response = {status: 'error'};
			console.log(err);
		})
		.then(()=>{
			response = {response: response.response, status:'ok'};
			res.json(response);
			res.end();
		})
		.catch((err)=>{
			console.log(err);
		});
	})
	.catch((err)=>{
		console.log(err);
	});
}

const JSONAppend = (json, key, val) => {
	let jsonStr = JSON.stringify(json);
	jsonStr = jsonStr.substr(1, jsonStr.length - 2);
	jsonStr += (',\"' + key + '\":\"' + val + '\"');
	//console.log(jsonStr);
	let resultJson = JSON.parse('{' + jsonStr + '}');
	return resultJson;
}

app.post('/', (req, res)=>{
	//console.log('req.body = ' + body);
	fetchXSRFToken(req, res);
});

app.listen(process.env.PORT || parseInt(port), ()=>{
	console.log('Listening port ' + port + '.');
	exec('cmd /c start http://localhost:' + port, (err, stdout, stderr) => {
		if(err)return;
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
	});
});