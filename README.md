# Next.js Kubernetes Pod Viewer 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-informational)](https://nextjs.org/)

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description
A simple Next.js dashboard that lists all Kubernetes pods and lets you click to view detailed info—powered solely by Next.js Server Actions, no extra API layers. 🌐

## Features
- List all pods in a Kubernetes cluster.
- Click on any pod to see detailed status, logs, and metadata.
- Fully server-driven with Next.js Server Actions (no client-side API calls).
- Responsive UI built with React and Tailwind CSS.

## Tech Stack
- **Next.js 14** with Server Actions
- **React** for UI components
- **Tailwind CSS** for styling
- **@kubernetes/client-node** for interacting with Kubernetes API

## Prerequisites
- Node.js >= 18
- npm or yarn
- Access to a Kubernetes cluster
- Valid `kubeconfig` on your machine (`~/.kube/config`)

## Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nextjs-k8s-pod-viewer.git
   cd nextjs-k8s-pod-viewer
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

## Environment Variables
Create a `.env.local` in the project root and add:
```env
KUBE_CONFIG_PATH=/home/your-user/.kube/config
NODE_ENV=development
```

## Running Locally
Start the development server:
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Navigate to the **Pods** page to see a live list of pods in your cluster.
- Click on any pod to view detailed metadata, status conditions, and recent logs.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

Please follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.