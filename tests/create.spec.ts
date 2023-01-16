import { expect } from "@playwright/test";
import { test } from "../fixtures/request.fixture";

test('Create Todo',async ({authenticatedRequest})=>{
    const resp = await authenticatedRequest.post('atm','atm','http://localhost:8080/v3/todo',{
        title:"Bring Milk"
    })
    await expect(resp.status()).toBe(201)
    const body = await resp.json()
    expect(body.title).toBe("Bring Milk")
    expect(body.id).not.toBe(null)
    expect(body.status).toBe("ACTIVE")
})