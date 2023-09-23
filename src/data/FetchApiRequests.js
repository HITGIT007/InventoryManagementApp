 export const myFetchGetRequest = async () => {
    const response = await fetch("http://jsonplaceholder.typicode.com/posts",{
      method: "GET",
    });
    const resJson = await response.json(); 
    return resJson
 }

 export const myFetchPostRequest = async (data) => {
   const response = await fetch("http://jsonplaceholder.typicode.com/posts",
   {
      method: "POST",
      body  : JSON.stringify(data),
      headers: {
         'Content-Type': 'application/json; charset=UTF-8',
       },
   } 
   );
   const resJson = await response.json(); 
   return resJson
}

export const myFetchPutRequest = async (id,data) => {
   console.log("put request called===========>",id,data);
   const response = await fetch("http://jsonplaceholder.typicode.com/posts" + id,
   {
      method: "PUT",
      body  : JSON.stringify(data),
      headers: {
         'Content-Type': 'application/json; charset=UTF-8',
       },
   } 
   );
   const resJson = await response.json(); 
   console.log("resJson put request ===========>",resJson);
   return resJson
}