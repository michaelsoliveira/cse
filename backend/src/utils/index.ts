export function OrderByTerm(path: string, value: string) {
    const orderByElement: Array<string> = path ? path?.split('.') : []
    const orderByTerm = orderByElement?.length > 0 
        ? orderByElement?.reverse().reduce((acc: any, key) => ({ [key]: acc }), value) 
        : {}
    
    return orderByTerm
}