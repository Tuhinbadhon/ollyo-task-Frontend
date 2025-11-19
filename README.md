# Device Simulator Web Application

A React-based web application that allows users to interact with and control virtual devices (Light and Fan) in a drag-and-drop sandbox environment.

## 🎯 Features

### Drag-and-Drop Interface

- **Sidebar**: Contains draggable devices (Light, Fan) and saved presets
- **Testing Canvas**: Droppable workspace where devices can be placed and controlled
- **Visual Feedback**: Highlighted drop zones and drag states

### Device Controllers

#### 💡 Light Device

- **Power Toggle**: ON/OFF switch
- **Brightness Slider**: 0-100% control
- **Color Temperature**: 5 preset options (Warm, Neutral, Cool, Pink, Purple)
- **Real-time Visualization**: Light appearance changes based on settings

#### 🌀 Fan Device

- **Power Toggle**: ON/OFF switch
- **Speed Slider**: 0-100% control
- **Real-time Animation**: Fan rotation speed changes dynamically
- **Speed Indicators**: Visual feedback for Slow/Medium/Fast speeds

### Preset Management

- **Save Presets**: Save current device configuration with a custom name
- **Load Presets**: Drag saved presets onto the canvas to restore configurations
- **Persistent Storage**: Devices and presets are persisted via browser localStorage by default

## 🛠️ Tech Stack

A concise, clean summary of the technologies used throughout this project — grouped by layer for quick scanning.

### Stack at a glance

| Layer                | Technologies                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Core                 | **Next.js 16** (App Router) • **React 19** • **TypeScript v5**                                                    |
| Styling & UI         | **Tailwind CSS v4**, **clsx**, **tailwind-merge**, **lucide-react**, **@radix-ui/react-slot**, **tw-animate-css** |
| API & Utilities      | **Axios**, **date-fns**, **react-hot-toast**                                                                      |
| Drag & Drop          | **react-dnd**, **react-dnd-html5-backend**                                                                        |
| State & Storage      | React Hooks (useState, useEffect) • Browser localStorage                                                          |
| Developer Experience | ESLint (Next.js configuration), **@types/react**, **@types/react-dom**, **@types/node**                           |

---

### Details & Notes

- Core: Built on Next.js 16 and React 19 for a modern React app with the App Router, server and client components, and optimized builds.
- Language: TypeScript v5 for type safety and modern TS features.
- Styling & UI: Tailwind CSS v4 for utility-first styling; `clsx` and `tailwind-merge` help conditionally compose classNames. `lucide-react` provides icons while `@radix-ui/react-slot` simplifies UI composition and component composition patterns. Animations handled with `tw-animate-css`.
- API & Data Utilities: Axios for HTTP calls, date-fns for date handling, and `react-hot-toast` for lightweight toast notifications.
- Drag & Drop: User interactions are implemented using `react-dnd` and `react-dnd-html5-backend` for a native-like DnD experience in the browser.
- State & Storage: Local device state is managed using React hooks (`useState`, `useEffect`) with persistence backed by the browser `localStorage`.
- Developer Experience: ESLint configured with the Next.js ruleset; type definitions installed for React and Node.

> Tip: The project is intentionally lightweight and designed to be easy to extend — add more devices, store presets on a backend, or integrate features like automation and scheduling.

## 📁 Project Structure

```
ollyo-task/
├── app/
│   └── (pages)/
│       └── page.tsx              # Main application page
├── components/
│   ├── simulator/
│   │   ├── Canvas.tsx            # Droppable canvas component
│   │   ├── Sidebar.tsx           # Sidebar with devices and presets
│   │   ├── DeviceLight.tsx       # Light controller component
│   │   ├── DeviceFan.tsx         # Fan controller component
│   │   └── Preset.tsx            # Preset item component
│   └── ui/                       # shadcn/ui components
├── types/
│   └── simulator.ts              # TypeScript type definitions
├── utils/
│   └── storage.ts                # backend API helpers for devices & presets
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

1. **Add Devices**: Drag a Light or Fan from the sidebar onto the canvas
2. **Control Devices**:
   - Toggle power switches
   - Adjust brightness/speed with sliders
   - Change light color temperature
3. **Save Configuration**: Click "Save" button in the Presets section and enter a name
4. **Load Preset**: Drag a saved preset from the sidebar onto the canvas
5. **Remove Devices**: Click the ✕ button on any device controller

## 🎨 Architecture

### State Management

- Main application state managed in `page.tsx`
- Device settings passed down as props
- Callback functions for updates propagated up

### Drag-and-Drop Flow

1. Sidebar items are wrapped with `useDrag` hook
2. Canvas is wrapped with `useDrop` hook
3. On drop, callbacks create/restore devices
4. React state updates trigger re-render

### Data Persistence

- Devices and presets are loaded via the backend API and persisted on Save Preset
- Data loaded on initial render using lazy initialization
- Separate storage keys for devices and presets

## 🎯 Features Implemented

✅ Drag-and-drop interface with react-dnd  
✅ Dynamic device controllers (Light & Fan)  
✅ Real-time visual updates  
✅ Power toggles with smooth animations  
✅ Brightness/Speed sliders  
✅ Color temperature selection  
✅ Preset save/load functionality  
✅ Backend API persistence  
✅ Responsive design  
✅ TypeScript type safety  
✅ Clean, modular component architecture

## 📝 Notes

- This is a frontend-only implementation and uses browser-localStorage for persistence by default.
- The repository includes optional API helpers in `utils/storage.ts` if you want to integrate a backend later; set `API_BASE` accordingly.
- Device settings are stored in JSON format for easy serialization
- The app is fully responsive and works on desktop and tablet devices

## 🔜 Future Enhancements

- Backend API integration (PHP/MySQL)
- More device types (Thermostat, Smart Plug, etc.)
- Advanced preset management (edit, delete)
- Export/Import configurations
- Multi-room/zone support
- Device grouping and scenes
- Scheduling and automation rules

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# ollyo-task-Frontend
