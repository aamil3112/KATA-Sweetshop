# Database Seeding Scripts

## Seed Database with Sample Data

This script will populate your database with sample sweets and create an admin user if one doesn't exist.

### Usage

```bash
npm run seed
```

### What it does:

1. **Clears existing sweets** (optional - you can comment this out in the script)
2. **Adds 15 Indian sweets** with images, descriptions, and prices in Indian Rupees (₹)
3. **Creates an admin user** if one doesn't exist:
   - Email: `admin@sweetshop.com`
   - Password: `admin123`

### Indian Sweets Included:

- Gulab Jamun (₹50) - Soft, spongy milk balls in rose syrup
- Rasgulla (₹45) - Cottage cheese balls in sugar syrup
- Jalebi (₹40) - Crispy spiral-shaped sweet
- Kaju Katli (₹600) - Diamond-shaped cashew fudge
- Barfi (₹350) - Dense milk-based sweet
- Ladoo (₹30) - Round sweet balls
- Rasmalai (₹55) - Soft cheese patties in creamy milk
- Halwa (₹200) - Sweet semolina or carrot pudding
- Kheer (₹80) - Creamy rice pudding
- Peda (₹400) - Soft round milk-based sweet
- Soan Papdi (₹250) - Flaky layered sweet
- Besan Ladoo (₹320) - Gram flour ladoos
- Modak (₹35) - Steamed dumplings with coconut
- Sandesh (₹280) - Bengali cottage cheese sweet
- Rabri (₹90) - Thickened sweetened milk

All sweets include images and descriptions!

### Note:

Make sure your MongoDB is running and your `.env` file has the correct `MONGODB_URI` before running the seed script.

