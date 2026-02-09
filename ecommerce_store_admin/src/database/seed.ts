// Complete seeding code to add to your main.ts
// Place this in an async function in your main.ts

import { DataSource } from 'typeorm';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from '../modules/users/user.entity';
import { Address } from '../modules/users/address.entity';
import { Product } from '../modules/products/product.entity';
import { Order, OrderStatus } from '../modules/orders/order.entity';
import { OrderItem } from '../modules/orders/order-item.entity';
import { Cart } from '../modules/cart/cart.entity';

async function seedDatabase(dataSource: DataSource, authService: AuthService) {
  // Clear existing data
  console.log('Clearing existing data...');
  await dataSource.query('DELETE FROM order_item');
  await dataSource.query('DELETE FROM `order`');
  await dataSource.query('DELETE FROM cart');
  await dataSource.query('DELETE FROM product');
  await dataSource.query('DELETE FROM address');
  await dataSource.query('DELETE FROM user');

  // Product categories and their products
const productsByCategory = {
  Electronics: [
    { name: 'Laptop', price: 900 },              // was 899.99
    { name: 'Smartphone', price: 700 },          // was 699.99
    { name: 'Wireless Headphones', price: 150 }, // was 149.99
    { name: 'Smart Watch', price: 300 },         // was 299.99
    { name: 'Tablet', price: 450 },              // was 449.99
    { name: 'Bluetooth Speaker', price: 80 },    // was 79.99
  ],
  Clothing: [
    { name: 'T-Shirt', price: 20 },    // was 19.99
    { name: 'Jeans', price: 50 },      // was 49.99
    { name: 'Sneakers', price: 90 },   // was 89.99
  ],
  Books: [
    { name: 'JavaScript Guide', price: 40 },          // was 39.99
    { name: 'TypeScript Handbook', price: 45 },       // was 44.99
    { name: 'Node.js Best Practices', price: 50 },    // was 49.99
    { name: 'Database Design', price: 55 },           // was 54.99
  ],
  'Home & Garden': [
    { name: 'Coffee Maker', price: 80 },       // was 79.99
    { name: 'Plant Pot Set', price: 30 },      // was 29.99
    { name: 'LED Desk Lamp', price: 40 },      // was 39.99
    { name: 'Kitchen Knife Set', price: 100 }, // was 99.99
  ],
  'Sports & Outdoors': [
    { name: 'Yoga Mat', price: 25 },       // was 24.99
    { name: 'Dumbbell Set', price: 150 },  // was 149.99
  ],
};

  // Helper functions
  const getRandomItem = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const shuffleArray = <T>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  try {
    // Create mock request object for signup
    const mockReq = {
      session: {},
    };

    // Create 5 users using the signup method
    console.log('Creating users...');
    const users: User[] = [];
    const userEmails = [
      'john.doe@example.com',
      'jane.smith@example.com',
      'bob.johnson@example.com',
      'alice.williams@example.com',
      'charlie.brown@example.com',
    ];
    const userNames = [
      'John Doe',
      'Jane Smith',
      'Bob Johnson',
      'Alice Williams',
      'Charlie Brown',
    ];

    for (let i = 0; i < 5; i++) {
      const user = await authService.signup(
        mockReq,
        userEmails[i],
        'password123',
        userNames[i],
      );
      users.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create addresses for each user
    console.log('Creating addresses...');
    const addressRepository = dataSource.getRepository(Address);
    const addresses: Address[] = [];
    const addressData = [
      {
        address: '123 Main St',
        district: 'Downtown',
        state: 'California',
        pincode: '90001',
      },
      {
        address: '456 Oak Ave',
        district: 'Westside',
        state: 'New York',
        pincode: '10001',
      },
      {
        address: '789 Pine Rd',
        district: 'Eastside',
        state: 'Texas',
        pincode: '75001',
      },
      {
        address: '321 Elm St',
        district: 'Northside',
        state: 'Florida',
        pincode: '33101',
      },
      {
        address: '654 Maple Dr',
        district: 'Southside',
        state: 'Illinois',
        pincode: '60601',
      },
    ];

    for (let i = 0; i < users.length; i++) {
      const address = addressRepository.create({
        ...addressData[i],
        user: users[i],
      });
      await addressRepository.save(address);
      addresses.push(address);
      console.log(`Created address for ${users[i].name}`);
    }

    // Create 15 products across 5 categories
    console.log('Creating products...');
    const productRepository = dataSource.getRepository(Product);
    const products: Product[] = [];

    for (const [category, items] of Object.entries(productsByCategory)) {
      for (const item of items) {
        const product = productRepository.create({
          name: item.name,
          price: item.price,
          stock: getRandomInt(50, 200),
          category: category,
        });
        await productRepository.save(product);
        products.push(product);
        console.log(`Created product: ${product.name} in ${category}`);
      }
    }

    // Create cart items (total 20 items, 2-5 per user)
    console.log('Creating cart items...');
    const cartRepository = dataSource.getRepository(Cart);
    let cartItemsCreated = 0;
    const cartItemsPerUser = [4, 5, 4, 3, 4]; // Total = 20

    for (let i = 0; i < users.length; i++) {
      const numCartItems = cartItemsPerUser[i];
      const selectedProducts = shuffleArray(products).slice(0, numCartItems);

      for (const product of selectedProducts) {
        const cart = cartRepository.create({
          user: users[i],
          product: product,
          quantity: getRandomInt(1, 5),
        });
        await cartRepository.save(cart);
        cartItemsCreated++;
      }
      console.log(`Created ${numCartItems} cart items for ${users[i].name}`);
    }
    console.log(`Total cart items created: ${cartItemsCreated}`);

    // Create orders and order items (total 20 orders, 2-5 per user)
    console.log('Creating orders and order items...');
    const orderRepository = dataSource.getRepository(Order);
    const orderItemRepository = dataSource.getRepository(OrderItem);
    let ordersCreated = 0;
    const ordersPerUser = [4, 5, 4, 3, 4]; // Total = 20
    const orderStatuses = Object.values(OrderStatus);

    for (let i = 0; i < users.length; i++) {
      const numOrders = ordersPerUser[i];

      for (let j = 0; j < numOrders; j++) {
        const numOrderItems = getRandomInt(1, 6);
        const selectedProducts = shuffleArray(products).slice(0, numOrderItems);

        let totalAmount = 0;

        // Calculate total amount first and prepare order items data
        const orderItemsData = selectedProducts.map((product) => {
          const quantity = getRandomInt(1, 5);
          const totalPrice = product.price * quantity;
          totalAmount += totalPrice;
          return {
            product,
            quantity,
            totalPrice,
          };
        });

        // Create and SAVE the order first with the calculated total
        const order = orderRepository.create({
          user: users[i],
          address: addresses[i],
          total_amount: totalAmount,
          status: getRandomItem(orderStatuses),
        });

        // Save the order to get the ID before creating order items
        await orderRepository.save(order);

        // Now create order items with the saved order
        for (const itemData of orderItemsData) {
          const orderItem = orderItemRepository.create({
            order: order,
            product: itemData.product,
            quantity: itemData.quantity,
            total_price: itemData.totalPrice,
          });
          await orderItemRepository.save(orderItem);
        }

        ordersCreated++;

        console.log(
          `Created order ${ordersCreated} for ${users[i].name} with ${numOrderItems} items (Total: $${totalAmount.toFixed(2)})`,
        );
      }
    }
    console.log(`Total orders created: ${ordersCreated}`);

    console.log('\n=== Seeding Summary ===');
    console.log(`Users: ${users.length}`);
    console.log(`Addresses: ${addresses.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Cart Items: ${cartItemsCreated}`);
    console.log(`Orders: ${ordersCreated}`);
    console.log('======================\n');
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

// Export the function so you can call it from main.ts
export { seedDatabase };