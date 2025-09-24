// gorest.test.ts
import axios from 'axios';

// URL base da API GoREST
const BASE_URL = "https://gorest.co.in";

// Pega o token de acesso das variáveis de ambiente
const ACCESS_TOKEN = process.env.GOREST_ACCESS_TOKEN;

// Configuração do cabeçalho de autorização
const AUTH_CONFIG = {
    headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
};

// Variável para armazenar o ID do usuário criado nos testes
let userId: number;

describe('Testes da API GoREST', () => {

    // Antes de todos os testes, verifica se o token foi configurado
    beforeAll(() => {
        if (!ACCESS_TOKEN) {
            throw new Error("Variável de ambiente GOREST_ACCESS_TOKEN não configurada.");
        }
    });

    test('Deve listar usuários', async () => {
        const response = await axios.get(`${BASE_URL}/public/v2/users`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        console.log('GET /users: Sucesso');
    });

    test('Deve criar um novo usuário', async () => {
        // Gera um email único para cada execução do teste
        const uniqueEmail = `test.user.${Date.now()}@test.com`;
        const newUser = {
            name: 'Test User',
            email: uniqueEmail,
            gender: 'male',
            status: 'active'
        };

        const response = await axios.post(`${BASE_URL}/public/v2/users`, newUser, AUTH_CONFIG);

        // A API retorna 201 (Created) em caso de sucesso
        expect(response.status).toBe(201);
        expect(response.data.email).toBe(uniqueEmail);
        
        // Armazena o ID do usuário para os próximos testes
        userId = response.data.id;
        console.log(`POST /users: Sucesso - Usuário criado com ID: ${userId}`);
    });

    test('Deve obter detalhes do usuário recém-criado', async () => {
        // Garante que o teste anterior tenha criado um usuário
        if (!userId) {
            throw new Error("ID do usuário não definido. O teste de criação falhou.");
        }
        
        const response = await axios.get(`${BASE_URL}/public/v2/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.data.id).toBe(userId);
        console.log(`GET /users/${userId}: Sucesso`);
    });

    test('Deve atualizar o usuário recém-criado', async () => {
        const updatedData = {
            name: 'Test User Updated',
            status: 'inactive'
        };

        const response = await axios.put(`${BASE_URL}/public/v2/users/${userId}`, updatedData, AUTH_CONFIG);

        expect(response.status).toBe(200);
        expect(response.data.name).toBe('Test User Updated');
        expect(response.data.status).toBe('inactive');
        console.log(`PUT /users/${userId}: Sucesso`);
    });

    test('Deve deletar o usuário recém-criado', async () => {
        const response = await axios.delete(`${BASE_URL}/public/v2/users/${userId}`, AUTH_CONFIG);

        // A API retorna 204 (No Content) após deletar com sucesso
        expect(response.status).toBe(204);
        console.log(`DELETE /users/${userId}: Sucesso`);
    });
});