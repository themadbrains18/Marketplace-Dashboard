
const axios = require("axios");
const {apiurl} = require('../config');
let token = localStorage.getItem('access_token');
const config = {
    headers: {
        'Authorization': 'Bearer ' + token
    }
}

export async function getTools() {
    return await axios.get(apiurl + "tool/getAll", config);
}

export async function save(name ,admin){

   return await axios.post(apiurl + `tool/save`, {name,admin}, config).then(function (response) {
        if (response.data) {
            return response;
        }
    });
}

export async function removeTool(id) {
    
    return await axios.delete(apiurl + `tool/delete/${id}`, config).then(function (response) {
        if (response.data.deletedCount>0) {
            return response;
        }
    });
}

export async function getToolsWithId(id){
    return await axios.get(apiurl + `tool/gettoolbyid/${id}`, config);
}

export async function update(id,name ,admin){

    return await axios.post(apiurl + `tool/update`, {id,name,admin}, config).then(function (response) {
         if (response.data) {
             return response;
         }
     });
 }