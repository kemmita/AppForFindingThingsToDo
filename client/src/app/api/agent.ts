import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { toast } from 'react-toastify';
import {IActivitiesEnvelope, IActivity} from "../Interfaces/activity";
import {IUser, IUserFormValues} from "../Interfaces/user";
import {IPhoto, IProfile} from "../Interfaces/profile";

axios.defaults.baseURL = 'https://localhost:44396/api';

axios.interceptors.request.use((config) =>{
    const token = window.localStorage.getItem('jwt');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {return Promise.reject(error)});

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running!')
    }
    const {status, data, config} = error.response;
    if (status === 400 || 404 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound')
    }
    if (status === 500) {
        toast.error('Server error - check the terminal for more info!')
    }
    if (status === 401) {
        toast.error('Pleas confirm your email address!')
    }
    throw error;
});

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url: string) => axios.get(url).then().then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody)
    },
};

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get('/activities', {params: params}).then(responseBody),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/Activities/${id}/attend`, {}),
    cancelAttendance: (id: string) => requests.del(`/Activities/${id}/removeAttendance`)
};

const User = {
  current: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user),
  fbLogin: (accessToken: string) => requests.post(`/user/External/login`, {accessToken}),
  getProfileData: (username: string): Promise<IProfile> => requests.get(`/user/profile/${username}`),
  updateProfileData: (profile: IProfile) => requests.put(`/user`, profile),
  uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm('/photos', photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  follow: (username: string) => requests.post(`/following/${username}`, {}),
  unfollow: (username: string) => requests.del(`/following/delete/${username}`),
  getFollowData: (username: string, predicate: string) => requests.get(`/following/data/${username}/${predicate}`),
  listProfileActivities:   (username: string, predicate?: string) => requests.get(`/user/Activities/${username}?predicate=${predicate!}`)
};

export default {
    Activities,
    User
}
