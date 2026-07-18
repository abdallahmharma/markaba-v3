# Database Schema

## users

**Purpose:** Store user account information

**Primary fields:** id, email, name, role, createdAt, updatedAt

**Relations:** Links to reviews, favorites, comparisons, notifications

**Indexes placeholder:** email (unique), role

**Security placeholder:** Passwords hashed, sensitive data encrypted

---

## manufacturers

**Purpose:** Store vehicle manufacturer/brand data

**Primary fields:** id, name, slug, logoUrl, country, createdAt, updatedAt

**Relations:** Links to models, vehicles

**Indexes placeholder:** slug (unique), name

**Security placeholder:** Public access allowed

---

## models

**Purpose:** Store vehicle model data per manufacturer

**Primary fields:** id, manufacturerId, name, slug, year, imageUrl, createdAt, updatedAt

**Relations:** Links to manufacturer, vehicles

**Indexes placeholder:** slug (unique), manufacturerId

**Security placeholder:** Admin write only

---

## vehicles

**Purpose:** Store individual vehicle listings

**Primary fields:** id, manufacturerId, modelId, userId, price, mileage, year, color, fuelType, transmission, location, description, images[], status, createdAt, updatedAt

**Relations:** Links to manufacturer, model, user (seller), reviews

**Indexes placeholder:** status, manufacturerId, modelId, createdAt

**Security placeholder:** User can edit own, admin can manage all

---

## reviews

**Purpose:** Store vehicle condition ratings and reviews

**Primary fields:** id, vehicleId, userId, rating, comment, pros, cons, createdAt, updatedAt

**Relations:** Links to vehicle, user (reviewer)

**Indexes placeholder:** vehicleId, rating

**Security placeholder:** Authenticated users only

---

## favorites

**Purpose:** Store user's saved vehicles

**Primary fields:** id, userId, vehicleId, createdAt

**Relations:** Links to user, vehicle

**Indexes placeholder:** userId, vehicleId (unique composite)

**Security placeholder:** User can only manage own favorites

---

## comparisons

**Purpose:** Store user's vehicle comparison lists

**Primary fields:** id, userId, vehicleIds[], name, createdAt, updatedAt

**Relations:** Links to user

**Indexes placeholder:** userId

**Security placeholder:** User can only manage own comparisons

---

## notifications

**Purpose:** Store user notifications

**Primary fields:** id, userId, type, message, read, link, createdAt

**Relations:** Links to user

**Indexes placeholder:** userId, read, createdAt

**Security placeholder:** User can only read own

---

## reports

**Purpose:** Store abuse/complaint reports

**Primary fields:** id, reporterId, targetType, targetId, reason, description, status, adminNotes, createdAt, updatedAt

**Relations:** Links to reporter user, target (vehicle/user)

**Indexes placeholder:** status, targetType, targetId

**Security placeholder:** Authenticated users can create, admin can manage

---

## subscriptions

**Purpose:** Store premium subscription and notification preferences

**Primary fields:** id, userId, planType, status, startDate, endDate, paymentMethod, createdAt, updatedAt

**Relations:** Links to user

**Indexes placeholder:** userId (unique), status

**Security placeholder:** Authenticated users can manage own, admin manages billing