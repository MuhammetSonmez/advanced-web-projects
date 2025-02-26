import axios from "axios";

const base_endpoint = 'http://127.0.0.1:8000';



const registerUser = async (userData) => {
  const endpoint = base_endpoint + "/api/register/";
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(endpoint, userData, { headers });
    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw error;
  }
};

const loginUser = async (credentials) => {
  const endpoint = base_endpoint + "/api/login/";
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(endpoint, credentials, { headers });
    console.log("Login successful:", response.data);

    const jwtToken = response.data.access;
    console.log("jwt: ", jwtToken);
    localStorage.setItem('jwt_token', jwtToken);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};




const get_takvim_list = async () => {
  const endpoint = base_endpoint + "/api/takvim/";
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Takvim listesi alınırken hata oluştu:', error.response || error);
    throw error;
  }
};


const create_takvim = async (name, year) => {
  const endpoint = base_endpoint + "/api/takvim/";
  const token = localStorage.getItem('jwt_token');
  const data = {
    "jwt_token": token,
    "name": name,
    "year": year
  };


  try{
    const response = await axios.post(endpoint, data);
    return response.data;
  }catch(error){
    console.error('Takvim oluşturulurken hata oluştu:', error.message);
  }

}

const delete_takvim = async (takvim_id) => {
  const endpoint = base_endpoint + "/api/takvim/" + takvim_id + "/";
  const token = localStorage.getItem('jwt_token');
  const data = {
    "jwt_token": token,
  };

  try {
    const response = await axios.delete(endpoint, {
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error('Takvim silinirken hata oluştu:', error.message);
  }
};

const update_takvim = async (takvim_id, name, year) => {
  const endpoint = base_endpoint + "/api/takvim/" + takvim_id + "/";
  const token = localStorage.getItem('jwt_token');
  const data = {
    "jwt_token": token,
    "name": name,
    "year": year
  };

  try {
    const response = await axios.put(endpoint, data, {
    });
    return response.data;
  } catch (error) {
    console.error('Takvim güncellenirken hata oluştu:', error.message);
  }
};



const get_takvim = async (takvim_id) =>{
  const endpoint = base_endpoint + "/api/takvim/" + takvim_id + "/";

  try {
    const response = await axios.get(endpoint);
    return response.data;
  }catch(error){
    console.error('Takvim getirilirken hata oluştu:', error.message);
  }

  
}



const get_event_list = async () => {
  const endpoint = base_endpoint + "/api/events/";
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Event listesi alınırken hata oluştu:', error.response || error);
    throw error;
  }
};

const create_event = async (takvim, name, term, start_date, end_date) => {
  const endpoint = base_endpoint + "/api/events/";
  const token = localStorage.getItem('jwt_token');

  const data = {
    "jwt_token": token,
    "takvim": takvim,
    "name": name,
    "term": term,
    "start_date": start_date,
    "end_date": end_date
  };

  try {
    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Event oluşturulurken hata oluştu:', error.message);
  }
};

const delete_event = async (event_id) => {
  const endpoint = base_endpoint + "/api/events/" + event_id + "/";
  const token = localStorage.getItem('jwt_token');
  const data = {
    "jwt_token": token,
  };

  try {
    const response = await axios.delete(endpoint, {
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error('Event silinirken hata oluştu:', error.message);
  }
};

const update_event = async (event_id, takvim, name, term, start_date, end_date) => {
  const endpoint = base_endpoint + "/api/events/" + event_id + "/";
  const token = localStorage.getItem('jwt_token');
  const data = {
    "jwt_token": token,
    "takvim": takvim,
    "name": name,
    "term": term,
    "start_date": start_date,
    "end_date": end_date
  };

  try {
    const response = await axios.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Event güncellenirken hata oluştu:', error.message);
  }
};





export {loginUser, registerUser, get_takvim_list, create_takvim, delete_takvim, update_takvim, get_event_list, create_event, delete_event, update_event, get_takvim}