const generateMessage = (entity) => ({
    alreadyExist: `${entity} already exist`,
    notFound: `${entity} not found`,
    failToCreate: `fail to create ${entity}`,
    failToUpdate: `fail to update ${entity}`,
    createdSuccessfully: `${entity} created Successfully`,
    updateSuccessfully: `${entity} updated Successfully`,
    deleteSuccessfully: `${entity} deleted Successfully`,
    notAllowed: `${entity} not authorized to access this api`,
    verifiedSuccessfully: `${entity} verified successfully`,

})
export const messages = {
    category: generateMessage('category'),
    subcategory: generateMessage('subcategory'),
    brand: generateMessage('brand'),
    product: generateMessage('product'),
    file: { required: 'file is required' },
    user: generateMessage('user'),
    review: generateMessage('review'),
    cart: generateMessage('cart'),
    coupon: generateMessage('coupon'),
    order: generateMessage('order')
}