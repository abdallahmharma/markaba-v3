# Markaba v3 — Firestore Database Schema

> Target Market: Jordan  
> Purpose: Define the complete Firestore structure for future development without redesign.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Collections](#collections)
3. [ER-Style Relationships](#er-style-relationships)
4. [Indexes](#indexes)
5. [Data Design Principles](#data-design-principles)

---

## Architecture Overview

Markaba uses a **flat collection structure** with document references for relationships. No nested subcollections are used to keep queries flexible and scalable. All relationships are expressed via `id` fields stored as strings.

```
manufacturers → models → vehicleGenerations → vehicleTrims
    ↓                                               ↓
users ← reviews, favorites, comparisons       dealers
    ↓
news
```

---

## Collections

### 1. manufacturers

**Purpose:** Store automobile manufacturer/brand information.

**Document ID:** `auto-generated` (Firestore auto-ID) or custom slug-based ID (e.g. `"toyota"`)

| Field        | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| `id`         | `string` | Unique identifier (same as doc ID)   |
| `name`       | `string` | Manufacturer full name (e.g. "Toyota") |
| `slug`       | `string` | URL-friendly identifier (e.g. "toyota") |
| `country`    | `string` | Country of origin (e.g. "Japan")     |
| `logoUrl`    | `string` | CDN URL for manufacturer logo        |
| `active`     | `boolean`| Whether this manufacturer is active  |
| `createdAt`  | `timestamp` | Document creation time             |
| `updatedAt`  | `timestamp` | Last update time                   |

**Indexes:**
- `slug` (unique)
- `active` (ascending)

---

### 2. models

**Purpose:** Store vehicle models for each manufacturer.

**Document ID:** `auto-generated` or slug-based (e.g. `"corolla"`)

| Field            | Type        | Description                           |
| ---------------- | ----------- | ------------------------------------- |
| `id`             | `string`    | Unique identifier                       |
| `manufacturerId` | `string`    | Reference to manufacturers doc ID     |
| `manufacturerSlug` | `string`  | Denormalized slug for filtering       |
| `name`           | `string`    | Model name (e.g. "Corolla")           |
| `slug`           | `string`    | URL-friendly identifier               |
| `bodyType`       | `string`    | Vehicle body type (Sedan, SUV, etc.)  |
| `active`         | `boolean`   | Whether this model is active          |
| `createdAt`      | `timestamp` | Document creation time                |
| `updatedAt`      | `timestamp` | Last update time                      |

**Indexes:**
- `manufacturerSlug` + `active` (composite)
- `slug` (unique)

---

### 3. vehicleGenerations

**Purpose:** Store generational information for each model.

**Document ID:** `auto-generated`

| Field           | Type        | Description                            |
| --------------- | ----------- | -------------------------------------- |
| `id`            | `string`    | Unique identifier                        |
| `modelId`       | `string`    | Reference to models doc ID             |
| `generationName`| `string`    | Generation descriptor (e.g. "E210")    |
| `startYear`     | `number`    | First year of production                 |
| `endYear`       | `number \| null` | Last year (null if still in production) |
| `platform`      | `string`    | Platform name (e.g. "TNGA-C")          |
| `active`        | `boolean`   | Whether this generation is active       |
| `createdAt`     | `timestamp` | Document creation time                  |
| `updatedAt`     | `timestamp` | Last update time                        |

**Indexes:**
- `modelId` + `active` (composite)
- `startYear` (ascending)

---

### 4. vehicleTrims

**Purpose:** Store specific trim/variant information for each generation.

**Document ID:** `auto-generated`

| Field           | Type        | Description                           |
| --------------- | ----------- | ------------------------------------- |
| `id`            | `string`    | Unique identifier                       |
| `generationId`  | `string`    | Reference to vehicleGenerations doc ID |
| `trimName`      | `string`    | Trim name (e.g. "XLE", "Limited")     |
| `engine`        | `string`    | Engine description (e.g. "2.0L I4")   |
| `transmission`  | `string`    | Transmission type (CVT, Manual, etc.)  |
| `drivetrain`    | `string`    | FWD, RWD, AWD, 4WD                    |
| `horsepower`    | `number`    | Engine horsepower                       |
| `fuelType`      | `string`    | Gasoline, Hybrid, Diesel, etc.         |
| `active`        | `boolean`   | Whether this trim is active             |
| `createdAt`     | `timestamp` | Document creation time                  |
| `updatedAt`     | `timestamp` | Last update time                        |

**Indexes:**
- `generationId` + `active` (composite)
- `drivetrain` (ascending)
- `fuelType` (ascending)

---

### 5. reviews

**Purpose:** Store user reviews for vehicle trims.

**Document ID:** `auto-generated`

| Field              | Type        | Description                           |
| ------------------ | ----------- | ------------------------------------- |
| `userId`           | `string`    | Reference to users doc ID             |
| `vehicleTrimId`    | `string`    | Reference to vehicleTrims doc ID      |
| `rating`           | `number`    | Overall rating (1-5)                  |
| `pros`             | `array`     | List of positive points               |
| `cons`             | `array`     | List of negative points               |
| `ownershipMonths`  | `number`    | Months of ownership                   |
| `mileage`          | `number`    | Mileage in kilometers                  |
| `createdAt`        | `timestamp` | Review creation time                  |

**Indexes:**
- `userId` + `createdAt` (composite)
- `vehicleTrimId` + `rating` (composite)

---

### 6. users

**Purpose:** Store user account information.

**Document ID:** Firebase Auth UID or custom ID

| Field       | Type        | Description                           |
| ----------- | ----------- | ------------------------------------- |
| `displayName` | `string`  | User's display name                   |
| `email`     | `string`    | User's email address                  |
| `photoUrl`  | `string \| null` | Profile photo URL (nullable)      |
| `role`      | `string`    | "user", "admin", "dealer"             |
| `country`   | `string`    | Country code (e.g. "JO")              |
| `city`      | `string`    | City name (e.g. "Amman")              |
| `createdAt` | `timestamp` | Account creation time                 |

**Indexes:**
- `email` (unique)
- `role` (ascending)

---

### 7. favorites

**Purpose:** Track user favorite vehicles.

**Document ID:** `auto-generated`

| Field          | Type        | Description                           |
| -------------- | ----------- | ------------------------------------- |
| `userId`       | `string`    | Reference to users doc ID             |
| `vehicleTrimId`| `string`    | Reference to vehicleTrims doc ID      |
| `createdAt`    | `timestamp` | Favorite creation time                |

**Indexes:**
- `userId` + `vehicleTrimId` (composite, unique)
- `userId` + `createdAt` (composite)

---

### 8. comparisons

**Purpose:** Store vehicle comparison lists per user.

**Document ID:** `auto-generated`

| Field         | Type          | Description                           |
| ------------- | ------------- | ------------------------------------- |
| `userId`      | `string`      | Reference to users doc ID             |
| `vehicleIds`  | `array`       | List of vehicleTrimId values (max 5)  |
| `createdAt`   | `timestamp`   | Comparison creation time              |

**Indexes:**
- `userId` + `createdAt` (composite)

---

### 9. dealers

**Purpose:** Store dealership information.

**Document ID:** `auto-generated`

| Field      | Type          | Description                           |
| ---------- | ------------- | ------------------------------------- |
| `name`     | `string`      | Dealership name                       |
| `city`     | `string`      | City location (e.g. "Amman")          |
| `phone`    | `string`      | Contact phone number                  |
| `website`  | `string \| null` | Official website URL               |
| `brands`   | `array`       | Array of manufacturer slugs           |
| `location` | `geopoint \| null` | GPS coordinates (latitude, longitude) |

**Indexes:**
- `city` (ascending)
- `brands` (ascending)

---

### 10. news

**Purpose:** Store automotive news articles.

**Document ID:** `auto-generated`

| Field        | Type          | Description                           |
| ------------ | ------------- | ------------------------------------- |
| `title`      | `string`      | Article title                         |
| `slug`       | `string`      | URL-friendly identifier               |
| `content`    | `string`      | HTML/Markdown article body            |
| `coverImage` | `string \| null` | Cover image CDN URL                |
| `publishedAt`| `timestamp`   | Publication timestamp                 |

**Indexes:**
- `slug` (unique)
- `publishedAt` (descending)

---

## ER-Style Relationships

```
manufacturers (1) ──────> (*) models
    │
    └────────────────────────> dealers.brands[] (many-to-many via slug)

models (1) ──────> (*) vehicleGenerations
    │
    └────────────────────────> vehicleTrims.generationId → generations → ...

vehicleGenerations (1) ───> (*) vehicleTrims

vehicleTrims (1) <────── (*) reviews
    │
    └────────────────────────> favorites.vehicleTrimId (*)
    │
    └────────────────────────> comparisons.vehicleIds[] (*)

users (1) <────── (*) reviews
users (1) <────── (*) favorites
users (1) <────── (*) comparisons
```

---

## Indexes

### Single-Field Indexes

| Collection          | Field        | Order    | Purpose                      |
| ------------------- | ------------ | -------- | ---------------------------- |
| manufacturers       | `slug`       | unique   | URL routing                  |
| models              | `slug`       | unique   | URL routing                  |
| models              | `active`     | ascending| Filter active models         |
| vehicleGenerations  | `active`     | ascending| Filter active generations    |
| vehicleTrims        | `active`     | ascending| Filter active trims          |
| reviews             | `rating`     | descending| Sort by rating              |
| users               | `email`      | unique   | Auth lookup                  |
| users               | `role`       | ascending| Admin queries               |
| dealers             | `city`       | ascending| City filter                 |
| dealers             | `brands`     | ascending| Brand filter                |
| news                | `slug`       | unique   | URL routing                  |
| news                | `publishedAt`| descending| Latest news first          |

### Composite Indexes

| Collection              | Fields                         | Purpose                    |
| ----------------------- | ------------------------------ | -------------------------- |