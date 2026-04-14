# Overview

This repository houses an Enterprise Resource Planning (ERP) application built using Next.js, a React-based framework. This ERP solution is designed to streamline and integrate various business processes within an organization, providing a centralized platform for managing resources and improving efficiency.

Next.js uses a file-system based router where folders are used to define routes.

Each folder represents a route segment that maps to a URL segment. To create a nested route, you can nest folders inside each other. For reference [Next Router Concept](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)

# Technology used

### `Framework - Next.js@13.4`

### `Component Library - Ant design@5`

### `Forms - Formik@2.4 and YUP@1.3`

# Project folder structure

## Important note

1. `Underscore( \_ )` defines that particular folder is not routable

2. `(groupName)` bracket defines the screen groupings, which is not routable either.

3. `[slug]` this defines the dynamic routing, which is routable

4. `page.tsx` mainly focused on fetching initial data from API on server side and send fetched data as a prop to client component. page.tsx should always need to be a server component unless any particular requirement.

5. This application uses modular css. so every css file should have suffix like `FileName.module.css`

## Structure

- src `(Root project folder)`

  - app
  - \_components `(Un-reusable components)`
  - api `(creates a inner api which hits an actaul api. By this we may prevent exposing a original API Url)`
    - procurement
    - order
      - route.ts `(Now the endpoint is '/api/procurement/order')`
  - dashboard
    - (admin)
    - (inventory)
    - (procurement)
    - procurement-order
      - (transaction-screen)
        - [slug]
          - page.tsx
          - OrderTransactionScreen.tsx
      - constants `(Contains constants for particular screen)`
      - page.tsx
      - OrderScreenClient.tsx `(This is client component file, which actually receives initial data from page.tsx )`
    - procurement-receive
  - components `(Contains reusable components across the application)`
    - DrawerComponent
      - DrawerComponent.tsx
      - DrawerComponent.module.css
    - ModalComponent
      - ModalComponent.tsx
      - ModalComponent.module.css
  - lib `(Contains #helpers, #interface, #constants, #Middleware)`
    - constants
      - dashboard.ts
      - sideMenu.ts
    - helpers
      - dateFormat.ts
      - filterHelpers.ts
    - interfaces
      - procurement-interface
      - vendorPerformance.interface.ts
      - ui.interface.ts
    - middleware
      - client
      - server
      - apiMiddleware.ts

###

# To start the project

### In Local

> `npm install`

> `npm run dev`

### In Production

> `npm run build`

> `npm start`

# Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
