export const generateUserErrorInfo=(user)=>{
    return  `Una o mas propiedades estan incompletas o no son validas.
    Estos campon son requeridos:
    *first_name: Debe ser un string ${user.first_name}
    *last_name: Debe ser un string ${user.last_name}
    *email: Debe ser un string ${user.email}`
}