# Inventory Management System - Frontend

A modern, responsive frontend for the Inventory Management System built with **React 19**, **TypeScript**, and **Vite**. This application provides a comprehensive dashboard for administrators to manage products, categories, suppliers, orders, and users, as well as a user portal for browsing products and tracking orders.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)
![Vite](https://img.shields.io/badge/vite-6.0-purple)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-4.0-38b2ac)

---

## 🚀 Features

### for Administrators

- **Dashboard**: Real-time overview of stats, low stock alerts, and recent orders.
- **Product Management**: Create, update, delete products with image uploads and stock tracking.
- **Inventory Control**: Categorize items, manage suppliers, and monitor stock levels.
- **Order Management**: Process customer orders, update statuses, and view history.
- **User Management**: Manage system users and role-based access control.

### for Users

- **Browse Products**: View available inventory with search and filtering.
- **Order History**: Track status of personal orders.
- **Profile Management**: Update personal information and settings.

### Technical Highlights

- **Performance**: Built on Vite for lightning-fast HMR and bundling.
- **Type Safety**: Fully typed with TypeScript for reliable code.
- **Validation**: Robust form validation using Zod and React Hook Form.
- **State Management**: Zustand for global state (Auth/Theme) and SWR for server state.
- **Styling**: Modern, responsive design with Tailwind CSS v4 and Shadcn/UI components.
- **UX**: Toast notifications, dialogs, loading states, and responsive layouts.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 📂 Project Structure

```bash
src/
├── api/            # API client and endpoints
│   ├── hooks/      # SWR data fetching hooks
│   ├── axios.ts    # Configured Axios instance
│   └── endpoints.ts # API URL constants
├── components/     # React components
│   ├── common/     # Reusable logic (DataTable, Search)
│   ├── dashboard/  # Dashboard specific widgets
│   ├── layout/     # Sidebar, Header, Main Layouts
│   ├── ui/         # Shadcn/UI primitive components
│   └── [feature]/  # Feature-specific forms (products, users, etc.)
├── config/         # App configuration (themes, constants)
├── hooks/          # Custom utility hooks (useDebounce)
├── lib/            # Utilities (tailwind-merge, etc.)
├── pages/          # Application views/routes
│   ├── admin/      # Admin protected routes
│   ├── auth/       # Login/Register pages
│   └── user/       # User protected routes
├── schemas/        # Zod validation schemas
├── store/          # Global Zustand stores (Auth, Theme)
└── types/          # TypeScript interface definitions
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abdooo2235/inventory-app-frontend.git
   cd inventory-app-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
