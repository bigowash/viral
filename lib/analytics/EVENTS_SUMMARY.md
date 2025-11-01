# PostHog Events Tracking Summary

This document lists all PostHog events being tracked in the application.

## Automatic Events (via PostHog autocapture)

- **Page views**: Automatically tracked via `capture_pageview: true`
- **Page leaves**: Automatically tracked via `capture_pageleave: true`
- **Button clicks**: Automatically tracked via `autocapture: true`
- **Form interactions**: Automatically tracked via `autocapture: true`

## Custom Events

### Auth Events

#### `user_signed_in`
- **Trigger**: When a user successfully signs in
- **Properties**:
  - `team_id`: User's team ID (if any)
  - `has_team`: Boolean indicating if user has a team
- **Location**: `app/[locale]/(login)/actions.ts` (server-side)

#### `user_signed_up`
- **Trigger**: When a new user successfully signs up
- **Properties**:
  - `team_id`: New team ID
  - `role`: User role (owner, admin, member)
  - `has_invitation`: Boolean indicating if sign-up was via invitation
  - `created_team`: Boolean indicating if team was created
- **Location**: `app/[locale]/(login)/actions.ts` (server-side)

#### `user_signed_out`
- **Trigger**: When a user signs out
- **Properties**:
  - `team_id`: User's team ID (if any)
- **Location**: `app/[locale]/(login)/actions.ts` (server-side)

### Team Events

#### `team_created`
- **Trigger**: When a new team is created during sign-up
- **Properties**:
  - `team_id`: New team ID
- **Location**: `app/[locale]/(login)/actions.ts` (server-side)

#### `team_member_invited`
- **Trigger**: When a team member invitation is sent
- **Properties**:
  - `team_id`: Team ID
  - `invited_email`: Email of invited user
  - `role`: Role assigned to invite
- **Location**: `app/[locale]/(login)/actions.ts` (server-side)

#### `invitation_accepted`
- **Trigger**: When a user accepts a team invitation
- **Properties**:
  - `team_id`: Team ID
  - `role`: Role assigned to user
- **Location**: `app/[locale]/(login)/actions.ts` (server-side)

### Checkout Events

#### `checkout_initiated`
- **Trigger**: When a checkout session is created
- **Properties**:
  - `team_id`: Team ID
  - `price_id`: Stripe price ID
  - `session_id`: Stripe checkout session ID
- **Location**: `lib/payments/stripe.ts` (server-side)

#### `checkout_completed`
- **Trigger**: When checkout is successfully completed
- **Properties**:
  - `team_id`: Team ID
  - `customer_id`: Stripe customer ID
  - `subscription_id`: Stripe subscription ID
  - `plan_name`: Name of the subscription plan
  - `subscription_status`: Status of subscription
  - `price_id`: Stripe price ID
  - `amount`: Subscription amount
  - `currency`: Currency code
  - `interval`: Billing interval (month, year, etc.)
- **Location**: `app/api/stripe/checkout/route.ts` (server-side)

### Navigation Events

#### `page_viewed`
- **Trigger**: On every route change (automatic + custom tracking)
- **Properties**:
  - `route`: Current route path
  - `full_path`: Full path including query params
  - `locale`: Current locale
  - `page_type`: Type of page (landing, pricing, dashboard, etc.)
  - `has_query_params`: Boolean indicating if URL has query params
- **Location**: `lib/analytics/page-view-tracker.tsx` (client-side)

#### `link_clicked`
- **Trigger**: When any link is clicked
- **Properties**:
  - `link_destination`: URL destination
  - `link_text`: Text content of the link
  - `link_location`: Location of link (header, footer, pricing_card, etc.)
  - `locale`: Current locale
  - Additional context-specific properties (e.g., `plan_name` for pricing links)
- **Location**: Various components (Header, Pricing, Login, etc.)

#### `button_clicked`
- **Trigger**: When buttons are clicked (explicit tracking for important buttons)
- **Properties**:
  - `button_name`: Name/identifier of button
  - `button_location`: Location of button (header, user_menu, pricing_card, etc.)
  - `button_text`: Text content of button
  - `locale`: Current locale
  - Additional context-specific properties
- **Location**: Various components

#### `navigation_toggled`
- **Trigger**: When user toggles between Brands/Creators view on landing page
- **Properties**:
  - `view`: Selected view (brands or creators)
  - `is_active`: Boolean indicating if this is the active view
  - `locale`: Current locale
- **Location**: `components/Header/index.tsx`

### Form Events

#### `form_started`
- **Trigger**: When a form is first displayed
- **Properties**:
  - `form_name`: Name of form (sign_in, sign_up, etc.)
  - `has_redirect`: Boolean indicating if redirect is present
  - `has_price_id`: Boolean indicating if price ID is present
  - `has_invite_id`: Boolean indicating if invite ID is present
  - `locale`: Current locale
- **Location**: `components/Login/index.tsx`

#### `form_submitted`
- **Trigger**: When a form is submitted
- **Properties**:
  - `form_name`: Name of form (sign_in, sign_up, etc.)
  - `locale`: Current locale
- **Location**: `components/Login/index.tsx`

### Dashboard Events

#### `dashboard_viewed`
- **Trigger**: When any dashboard page is viewed
- **Properties**:
  - `section`: Dashboard section (dashboard, dashboard_security, dashboard_activity, dashboard_general)
  - `locale`: Current locale
  - `route`: Current route
- **Location**: `lib/analytics/page-view-tracker.tsx`

#### `dashboard_section_viewed`
- **Trigger**: When a specific dashboard section is viewed
- **Properties**:
  - `section`: Section name (security, activity, general)
  - `locale`: Current locale
  - `route`: Current route
- **Location**: `lib/analytics/page-view-tracker.tsx`

### Pricing Events

#### `pricing_page_viewed`
- **Trigger**: When pricing page is viewed
- **Properties**:
  - `locale`: Current locale
- **Location**: `components/Pricing/index.tsx`

#### `pricing_plan_viewed`
- **Trigger**: When a pricing plan card scrolls into view
- **Properties**:
  - `plan_name`: Name of the pricing plan
  - `is_free`: Boolean indicating if this is a free plan
  - `locale`: Current locale
- **Location**: `components/Pricing/index.tsx`

#### `pricing_cta_clicked`
- **Trigger**: When a pricing CTA button is clicked
- **Properties**:
  - `plan_name`: Name of the pricing plan
  - `cta_text`: Text of the CTA button
  - `cta_destination`: URL destination
  - `is_free`: Boolean indicating if this is a free plan
  - `locale`: Current locale
- **Location**: `components/Pricing/index.tsx`

### Language Events

#### `language_changed`
- **Trigger**: When user changes language
- **Properties**:
  - `from_locale`: Previous locale
  - `to_locale`: New locale
  - `pathname`: Current pathname
- **Location**: `components/LanguageSwitcher/index.tsx`

### User Menu Events

#### `user_menu_opened`
- **Trigger**: When user menu dropdown is opened
- **Properties**:
  - `locale`: Current locale
- **Location**: `components/Header/index.tsx`

#### `user_menu_clicked`
- **Trigger**: When a user menu item is clicked
- **Properties**:
  - `menu_item`: Item clicked (dashboard, sign_out, etc.)
  - `locale`: Current locale
- **Location**: `components/Header/index.tsx`

## Event Naming Convention

Events follow a consistent naming pattern:
- Use snake_case
- Be descriptive and action-oriented
- Group by feature area (user_, team_, checkout_, etc.)

## Tracking Implementation

- **Server-side events**: Use `lib/analytics/posthog-server.ts`
- **Client-side events**: Use `usePostHogClient()` hook from `lib/analytics/posthog.ts`
- **Event names**: Defined in `lib/analytics/events.ts`

