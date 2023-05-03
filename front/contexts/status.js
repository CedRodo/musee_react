import { configureStore } from "@reduxjs/toolkit";

// const mode = {statusAdmin : false}
// function reducerAdmin(state = mode, action){
//     switch(action.type){
//         case "ADMINYES" :
//             return{...state, statusAdmin : true}
//         case "ADMINNO" :
//             return{...state, statusAdmin : false}
//         default :
//             return state;
//     }
// }

// const reducer = {reducerAdmin : reducerAdmin}

const mode = {statusLoggue : false}
function reducerLoggue(state = mode, action){
    switch(action.type){
        case "LOGGUE" :
            return{...state, statusLoggue : true}
        case "NONLOGGUE" :
            return{...state, statusLoggue : false}
        default :
            return state;
    }
}

const reducer = {reducerLoggue : reducerLoggue}


export const store = configureStore({reducer});