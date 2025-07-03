// inventory.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Petstore Inventory API', () => {

  const BASE_URL = 'https://petstore.swagger.io/v2';

  //GET INVENTORY ENDPOINT
  test('Should retrieve inventory and verify structure and content for first 3 keys', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/store/inventory`);

    // Verify status code
    expect(response.status()).toBe(200);

    const inventory = await response.json();
    expect(typeof inventory).toBe('object');
    expect(inventory).not.toBeNull();
    expect(Array.isArray(inventory)).toBe(false);

    // Verify the object is not empty
    expect(Object.keys(inventory).length).toBeGreaterThan(0);

    // Define the first 3 keys 
    const firstThreeKeys = ['totvs', '#if(available ==', '5000'];

    // Verify the first 3 keys exist and their values are numbers
    for (const key of firstThreeKeys) {
      expect(inventory).toHaveProperty(key);
      expect(typeof inventory[key]).toBe('number');
    }

    // Verify all other keys have number values, Im not checking the values since they change on every request
    for (const key in inventory) {
      if (!firstThreeKeys.includes(key)) {
        expect(typeof inventory[key]).toBe('number');
      }
    }
  });

  test('Should return 404 for a non-existent inventory endpoint', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/store/nonExistentInventory`);
    expect(response.status()).toBe(404);
  });

  //POST ORDER ENDPOINT
  test('Should successfully place an order for a pet', async ({ request }) => {
    const orderPayload = {
      id: 12345,
      petId: 54321,
      quantity: 2,
      shipDate: "2025-07-03T20:10:14.844Z",
      status: "placed",
      complete: true
    };

    const response = await request.post(`${BASE_URL}/store/order`, {
      data: orderPayload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Verify the response matches the sent payload values
    expect(responseBody).toMatchObject({
      id: 12345,
      petId: 54321,
      quantity: 2,
      status: "placed",
      complete: true
    });

    expect(typeof responseBody.shipDate).toBe('string');
    expect(responseBody.shipDate).toContain('2025-07-03');
  });

  test('Should return 400 Bad Request when order payload contains invalid types (raw invalid JSON)', async ({ request }) => {
    // We send raw JSON here because we cannot send 'dusko' as a non-string variable
    const invalidPayloadRaw = `{
      "id": dusko,
      "petId": 0,
      "quantity": 0,
      "shipDate": "2025-07-03T20:31:45.305Z",
      "status": "placed",
      "complete": true
    }`;

    const response = await request.post(`${BASE_URL}/store/order`, {
      data: invalidPayloadRaw,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(500);

    const body = await response.json();

    expect(body).toMatchObject({
      code: 500,
      type: "unknown",
      message: "something bad happened"
    });
  });

  test('Should return 500 Internal Server Error when sending invalid data type for order ID', async ({ request }) => {
    const invalidOrder = {
      id: "dusko",
      petId: 0,
      quantity: 0,
      shipDate: "2025-07-03T20:31:45.305Z",
      status: "placed",
      complete: true
    };

    const response = await request.post(`${BASE_URL}/store/order`, {
      data: invalidOrder,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(500);

    const body = await response.json();

    expect(body).toMatchObject({
      code: 500,
      type: 'unknown',
      message: 'something bad happened'
    });
  });

  test('Should fail to place an order with invalid endpoint', async ({ request }) => {
    const payload = {
      id: 98765,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false
    };

    // Even with incomplete payload, the API returns 200,
    // so we change the endpoint to simulate a 404 error
    const response = await request.post(`${BASE_URL}/store/orderr`, {
      data: payload,
    });

    expect([404]).toContain(response.status());
  });

  test('Should retrieve an existing order by ID', async ({ request }) => {
    const orderId = 5;

    const response = await request.get(`https://petstore.swagger.io/v2/store/order/${orderId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject({
      id: orderId,
      status: 'placed',
      complete: true
    });

    expect(typeof body.petId).toBe('number');
    expect(typeof body.quantity).toBe('number');
    expect(typeof body.shipDate).toBe('string');
  });

  test('Should return 404 for non-existent order ID', async ({ request }) => {
    const nonExistentOrderId = 982172;

    const response = await request.get(`https://petstore.swagger.io/v2/store/order/${nonExistentOrderId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body).toMatchObject({
      code: 1,
      type: "error",
      message: "Order not found"
    });
  });

});
