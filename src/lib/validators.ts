export const validatePayment = (data: any): string[] => {
    const errors: string[] = [];
    
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
        errors.push('Amount must be a positive number');
    }
    
    if (!data.currency || typeof data.currency !== 'string' || data.currency.length !== 3) {
        errors.push('Currency must be a 3-character string');
    }
    
    return errors;
};