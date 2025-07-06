# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 3D interactive wallet architecture visualization built with TypeScript and Babylon.js. It displays a comprehensive托管钱包系统架构图 with beautiful 3D components, interactive features, and real-time animations.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (opens browser at localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

### Core Components

- **WalletVisualization.ts** - Main orchestrator class that sets up the 3D scene, camera, lighting, and coordinates all other components
- **WalletArchitecture.ts** - Creates all 3D wallet architecture components (servers, databases, APIs, security modules, interfaces, blockchain)
- **MaterialManager.ts** - Manages all PBR/Standard materials with custom textures and visual effects for different component types
- **InteractionManager.ts** - Handles all user interactions (hover effects, click actions, GUI panels, animations)
- **main.ts** - Application entry point and lifecycle management

### Architecture Components

The system visualizes these key wallet infrastructure components:

1. **Core Layer**: Core servers, load balancers, cache systems
2. **Security Layer**: HSM modules, multi-signature services, risk control
3. **Database Layer**: Primary databases, backup systems, audit logs  
4. **API Layer**: API gateways, user APIs, transaction APIs
5. **Interface Layer**: Web UI, mobile apps, admin panels
6. **Blockchain Layer**: Blockchain nodes, smart contracts, cross-chain bridges

### Key Features

- **Interactive 3D Visualization**: Mouse controls for rotation, zoom, and pan
- **Component Hover Effects**: Highlight effects and information panels
- **Click Actions**: Detailed component information and connection highlighting
- **Visual Effects**: PBR materials, particle systems, glow effects, animations
- **Real-time Data Flow**: Animated particles showing data movement
- **Auto-rotation Mode**: Automated camera movement
- **Wireframe Toggle**: Switch between solid and wireframe rendering

## Technology Stack

- **Babylon.js 7.8.1** - 3D graphics engine
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## Development Notes

- All components use PBR materials for realistic rendering
- Hover and click interactions are handled through Babylon.js ActionManager
- GUI elements use Babylon.js GUI system for 2D overlays
- Animation system uses Babylon.js Animation class for smooth transitions
- Materials include custom procedural textures for each component type
- Scene includes advanced lighting with shadows and post-processing effects