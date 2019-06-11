import { GET_PROFILE, PROFILE_ERROR,CLEAR_PROFILE,UPDATE_PROFILE,GET_REPOS,GET_PROFILES } from "../actions/types";

const intialaState = {
    profile:null,
    profiles:[],
    repos:[],
    loading:true,
    error:{}
}

export default function(state = intialaState , action){
    const{type,payload} = action;

    switch(type){
        case GET_PROFILE :
        case UPDATE_PROFILE:
            return {
                ...state,
                profile : payload,
                loading : false
            };
        case GET_PROFILES:
            return {
               ...state,
               profiles:payload,
               loading:false
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error:payload,
                loading:false
            };
        case CLEAR_PROFILE:
            return{
                ...state,
                profile:null,
                repos:[],
                loading:true
            }
        case GET_REPOS:
            return {
                ...state,
                repos:payload,
                loading:false
            }
        default:
            return state;
    }
}