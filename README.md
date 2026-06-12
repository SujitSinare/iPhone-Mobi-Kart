# iPhone Mobi Kart

React 19 + Vite e-commerce application for customer shopping and admin inventory management.

## Phase Status

Phase 1 is complete:

- Vite React project structure
- Tailwind CSS setup
- React Router route configuration
- Redux Toolkit store configuration
- `authSlice`, `productSlice`, `cartSlice`, and `orderSlice`
- Local storage utility functions
- Protected route scaffolding
- Public, customer, admin, and 404 page shells
- Reusable layout and state components

Phase 2 is complete:

- Customer registration with name, mobile number, email, date of birth, and password
- Duplicate email prevention
- Customer login with registered credentials
- Admin login from application configuration
- Persisted users and authentication state in local storage
- Role-based redirects through protected routes
- Auth-aware navbar with logout

Phase 3 is complete:

- Customer product search by name, brand, category, and description
- Admin inventory search
- Admin add product form
- Admin edit product workflow
- Admin delete product action
- Inline stock quantity management
- Product changes persisted in local storage

Phase 4 is complete:

- Add products to cart from listing and details
- Persist cart in local storage
- Update cart quantities
- Remove cart items
- Cart totals and checkout navigation
- Checkout form with delivery details
- Stock validation before order placement
- Order creation persisted in local storage
- Inventory stock reduction after checkout
- Basic customer dashboard order summary
- Admin dashboard customer order view

Phase 5 is complete:

- Full customer order history at `/orders`
- Order cards with status, totals, item details, and delivery information
- Customer profile management
- Profile updates persisted to local storage
- Duplicate email validation during profile updates
- Optional password update
- Order history links in customer navigation

All requested phases are now implemented.

## Run

```bash
npm install
npm run dev
```
