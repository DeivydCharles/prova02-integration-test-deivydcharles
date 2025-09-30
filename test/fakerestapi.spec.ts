import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('API Fakerestapi', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakerestapi.azurewebsites.net';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Livros', () => {
    // Dados de livro para reutilização
    const newBookData = {
      id: faker.number.int({ min: 201, max: 1000 }),
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      pageCount: faker.number.int({ min: 50, max: 500 }),
      excerpt: faker.lorem.paragraphs(2),
      publishDate: faker.date.past().toISOString()
    };

    // 1. Buscar todos os livros
    it('Deve buscar todos os livros', async () => {
      await p
        .spec()
        .get(`${baseUrl}/api/v1/Books`)
        .expectStatus(StatusCodes.OK)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'title', 'description']
          }
        });
    });

    // 2. Buscar um livro pelo ID
    it('Deve buscar um livro pelo ID', async () => {
      const bookId = 1;
      await p
        .spec()
        .get(`${baseUrl}/api/v1/Books/${bookId}`)
        .expectStatus(StatusCodes.OK)
        .expectJson('id', bookId);
    });

    // 3. Buscar um livro inexistente (teste negativo)
    it('Deve retornar 404 para um livro inexistente', async () => {
      const nonExistentBookId = 9999;
      await p
        .spec()
        .get(`${baseUrl}/api/v1/Books/${nonExistentBookId}`)
        .expectStatus(StatusCodes.NOT_FOUND);
    });

    // 4. Criar um novo livro
    it('Deve criar um novo livro', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/v1/Books`)
        .withJson(newBookData)
        .expectStatus(StatusCodes.OK)
        .expectJson('id', newBookData.id)
        .expectJson('title', newBookData.title);
    });

    // 5. Criar um livro com dados inválidos (teste negativo)
    it('Deve validar campos obrigatórios ao criar um livro', async () => {
      await p
        .spec()
        .post(`${baseUrl}/api/v1/Books`)
        .withJson({ id: 'invalid', title: '' })
        .expectStatus(StatusCodes.BAD_REQUEST);
    });

    // 6. Atualizar um livro
    it('Deve atualizar um livro existente', async () => {
      const bookId = 5;
      const updatedData = {
        id: bookId,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        pageCount: faker.number.int({ min: 50, max: 500 }),
        excerpt: faker.lorem.paragraphs(2),
        publishDate: faker.date.past().toISOString()
      };

      await p
        .spec()
        .put(`${baseUrl}/api/v1/Books/${bookId}`)
        .withJson(updatedData)
        .expectStatus(StatusCodes.OK)
        .expectJson('id', bookId)
        .expectJson('title', updatedData.title);
    });

    // 7. Deletar um livro
    it('Deve deletar um livro', async () => {
      const bookId = 10;
      await p
        .spec()
        .delete(`${baseUrl}/api/v1/Books/${bookId}`)
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('Autores', () => {
    // 8. Buscar autores de um livro
    it('Deve buscar autores de um livro', async () => {
      const bookId = 1;
      await p
        .spec()
        .get(`${baseUrl}/api/v1/Authors/authors/books/${bookId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLength(4)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'idBook', 'firstName', 'lastName']
          }
        });
    });

    // 9. Buscar autores de um livro inexistente (teste negativo)
    it('Deve retornar array vazio para autores de livro inexistente', async () => {
      const nonExistentBookId = 9999;
      await p
        .spec()
        .get(`${baseUrl}/api/v1/Authors/authors/books/${nonExistentBookId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLength(0);
    });
  });

  describe('Capas de Livros', () => {
    // 10. Buscar capas de um livro
    it('Deve buscar capas de um livro', async () => {
      const bookId = 1;
      await p
        .spec()
        .get(`${baseUrl}/api/v1/CoverPhotos/books/covers/${bookId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLength(1)
        .expectJsonSchema({
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'idBook', 'url']
          }
        });
    });
  });
});
