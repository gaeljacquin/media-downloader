# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Media Downloader is a desktop application built with Tauri (Rust backend) + React + TypeScript (frontend) that serves as a GUI for yt-dlp. It provides a user-friendly interface for downloading media content with various options and settings.

## Development Commands

### Frontend (React/TypeScript/Vite)
- `pnpm dev` - Start development server (Vite)
- `pnpm build` - Build frontend (TypeScript compilation + Vite build)
- `pnpm preview` - Preview production build

### Tauri (Full Application)
- `pnpm tauri dev` - Start Tauri development mode (launches both frontend and backend)
- `pnpm tauri build` - Build production application

## Architecture

### Frontend Structure
- **State Management**: Uses Zustand with persistence for global state (`src/stores/useAppStore.ts`)
- **UI Components**: Built with shadcn/ui (Radix UI + Tailwind CSS) in `src/components/ui/`
- **Views**: Main application views in `src/components/views/` (HomeView, LogsView, NotesView, SettingsView)
- **Navigation**: View-based navigation with unsaved changes protection
- **Theme System**: Custom theme hook in `src/hooks/useTheme.ts` with next-themes integration

### Backend Structure (src-tauri/)
- **Language**: Rust with Tauri framework
- **Plugins**: Uses Tauri plugins for system integration (opener, notification, dialog, OS, shell)
- **Process Handling**: Tokio for async operations, particularly for spawning yt-dlp processes

### Key Application Features
- **Download Management**: Supports URL and file-based downloads with audio-only options
- **Logging System**: Real-time log display with progress updates (handles yt-dlp output)
- **Notes System**: Persistent notes with unsaved changes detection
- **Settings**: Configurable save paths, themes, notifications, and font sizes
- **Theme Support**: Light/dark mode with multiple color schemes

### State Architecture
The app uses a centralized Zustand store (`useAppStore`) with these main sections:
- **Settings**: App configuration (save path, theme, notifications, etc.)
- **Download**: Current download options and status
- **Logs**: Real-time logging with special handling for download progress
- **Navigation**: Current view state with unsaved changes protection
- **Notes**: Persistent notes with temporary editing state

### Configuration Files
- `components.json` - shadcn/ui configuration
- `tailwind.config.js` - Tailwind CSS configuration with custom theme support
- `src-tauri/tauri.conf.json` - Tauri app configuration
- `src-tauri/Cargo.toml` - Rust dependencies and build configuration

## Development Notes

### Package Manager
This project uses `pnpm` as the package manager.

### Frontend Development
- React components follow functional component patterns with hooks
- TypeScript is strictly configured
- UI components are pre-built with shadcn/ui
- State management uses Zustand with middleware for persistence

### Backend Development
- Tauri commands handle communication between frontend and backend
- Shell operations are handled through Tauri plugins
- Process spawning uses tokio for async execution

### Type Definitions
All types are centralized in `src/types/index.ts` covering:
- AppSettings
- DownloadOptions
- LogEntry
- Note/TempNote structures