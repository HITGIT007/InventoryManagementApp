import axios from 'axios';
export const loginAxiosReqres = async(username,password) =>{

    try {
        let reqresemail = 'eve.holt@reqres.in'
        let reqrespassword = 'cityslicka'
        console.log("Username or Email", username, password)
        const response = await axios.post('https://reqres.in/api/login', {
          email : reqresemail,
          password  : reqrespassword,
        });
        console.log("loginAxiosReqres Response===========>", response)
        return response
  
        
      } catch (error) {
        console.error('Login Error:', error);
      }
}



export const getAxiosReqres = async(page) =>{

    try {
        const apiUrl = `https://reqres.in/api/users?page=${page}`
        console.log("page ====>", page)
        const response = await axios.get(apiUrl);
        console.log("getAxiosReqres Response===========>", response)
        return response
  
        
      } catch (error) {
        console.error('Login Error:', error);
      }
}




