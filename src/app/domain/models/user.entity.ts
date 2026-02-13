export interface Address {
    street: string;
    externalNumber: string;
    internalNumber?: string;
    colony: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface User {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'Administrador' | 'Visitante' | 'Investigador';
    birthdate: string; // ISO format YYYY-MM-DD
    nationality: string;
    phoneNumber: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    profilePicture: string; // URL or base64
    address: Address;

    // Additional personal data requested
    curp?: string;
    rfc?: string;
    occupation?: string;
}
