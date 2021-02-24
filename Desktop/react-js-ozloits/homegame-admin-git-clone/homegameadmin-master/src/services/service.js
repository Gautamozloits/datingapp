import Cookies from 'universal-cookie';
const Global = require('../constants/Global');
const cookies = new Cookies();

export const service = (api, type, data) => {
	try {
		return fetch(
			Global.API_ENDPOINT + api,
			{
				method: type,
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			}
		).then((response) => response.json())
			.then((responseJson) => {
				//console.log(responseJson)
				return responseJson;
			}).catch((error) => {
				console.log(error)
				return error;
			});
	} catch (errors) {
		console.log(errors);
		return errors;
	}

}

export const getData = (api, access_token) => {
	try {
		return fetch(
			Global.API_ENDPOINT + api,
			{
				method: 'GET',
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					'Authorization': 'Bearer ' + access_token
				},
			}
		).then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson)
				return responseJson;
			}).catch((error) => {
				console.log(error)
				return error;
			});
	} catch (errors) {
		console.log(errors);
		return errors;
	}

}

export const searchAddress = (keyword) => {
	try {
		var api = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + keyword + '&location=22.67777%2C75.8777&radius=10000&key=AIzaSyCzFTTDKuOmoRIYEUVLfVwEHAnidtBJghA'
		return fetch(
			api,
			{
				method: 'GET',
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					//'Authorization': 'Bearer '+access_token
				},
			}
		).then((response) => response.json())
			.then((responseJson) => {
				//console.log(responseJson)
				return responseJson;
			}).catch((error) => {
				console.log(error)
				return error;
			});
	} catch (errors) {
		console.log(errors);
		return errors;
	}

}


export const postData = (api, data) => {
	let accessToken = getToken();
	console.log(accessToken)
	try {
		return fetch(
			Global.API_ENDPOINT + api,
			{
				method: 'POST',
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					'authorization': accessToken
				},
				body: JSON.stringify(data)
			}
		).then((response) => response.json())
			.then((responseJson) => {
				//console.log(responseJson)
				return responseJson;
			}).catch((error) => {
				console.log(error)
				return error;
			});
	} catch (errors) {
		console.log(errors);
		return errors;
	}

}
export const postDataWithFile = (api, data) => {
	let accessToken = getToken();
	console.log(accessToken)
	try {
		return fetch(
			Global.API_ENDPOINT + api,
			{
				method: 'POST',
				headers: {
					//"Accept": "application/json",
					// 'content-type': 'multipart/form-data',
					'authorization': accessToken
				},
				body: data
			}
		).then((response) => response.json())
			.then((responseJson) => {
				//console.log(responseJson)
				return responseJson;
			}).catch((error) => {
				console.log(error)
				return error;
			});
	} catch (errors) {
		console.log(errors);
		return errors;
	}

}
export const postWithFile = (api, data, access_token) => {
	try {
		console.log('access_token: ', data)
		return fetch(
			Global.API_ENDPOINT + api,
			{
				method: 'POST',
				headers: {
					"Accept": "application/json",
					'Content-Type': 'multipart/form-data',
					'Authorization': 'Bearer ' + access_token
				},
				body: data
			}
		).then((response) => response.json())
			.then((responseJson) => {
				//console.log(responseJson)
				return responseJson;
			}).catch((error) => {
				console.log(error)
				return error;
			});
	} catch (errors) {
		console.log(errors);
		return errors;
	}

}

export const getUser = () => {
	let user = cookies.get('user');
	return user;
}

export const getToken = () => {
	let user = cookies.get('user');
	if (user) {
		return user.token;
	} else {
		return false;
	}

}

export const isLoggedIn = () => {
	let checkLogin = cookies.get('isLoggedIn');
	return checkLogin;
}

export const setUserSession = (user) => {
	cookies.set('user', user)
	cookies.set('isLoggedIn', true)
	return true;

}