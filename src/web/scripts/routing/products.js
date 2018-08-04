const basePath = '/products/';

export const paths = {
    default: basePath + ':roleKey?',
};

export const generator = () => {
    return basePath;
};

const products = {
    paths,
    generator
};

export default products;