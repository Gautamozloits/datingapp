import Cookies from 'universal-cookie';
const Global = require('../constants/Global');
const cookies = new Cookies();

export const postData = (api, data, access_token = '') => {

    try {
        return fetch(
            Global.API_ENDPOINT + api,
            {
                method: 'POST',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + access_token
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



export const isLoggedIn = () => {
    let checkLogin = cookies.get('isLoggedIn');
    return checkLogin;
}

export const setUserSession = (user) => {
    cookies.set('user', user)
    cookies.set('isLoggedIn', true)
    return true;
}

export const logout = (user) => {
    cookies.remove('user')
    cookies.remove('isLoggedIn')
    return true;

}

