import decode from 'jwt-decode';
export default class AuthService {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || 'http://localhost:3001' // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.signup = this.signup.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }


    signup(useremail, password) {
        
        // Get a token from api server using the fetch api
//        console.log(this.domain);
//        console.log(password);
        //I had to change this line to get it to work
    //    return this.fetch(`${this.domain}/login`, {
       return this.fetch(`/signup`, {    
            method: 'POST',
            body: JSON.stringify({
                useremail,
                password
            })
        }).then(res => {
//            console.log(res);
            if(res.success) this.setToken(res.token) // Setting the token in localStorage
            return Promise.resolve(res);
         
  
        })
    }

    login(useremail, password) {
        // Get a token from api server using the fetch api
//        console.log(this.domain);
//        console.log(password);
        //I had to change this line to get it to work
    //    return this.fetch(`${this.domain}/login`, {
       return this.fetch(`/login`, {    
            method: 'POST',
            body: JSON.stringify({
                useremail,
                password
            })
        }).then(res => {
//            console.log(res.success);
            this.setToken(res.token) // Setting the token in localStorage
            return Promise.resolve(res);
        })
    }

    loggedIn() {
    
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
//        console.log(!!token && !this.isTokenExpired(token));
       return !!token && !this.isTokenExpired(token) // handwaiving here
     //return true;
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
//            .then(this._checkStatus)
            .then(response => response.json())
    }


//I decided not to use this function because I didn't want to throw an error, just give feedback that username or password was incorrect.    
    _checkStatus(response) {
//        console.log(response)
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            console.log(response);
            var error = new Error('the error is: '+response.statusText)//Note this shows up as an alert.
            error.response = response
            
            throw error
        }
    }
}