# Restaurant Order Booking Platform 🍽️

A modern, responsive web application for browsing restaurant menus, adding items to a cart, customizing orders, and tracking order history. Built with Vue 3, Vite, Pinia, and Tailwind CSS.

## 🚀 Features

- **Menu Browsing**: Browse items by category with lazy-loaded images
- **Search & Filter**: Real-time search and sorting capabilities
- **Detailed Item View**: View item details, nutritional info, and add customizations
- **Shopping Cart**: Manage items, update quantities, and clear cart
- **Multi-step Checkout**: Smooth checkout process with validation
- **Order Management**: Track current orders and view order history
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Persistent Data**: Cart and order history saved to local storage

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router 4 (Nested & Dynamic Routes)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Icons**: Emoji & CSS-based
- **Persistence**: LocalStorage API

## 📦 Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── common/      # Generic components (Buttons, Modals, etc.)
│   ├── menu/        # Menu-related components
│   └── cart/        # Cart-related components
├── views/           # Page-level components
├── stores/          # Pinia stores for state management
├── services/        # API service layer (simulated)
├── composables/     # Reusable logic (hooks)
├── utils/           # Helper functions
└── data/            # Static data
```

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-order-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Pages & Routes

- `/`: Home landing page
- `/menu`: Menu overview (all items)
- `/menu/:category`: Filter by category
- `/menu/:category/:itemId`: Item details
- `/cart`: Shopping cart
- `/checkout`: Checkout process
- `/orders`: Order history
- `/orders/:orderId`: Order tracking details

## 🎨 Design System

The application uses a custom Tailwind configuration with:
- **Primary Color**: Red-600 (Food theme)
- **Typography**: Inter (Body) & Poppins (Headings)
- **Components**: Consistent cards, buttons, and inputs

## 📄 License

MIT License - feel free to use for your own projects!
