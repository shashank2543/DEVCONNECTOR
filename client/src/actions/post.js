import {GET_POSTS,POST_ERROR,UPDATE_LIKES,DELETE_POST,ADD_POST,GET_POST,ADD_COMMENT,REMOVE_COMMENT} from './types';
import axios from 'axios';
import {setAlert} from './alert'

// Get posts

export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');

        dispatch({
            type:GET_POSTS,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
};

// Add likes

export const addLike = (postId) => async dispatch => {
    try {
        //  console.log(postId);
        const res = await axios.put(`/api/posts/like/${postId}`);
       
        dispatch({
            type:UPDATE_LIKES,
            payload:{postId,likes:res.data}
        });
    } catch (error) {
        //console.log(error.response);
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
};

// remove likes

export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);

        dispatch({
            type:UPDATE_LIKES,
            payload:{postId,likes:res.data}
        });
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
};

// Delete post

export const deletePost = (id) => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);

        dispatch({
            type:DELETE_POST,
            payload:id
        });
        dispatch(setAlert('Post Removed','success'));
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
};

// Add post

export const addPost = (formData) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post('/api/posts',formData,config);

        dispatch({
            type:ADD_POST,
            payload:res.data
        });
        dispatch(setAlert('Post Added','success'));
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
};
 // Get Post
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type:GET_POST,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
};

// Add comment

export const addComment = (postId,formData) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`,formData,config);
       // console.log(res.data);
        dispatch({
            type:ADD_COMMENT,
            payload:res.data.comments
        });
         dispatch(setAlert('Comment Added','success'));
    } catch (error) {
      //  console.log(error)
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
}; 

// Delete comment

export const deleteComment = (postId,commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch({
            type:REMOVE_COMMENT,
            payload:res.data
        });
         dispatch(setAlert('Comment Removed','success'));
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText,status:error.response.status}
        }) ;
    }
}; 