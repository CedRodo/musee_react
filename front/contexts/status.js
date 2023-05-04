import { configureStore } from "@reduxjs/toolkit";

const profil = { statusLoggue : false, isAdmin : false, isRedacteur : false }

function reducerLoggue(state = profil, action){
    switch(action.type){
        case "LOGGUE" :
            return { ...state, statusLoggue: true }
        case "NONLOGGUE" :
            return { ...state, statusLoggue: false }
        default :
            return state;
    }
}

function reducerIsRole(state = profil, action){
    switch(action.type){
        case "isAdminTrue" :
            return { ...state, isAdmin: true }
        case "isAdminFalse" :
            return { ...state, isAdmin: false }
        case "isRedacteurTrue" :
            return { ...state, isRedacteur: true }
        case "isRedacteurFalse" :
            return { ...state, isRedacteur: false }
        default :
            return state;
    }
}

const reducer = {
    reducerLoggue: reducerLoggue,
    reducerIsRole: reducerIsRole
}


export const store = configureStore({ reducer });