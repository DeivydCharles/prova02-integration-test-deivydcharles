import axios from 'axios';

const BASE_URL = "https://jsonplaceholder.typicode.com";

describe('Testes da API JSONPlaceholder', () => {

    test('Deve listar todas as postagens', async () => {
        const response = await axios.get(`${BASE_URL}/posts`);
        
        expect(response.status).toBe(200);

        expect(Array.isArray(response.data)).toBe(true);
        console.log('GET /posts: Sucesso');
    });

    test('Deve criar uma nova postagem', async () => {
        const newPost = {
            title: 'foo',
            body: 'bar',
            userId: 1
        };

        const response = await axios.post(`${BASE_URL}/posts`, newPost);

        expect(response.status).toBe(201);

        expect(response.data.title).toBe('foo');
        console.log('POST /posts: Sucesso');
    });

    test('Deve atualizar uma postagem existente', async () => {
        const updatedPost = {
            id: 1,
            title: 'foo_updated',
            body: 'bar_updated',
            userId: 1
        };

        const response = await axios.put(`${BASE_URL}/posts/1`, updatedPost);

        expect(response.status).toBe(200);

        expect(response.data.title).toBe('foo_updated');
        console.log('PUT /posts/1: Sucesso');
    });

    test('Deve atualizar parcialmente uma postagem', async () => {
        const patchedData = {
            title: 'foo_patched'
        };

        const response = await axios.patch(`${BASE_URL}/posts/1`, patchedData);

        expect(response.status).toBe(200);

        expect(response.data.title).toBe('foo_patched');
        console.log('PATCH /posts/1: Sucesso');
    });

    test('Deve deletar uma postagem', async () => {
        const response = await axios.delete(`${BASE_URL}/posts/1`);

        expect(response.status).toBe(200);
        console.log('DELETE /posts/1: Sucesso');
    });
});