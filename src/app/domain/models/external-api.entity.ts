export interface ExternalApiEndpoint {
    id: string;
    name: string;
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    description: string;
    isActive: boolean;
}

export interface ExternalApi {
    id: string;
    name: string;
    base_url: string;
    description: string;
    authType: 'None' | 'API Key' | 'OAuth2' | 'Basic Auth';
    rateLimit: string;
    endpoints: ExternalApiEndpoint[];
}
