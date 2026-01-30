## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
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
├── services/        # API service layer
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

- `/menu`: Menu overview (all items)
- `/cart`: Shopping cart
- `/checkout`: Checkout process
- `/orders`: Order history
- `/order-confirmation/:orderId`: Order confirmation details
- `/orders/:orderId`: Order tracking details
