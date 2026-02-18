# mlbbtopup.in Service API Guide

This guide explains how to use the mlbbtopup.in Service API to integrate top-up services into your own applications. This feature is exclusively available to **Members** and **Owners**.

---

## 1. Authentication & Headers

Every request to the Service API requires authentication. 

**Required Headers:**
```http
x-api-key: TK_your_generated_api_key_here
Content-Type: application/json
```

> **Security Note:** User details (email, phone, etc.) are automatically retrieved from the account linked to your API key. There is no need to send these in order requests.

---

## 2. API Endpoints

### 💰 Check Wallet Balance
Check your current wallet balance and user profile.
*   **URL:** `/api/service/balance`
*   **Method:** `GET`

### 🔍 Browse Games (List)
Get a list of all available games and services.
*   **URL:** `/api/service/games`
*   **Method:** `GET`

### 🎮 Get Game Details (Items & Prices)
Get a list of items and their **member-specific prices** for a specific game.
*   **URL:** `/api/service/games/{gameSlug}`
*   **Method:** `GET`
*   **Sample Response:**
    ```json
    {
      "success": true,
      "game": {
        "name": "Mobile Legends",
        "slug": "mobile-legends988",
        "items": [
          { "name": "Weekly Diamond Pass", "slug": "weekly-pass816", "price": 165 },
          { "name": "5 Diamonds", "slug": "diamonds-5", "price": 8 }
        ]
      }
    }
    ```

### 🛡️ ID & Region Check
Verify a Player ID/Zone ID and check account region before ordering.
*   **URL:** `/api/service/validate`
*   **Method:** `POST`
*   **Body:** `{"gameSlug": "...", "playerId": "...", "zoneId": "..."}`

### 🚀 Place Order
Deduct funds automatically from your wallet and place an order.
*   **URL:** `/api/service/order`
*   **Method:** `POST`
*   **Body:** `{"gameSlug": "...", "itemSlug": "...", "playerId": "..."}`

---

## 3. Implementation Flow
1. **List Games**: call `/api/service/games` to find the `gameSlug`.
2. **Get Prices**: call `/api/service/games/{slug}` to get `itemSlug` and the exact price you will be charged.
3. **Verify ID**: call `/api/service/validate` to confirm user identity.
4. **Order**: call `/api/service/order` to complete the transaction.
