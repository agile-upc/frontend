# Agrotech Frontend

Angular frontend for the Agrotech advisory platform. The app is focused on connecting producers with agricultural advisors through advisor discovery, available schedules, appointment booking, consultation context, reviews, notifications, and AI-assisted advisor recommendations.

## Stack

- Angular 19
- Angular Material
- Tabler Icons
- RxJS
- ngx-toastr

## Product Scope

The authenticated app navigation is centered on the advisory MVP:

- Farmers can browse the advisor catalog and open advisor detail pages.
- Advisor cards and detail pages show profile data such as profession, experience, rating, location, description, and availability.
- Farmers can book an available advisor slot and include the consultation message.
- Advisors can manage available schedule slots.
- Farmers and advisors can view appointment details, including the consultation message.
- The AI chat recommends advisor candidates and preserves the suggested consultation message when moving to advisor detail or booking.
- Role-specific defaults send farmers to `/apps/farmer/catalog` and advisors to `/apps/advisor/appointments`.

Generic dashboard/template/demo routes are not part of the visible authenticated product scope.

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm start -- --host 127.0.0.1
```

The app is available at `http://127.0.0.1:4200`.

## Build

```bash
npm run build
```

## Environment

API configuration lives in:

- `src/environments/environment.ts`
- `src/environments/environment.production.ts`

Set `apiUrl` to the backend base API URL, for example `http://localhost:8080/api/v1`.

## Verification

Before submitting frontend changes, run:

```bash
npm run build
```
