import { fakerES } from '@faker-js/faker'

//faker.locale= 'es'

export const generateUser = () => {

    // const prod = []
    // for (let i = 0; i < 4; i++) {
    //     prod.push(products())
    // }

    return {
        title: fakerES.commerce.productName(),
        price: fakerES.commerce.price(),
        stock: 10,
        
        
    }

}

// export const products = () => {
//     return {
//         title: fakerES.commerce.productName(),
//         price: fakerES.commerce.price(),
//         stock: 10,
//         id: fakerES.database.mongodbObjectId(),
//         image: fakerES.image.urlPicsumPhotos()
//     }
// }
