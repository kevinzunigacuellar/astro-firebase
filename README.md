# Astro Firebase example

This is a simple example of how to use Astro SSR with Firebase. 

## Description

This is a birthday reminder app that allows you to store your friends birthdays and shows how many days are left until their birthday.

## Firebase services used

- Firestore
- Firebase Authentication

## Stack

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [Solid.js](https://solidjs.com)

## Prerequisites

To run this example you need a Firebase project. You can create one from the [Firebase console](https://console.firebase.google.com/).

Because this app is server side rendered (SSR), it requires both Admin SDK and Client SDK credentials.

- You can get your client credentials from the Firebase project settings under the "General" tab.
- You can get your admin credentials from the Firebase project settings under the "Service accounts" tab.

Update your client credentials in `src/lib/firebase/client` and your admin credentials in `src/lib/firebase/server` and `.env` with your own.

## Getting started

Install the dependencies

```bash
pnpm install
```

To start the dev server

```bash
pnpm dev
```

> This app uses the Vercel adapter for Astro. If you would like to use a different adapter, you can install it and update the `astro.config.mjs` file.