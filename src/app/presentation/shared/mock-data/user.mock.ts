import { User } from '../../../domain/models/user.entity';

export const USERS_MOCK: User[] = [
    {
        id: 'usr_001',
        userName: 'geovanni.admin',
        firstName: 'Geovanni',
        lastName: 'Admin User',
        email: 'geovanni@example.com',
        password: 'password123',
        role: 'Administrador',
        birthdate: '1990-05-15',
        nationality: 'Mexicana',
        phoneNumber: '+52 55 1234 5678',
        gender: 'MALE',
        status: 'ACTIVE',
        profilePicture: 'https://i.pravatar.cc/150?u=geovanni',
        address: {
            street: 'Av. Reforma',
            externalNumber: '222',
            internalNumber: 'A-101',
            colony: 'Juárez',
            city: 'Ciudad de México',
            state: 'CDMX',
            zipCode: '06600',
            country: 'México'
        },
        curp: 'ABCD900515HDFR05',
        rfc: 'ABCD900515XXX',
        occupation: 'Software Engineer'
    },
    {
        id: 'usr_002',
        userName: 'maria.user',
        firstName: 'María',
        lastName: 'González López',
        email: 'maria.gonzalez@example.com',
        password: 'password123',
        role: 'Visitante',
        birthdate: '1995-10-20',
        nationality: 'Mexicana',
        phoneNumber: '+52 55 8765 4321',
        gender: 'FEMALE',
        status: 'ACTIVE',
        profilePicture: 'https://i.pravatar.cc/150?u=maria',
        address: {
            street: 'Calle Pino',
            externalNumber: '45',
            colony: 'Bosques',
            city: 'Guadalajara',
            state: 'Jalisco',
            zipCode: '44100',
            country: 'México'
        },
        occupation: 'Biologist'
    },
    {
        id: 'usr_003',
        userName: 'juan.guest',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        password: 'password123',
        role: 'Visitante',
        birthdate: '2000-01-01',
        nationality: 'Mexicana',
        phoneNumber: '+52 55 0000 1111',
        gender: 'MALE',
        status: 'INACTIVE',
        profilePicture: 'https://i.pravatar.cc/150?u=juan',
        address: {
            street: 'Av. Insurgentes Sur',
            externalNumber: '1000',
            colony: 'Del Valle',
            city: 'Ciudad de México',
            state: 'CDMX',
            zipCode: '03100',
            country: 'México'
        }
    }
];
