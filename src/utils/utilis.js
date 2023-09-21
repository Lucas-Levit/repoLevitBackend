import { fakerES } from '@faker-js/faker'

//faker.locale= 'es'

export const generateUser = () => {

    return {
        title: fakerES.commerce.productName(),
        price: fakerES.commerce.price(),
        stock: 10,
        
        
    }

}

