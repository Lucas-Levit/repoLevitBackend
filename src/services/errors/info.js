export const generateUserErrorInfo=(user)=>{
    return  `Una o mas propiedades estan incompletas o no son validas.
    Estos campos son requeridos:
    *first_name: Debe ser un string, recibiendo ${user.first_name}
    *last_name: Debe ser un string, recibiendo ${user.last_name}
    *email: Debe ser un string, recibiendo ${user.email}
    *age: Debe ser un number, recibiendo ${user.age}`
    
}