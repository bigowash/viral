/**
 * PostHog Event Names
 * 
 * Centralized event naming for consistency across the application.
 */

export const PostHogEvents = {
  // Auth Events
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_OUT: 'user_signed_out',
  
  // Team Events
  TEAM_CREATED: 'team_created',
  TEAM_MEMBER_INVITED: 'team_member_invited',
  INVITATION_ACCEPTED: 'invitation_accepted',
  
  // Checkout Events
  CHECKOUT_INITIATED: 'checkout_initiated',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_CANCELLED: 'checkout_cancelled',
  
  // Navigation Events
  PAGE_VIEWED: 'page_viewed',
  LINK_CLICKED: 'link_clicked',
  BUTTON_CLICKED: 'button_clicked',
  NAVIGATION_TOGGLE: 'navigation_toggled',
  
  // Form Events
  FORM_STARTED: 'form_started',
  FORM_SUBMITTED: 'form_submitted',
  FORM_FIELD_FOCUSED: 'form_field_focused',
  
  // Dashboard Events
  DASHBOARD_VIEWED: 'dashboard_viewed',
  DASHBOARD_SECTION_VIEWED: 'dashboard_section_viewed',
  
  // Pricing Events
  PRICING_PAGE_VIEWED: 'pricing_page_viewed',
  PRICING_PLAN_VIEWED: 'pricing_plan_viewed',
  PRICING_CTA_CLICKED: 'pricing_cta_clicked',
  
  // Language Events
  LANGUAGE_CHANGED: 'language_changed',
  
  // User Menu Events
  USER_MENU_OPENED: 'user_menu_opened',
  USER_MENU_CLICKED: 'user_menu_clicked',
} as const;

export type PostHogEventName = typeof PostHogEvents[keyof typeof PostHogEvents];

