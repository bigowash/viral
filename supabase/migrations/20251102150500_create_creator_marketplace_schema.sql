-- Migration: Creator Marketplace Platform - Complete Schema
-- Creates all tables, enums, indexes for the creator-brand marketplace

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User & Account Types
CREATE TYPE account_type AS ENUM ('brand_member', 'creator');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deactivated', 'cancelled');
CREATE TYPE activity_status AS ENUM ('onboarding', 'active_hiring', 'idle', 'dormant');
CREATE TYPE work_status AS ENUM ('available', 'busy', 'unavailable', 'on_break');

-- Onboarding Status
CREATE TYPE brand_onboarding_status AS ENUM ('started', 'profile_completed', 'payment_setup', 'completed');
CREATE TYPE creator_onboarding_status AS ENUM ('started', 'profile_completed', 'socials_linked', 'portfolio_added', 'payment_setup', 'completed');

-- Brand Member Roles & Status
CREATE TYPE brand_member_role AS ENUM ('owner', 'admin', 'manager', 'member');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined');

-- Transaction Types
CREATE TYPE brand_transaction_type AS ENUM ('deposit', 'allocation', 'payment_with_fee', 'refund');
CREATE TYPE creator_transaction_type AS ENUM ('earning', 'withdrawal', 'bonus', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Social Media
CREATE TYPE social_account_type AS ENUM ('personal', 'job_specific');
CREATE TYPE social_platform AS ENUM ('instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin');
CREATE TYPE social_account_status AS ENUM ('active', 'inactive', 'suspended', 'deleted');
CREATE TYPE post_type AS ENUM ('feed', 'story', 'reel', 'video', 'carousel', 'short');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'deleted');

-- Creator Preferences
CREATE TYPE willing_to_show_face AS ENUM ('yes', 'no', 'depends');
CREATE TYPE account_preference AS ENUM ('personal_only', 'create_new', 'manage_existing', 'any');
CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'expert');
CREATE TYPE experience_source_type AS ENUM ('manual', 'linkedin', 'platform_job');

-- Job & Application
CREATE TYPE job_status AS ENUM ('draft', 'open', 'in_progress', 'closed', 'completed', 'cancelled');
CREATE TYPE job_visibility AS ENUM ('public', 'private', 'invite_only');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'accepted', 'rejected', 'withdrawn');

-- Contract & Deliverables
CREATE TYPE contract_status AS ENUM ('pending_creator', 'pending_brand', 'active', 'completed', 'terminated', 'disputed');
CREATE TYPE payment_terms AS ENUM ('per_post', 'per_milestone', 'project_total', 'hourly');
CREATE TYPE deliverable_type AS ENUM ('post', 'video', 'story', 'reel', 'article', 'other');
CREATE TYPE deliverable_status AS ENUM ('pending', 'submitted', 'under_review', 'revision_requested', 'approved', 'rejected');
CREATE TYPE payment_type AS ENUM ('post_approval', 'milestone', 'upfront', 'completion_bonus');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Reviews
CREATE TYPE reviewee_type AS ENUM ('brand', 'creator');

-- Messaging
CREATE TYPE conversation_status AS ENUM ('active', 'archived');
CREATE TYPE participant_role AS ENUM ('brand_member', 'creator', 'co_creator');

-- Sentiment
CREATE TYPE sentiment AS ENUM ('positive', 'negative', 'neutral');

-- ============================================================================
-- CORE IDENTITY TABLES
-- ============================================================================

-- Base authentication for all users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  account_type account_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

-- ============================================================================
-- BRAND ORGANIZATION TABLES
-- ============================================================================

-- The company/brand entity (supports multi-seat teams)
CREATE TABLE brand_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  organization_slug TEXT UNIQUE NOT NULL,
  company_logo TEXT,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  description TEXT,
  headquarters_location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  platform_fee_percentage DECIMAL(5,2) DEFAULT 12.50 NOT NULL,
  dynamic_pricing_enabled BOOLEAN DEFAULT false NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  billing_email TEXT,
  account_status account_status DEFAULT 'active' NOT NULL,
  activity_status activity_status DEFAULT 'onboarding' NOT NULL,
  onboarding_status brand_onboarding_status DEFAULT 'started' NOT NULL,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Users who work for/manage the brand (multi-seat support)
CREATE TABLE brand_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_organization_id UUID NOT NULL REFERENCES brand_organizations(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role brand_member_role DEFAULT 'member' NOT NULL,
  permissions JSONB,
  job_title TEXT,
  department TEXT,
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  invitation_status invitation_status DEFAULT 'pending' NOT NULL,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Financial account for each brand organization
CREATE TABLE brand_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_organization_id UUID UNIQUE NOT NULL REFERENCES brand_organizations(id) ON DELETE CASCADE,
  available_balance DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  pending_balance DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  total_deposited DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  total_spent DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  currency TEXT DEFAULT 'usd' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Payment and fee transactions for brands
CREATE TABLE brand_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_wallet_id UUID NOT NULL REFERENCES brand_wallet(id) ON DELETE CASCADE,
  brand_organization_id UUID NOT NULL REFERENCES brand_organizations(id) ON DELETE CASCADE,
  transaction_type brand_transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  creator_amount DECIMAL(12,2),
  platform_fee DECIMAL(12,2),
  balance_after DECIMAL(12,2) NOT NULL,
  related_contract_id UUID,
  related_payment_id UUID,
  stripe_payment_intent_id TEXT,
  description TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- CREATOR PROFILE TABLES
-- ============================================================================

-- Extended information for creator accounts
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_picture TEXT,
  cv_url TEXT,
  location TEXT,
  age INTEGER,
  gender TEXT,
  ethnicity TEXT,
  date_of_birth DATE,
  phone TEXT,
  university TEXT,
  current_job TEXT,
  languages_spoken TEXT[],
  stripe_account_id TEXT UNIQUE,
  average_rating DECIMAL(3,2),
  average_communication_rating DECIMAL(3,2),
  average_quality_rating DECIMAL(3,2),
  average_professionalism_rating DECIMAL(3,2),
  average_timeliness_rating DECIMAL(3,2),
  total_jobs_completed INTEGER DEFAULT 0 NOT NULL,
  total_jobs_active INTEGER DEFAULT 0 NOT NULL,
  account_status account_status DEFAULT 'active' NOT NULL,
  work_status work_status DEFAULT 'available' NOT NULL,
  onboarding_status creator_onboarding_status DEFAULT 'started' NOT NULL,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Job preferences and filters
CREATE TABLE creator_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID UNIQUE NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  willing_to_show_face willing_to_show_face DEFAULT 'yes' NOT NULL,
  preferred_content_types TEXT[],
  preferred_platforms TEXT[],
  account_preference account_preference DEFAULT 'any' NOT NULL,
  min_budget DECIMAL(10,2),
  preferred_industries TEXT[],
  preferred_campaign_duration TEXT,
  willing_to_travel BOOLEAN DEFAULT false NOT NULL,
  travel_locations TEXT[],
  requires_contract_review BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tags/categories for creator interests
CREATE TABLE creator_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  interest TEXT NOT NULL,
  proficiency_level proficiency_level,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Professional experiences
CREATE TABLE creator_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  source_type experience_source_type NOT NULL,
  source_id TEXT,
  title TEXT NOT NULL,
  company TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false NOT NULL,
  is_public BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  related_contract_id UUID,
  related_brand_id UUID,
  verified BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Financial account for each creator
CREATE TABLE creator_wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID UNIQUE NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  available_balance DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  pending_balance DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  total_earned DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  total_withdrawn DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  currency TEXT DEFAULT 'usd' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Transaction history for creator
CREATE TABLE creator_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet_id UUID NOT NULL REFERENCES creator_wallet(id) ON DELETE CASCADE,
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  transaction_type creator_transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  related_contract_id UUID,
  related_payment_id UUID,
  stripe_transfer_id TEXT,
  description TEXT,
  status transaction_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- SOCIAL MEDIA ACCOUNTS & POSTS
-- ============================================================================

-- Social media accounts
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  account_type social_account_type NOT NULL,
  job_id UUID,
  contract_id UUID,
  platform social_platform NOT NULL,
  username TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  account_status social_account_status DEFAULT 'active' NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  is_business_account BOOLEAN DEFAULT false NOT NULL,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(creator_profile_id, platform, username)
);

-- Periodic snapshots of account stats
CREATE TABLE social_account_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  tracked_at TIMESTAMPTZ NOT NULL,
  followers_count INTEGER,
  following_count INTEGER,
  posts_count INTEGER,
  avg_likes DECIMAL(10,2),
  avg_comments DECIMAL(10,2),
  avg_engagement_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Instagram-specific account information
CREATE TABLE instagram_account_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID UNIQUE NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  account_category TEXT,
  bio TEXT,
  website TEXT,
  profile_pic_url TEXT,
  is_private BOOLEAN DEFAULT false NOT NULL,
  engagement_rate DECIMAL(5,2),
  avg_likes_per_post INTEGER,
  avg_comments_per_post INTEGER,
  avg_story_views INTEGER,
  avg_reel_plays INTEGER,
  best_posting_time TEXT,
  audience_age_range JSONB,
  audience_gender JSONB,
  audience_top_locations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TikTok-specific account information
CREATE TABLE tiktok_account_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID UNIQUE NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  bio TEXT,
  profile_pic_url TEXT,
  is_private BOOLEAN DEFAULT false NOT NULL,
  total_likes BIGINT,
  avg_views_per_video INTEGER,
  avg_likes_per_video INTEGER,
  avg_comments_per_video INTEGER,
  avg_shares_per_video INTEGER,
  engagement_rate DECIMAL(5,2),
  best_posting_time TEXT,
  audience_age_range JSONB,
  audience_gender JSONB,
  audience_top_locations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- YouTube-specific account information
CREATE TABLE youtube_account_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID UNIQUE NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  channel_description TEXT,
  channel_banner_url TEXT,
  total_views BIGINT,
  total_subscribers INTEGER,
  total_videos INTEGER,
  avg_views_per_video INTEGER,
  avg_likes_per_video INTEGER,
  avg_comments_per_video INTEGER,
  avg_video_duration_seconds INTEGER,
  engagement_rate DECIMAL(5,2),
  audience_age_range JSONB,
  audience_gender JSONB,
  audience_top_locations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Individual social media posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  contract_id UUID,
  post_type post_type NOT NULL,
  platform social_platform NOT NULL,
  post_url TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  media_urls TEXT[],
  thumbnail_url TEXT,
  posted_at TIMESTAMPTZ NOT NULL,
  is_sponsored BOOLEAN DEFAULT false NOT NULL,
  status post_status DEFAULT 'published' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Time-series engagement data for each post
CREATE TABLE post_engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tracked_at TIMESTAMPTZ NOT NULL,
  views INTEGER,
  impressions INTEGER,
  reach INTEGER,
  likes INTEGER,
  comments INTEGER,
  shares INTEGER,
  saves INTEGER,
  engagement_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Individual comments on posts
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  commenter_username TEXT,
  comment_timestamp TIMESTAMPTZ,
  likes_count INTEGER,
  sentiment sentiment,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Posts that creators feature in their portfolio
CREATE TABLE creator_showcase_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  display_order INTEGER,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(creator_profile_id, post_id)
);

-- ============================================================================
-- JOB POSTING & APPLICATION TABLES
-- ============================================================================

-- Job postings
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_organization_id UUID NOT NULL REFERENCES brand_organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  job_slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  industry TEXT,
  content_guidelines TEXT,
  usage_rights TEXT,
  exclusivity_terms TEXT,
  budget_per_creator DECIMAL(10,2),
  total_budget DECIMAL(12,2),
  estimated_duration TEXT,
  start_date DATE,
  end_date DATE,
  status job_status DEFAULT 'draft' NOT NULL,
  visibility job_visibility DEFAULT 'public' NOT NULL,
  application_deadline TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Detailed requirements and filters for jobs
CREATE TABLE job_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  min_age INTEGER,
  max_age INTEGER,
  preferred_gender TEXT[],
  preferred_ethnicity TEXT[],
  preferred_locations TEXT[],
  platforms_required TEXT[],
  min_followers_instagram INTEGER,
  min_followers_tiktok INTEGER,
  min_followers_youtube INTEGER,
  min_engagement_rate DECIMAL(5,2),
  requires_verified_account BOOLEAN DEFAULT false NOT NULL,
  requires_business_account BOOLEAN DEFAULT false NOT NULL,
  content_types_needed TEXT[],
  requires_face_showing BOOLEAN DEFAULT false NOT NULL,
  account_type_needed TEXT DEFAULT 'any' NOT NULL,
  min_jobs_completed INTEGER,
  min_average_rating DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tags for job categorization
CREATE TABLE job_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(job_id, tag)
);

-- Creator applications to jobs
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  application_status application_status DEFAULT 'pending' NOT NULL,
  cover_letter TEXT,
  proposed_content_ideas TEXT,
  availability_start DATE,
  expected_completion_time TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(job_id, creator_profile_id)
);

-- ============================================================================
-- CONTRACT & PAYMENT TABLES
-- ============================================================================

-- Agreement between brand and creator for a job
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  brand_organization_id UUID NOT NULL REFERENCES brand_organizations(id) ON DELETE CASCADE,
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  contract_number TEXT UNIQUE NOT NULL,
  contract_title TEXT NOT NULL,
  description TEXT,
  deliverables_overview TEXT,
  total_payment DECIMAL(10,2) NOT NULL,
  payment_terms payment_terms DEFAULT 'per_post' NOT NULL,
  usage_rights TEXT,
  exclusivity_terms TEXT,
  start_date DATE,
  end_date DATE,
  status contract_status DEFAULT 'pending_creator' NOT NULL,
  signed_by_creator_at TIMESTAMPTZ,
  signed_by_brand_at TIMESTAMPTZ,
  signed_by_brand_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  terminated_at TIMESTAMPTZ,
  termination_reason TEXT,
  terminated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Individual deliverables within a contract
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  deliverable_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  deliverable_type deliverable_type NOT NULL,
  platform social_platform,
  payment_amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  submission_url TEXT,
  submitted_at TIMESTAMPTZ,
  status deliverable_status DEFAULT 'pending' NOT NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Revision history for deliverables
CREATE TABLE deliverable_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id UUID NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  submission_url TEXT,
  revision_notes TEXT,
  requested_by UUID REFERENCES users(id) ON DELETE SET NULL,
  requested_at TIMESTAMPTZ,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Payment releases within contracts
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  deliverable_id UUID REFERENCES deliverables(id) ON DELETE SET NULL,
  payment_number TEXT,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee_percentage DECIMAL(5,2) NOT NULL,
  platform_fee_amount DECIMAL(10,2) NOT NULL,
  brand_total_amount DECIMAL(10,2) NOT NULL,
  payment_type payment_type NOT NULL,
  status payment_status DEFAULT 'pending' NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  initiated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  initiated_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  failed_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add foreign key constraints for relationships that reference later tables
ALTER TABLE brand_transactions ADD CONSTRAINT fk_brand_transactions_contract
  FOREIGN KEY (related_contract_id) REFERENCES contracts(id) ON DELETE SET NULL;
ALTER TABLE brand_transactions ADD CONSTRAINT fk_brand_transactions_payment
  FOREIGN KEY (related_payment_id) REFERENCES payments(id) ON DELETE SET NULL;

ALTER TABLE creator_transactions ADD CONSTRAINT fk_creator_transactions_contract
  FOREIGN KEY (related_contract_id) REFERENCES contracts(id) ON DELETE SET NULL;
ALTER TABLE creator_transactions ADD CONSTRAINT fk_creator_transactions_payment
  FOREIGN KEY (related_payment_id) REFERENCES payments(id) ON DELETE SET NULL;

ALTER TABLE creator_experiences ADD CONSTRAINT fk_creator_experiences_contract
  FOREIGN KEY (related_contract_id) REFERENCES contracts(id) ON DELETE SET NULL;
ALTER TABLE creator_experiences ADD CONSTRAINT fk_creator_experiences_brand
  FOREIGN KEY (related_brand_id) REFERENCES brand_organizations(id) ON DELETE SET NULL;

ALTER TABLE social_accounts ADD CONSTRAINT fk_social_accounts_job
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;
ALTER TABLE social_accounts ADD CONSTRAINT fk_social_accounts_contract
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL;

ALTER TABLE posts ADD CONSTRAINT fk_posts_contract
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL;

-- ============================================================================
-- REVIEWS & RATINGS TABLES
-- ============================================================================

-- Reviews between brands and creators
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_type reviewee_type NOT NULL,
  reviewee_id UUID NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  review_text TEXT,
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  communication_notes TEXT,
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  professionalism_notes TEXT,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  quality_notes TEXT,
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  timeliness_notes TEXT,
  payment_timeliness_rating INTEGER CHECK (payment_timeliness_rating >= 1 AND payment_timeliness_rating <= 5),
  payment_timeliness_notes TEXT,
  clarity_rating INTEGER CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
  clarity_notes TEXT,
  would_work_again BOOLEAN,
  is_public BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(contract_id, reviewer_id)
);

-- ============================================================================
-- ANALYTICS TABLES
-- ============================================================================

-- Performance analytics for individual posts
CREATE TABLE post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID UNIQUE NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  total_views BIGINT DEFAULT 0 NOT NULL,
  total_impressions BIGINT DEFAULT 0 NOT NULL,
  total_reach BIGINT DEFAULT 0 NOT NULL,
  total_likes INTEGER DEFAULT 0 NOT NULL,
  total_comments INTEGER DEFAULT 0 NOT NULL,
  total_shares INTEGER DEFAULT 0 NOT NULL,
  total_saves INTEGER DEFAULT 0 NOT NULL,
  engagement_rate DECIMAL(5,2),
  sentiment_score DECIMAL(5,2),
  positive_comments_count INTEGER DEFAULT 0 NOT NULL,
  negative_comments_count INTEGER DEFAULT 0 NOT NULL,
  neutral_comments_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Aggregated analytics for entire contract
CREATE TABLE contract_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID UNIQUE NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  total_posts INTEGER DEFAULT 0 NOT NULL,
  total_deliverables INTEGER DEFAULT 0 NOT NULL,
  total_views BIGINT DEFAULT 0 NOT NULL,
  total_impressions BIGINT DEFAULT 0 NOT NULL,
  total_reach BIGINT DEFAULT 0 NOT NULL,
  total_engagement BIGINT DEFAULT 0 NOT NULL,
  average_engagement_rate DECIMAL(5,2),
  total_paid DECIMAL(10,2) DEFAULT 0 NOT NULL,
  platform_fee_collected DECIMAL(10,2) DEFAULT 0 NOT NULL,
  roi DECIMAL(10,2),
  cost_per_impression DECIMAL(8,4),
  cost_per_engagement DECIMAL(8,4),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Aggregated analytics for entire job/campaign
CREATE TABLE job_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  brand_organization_id UUID NOT NULL REFERENCES brand_organizations(id) ON DELETE CASCADE,
  total_applications INTEGER DEFAULT 0 NOT NULL,
  total_creators_hired INTEGER DEFAULT 0 NOT NULL,
  total_contracts_active INTEGER DEFAULT 0 NOT NULL,
  total_contracts_completed INTEGER DEFAULT 0 NOT NULL,
  total_posts INTEGER DEFAULT 0 NOT NULL,
  total_views BIGINT DEFAULT 0 NOT NULL,
  total_impressions BIGINT DEFAULT 0 NOT NULL,
  total_reach BIGINT DEFAULT 0 NOT NULL,
  total_engagement BIGINT DEFAULT 0 NOT NULL,
  average_engagement_rate DECIMAL(5,2),
  total_budget DECIMAL(12,2),
  total_spent DECIMAL(12,2) DEFAULT 0 NOT NULL,
  platform_fees_collected DECIMAL(10,2) DEFAULT 0 NOT NULL,
  roi DECIMAL(10,2),
  cost_per_impression DECIMAL(8,4),
  cost_per_engagement DECIMAL(8,4),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Analytics for creators over time periods
CREATE TABLE creator_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_applications INTEGER DEFAULT 0 NOT NULL,
  total_jobs_won INTEGER DEFAULT 0 NOT NULL,
  total_jobs_completed INTEGER DEFAULT 0 NOT NULL,
  application_success_rate DECIMAL(5,2),
  total_posts_created INTEGER DEFAULT 0 NOT NULL,
  total_views_generated BIGINT DEFAULT 0 NOT NULL,
  total_impressions BIGINT DEFAULT 0 NOT NULL,
  total_engagement BIGINT DEFAULT 0 NOT NULL,
  average_engagement_rate DECIMAL(5,2),
  total_earned_gross DECIMAL(10,2) DEFAULT 0 NOT NULL,
  total_earned_net DECIMAL(10,2) DEFAULT 0 NOT NULL,
  average_rating DECIMAL(3,2),
  total_reviews_received INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Analytics for brands over time periods
CREATE TABLE brand_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_organization_id UUID NOT NULL REFERENCES brand_organizations(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_jobs_posted INTEGER DEFAULT 0 NOT NULL,
  total_jobs_completed INTEGER DEFAULT 0 NOT NULL,
  total_creators_hired INTEGER DEFAULT 0 NOT NULL,
  unique_creators_worked_with INTEGER DEFAULT 0 NOT NULL,
  total_posts_published INTEGER DEFAULT 0 NOT NULL,
  total_views_generated BIGINT DEFAULT 0 NOT NULL,
  total_impressions BIGINT DEFAULT 0 NOT NULL,
  total_reach BIGINT DEFAULT 0 NOT NULL,
  total_engagement BIGINT DEFAULT 0 NOT NULL,
  average_engagement_rate DECIMAL(5,2),
  total_spent DECIMAL(12,2) DEFAULT 0 NOT NULL,
  platform_fees_paid DECIMAL(10,2) DEFAULT 0 NOT NULL,
  roi DECIMAL(10,2),
  cost_per_impression DECIMAL(8,4),
  cost_per_engagement DECIMAL(8,4),
  average_creator_rating DECIMAL(3,2),
  average_payment_timeliness_rating DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- MESSAGING TABLES
-- ============================================================================

-- Conversations between users
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  status conversation_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_message_at TIMESTAMPTZ
);

-- Participants in conversations
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role participant_role NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_read_at TIMESTAMPTZ
);

-- Individual messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT,
  attachment_url TEXT,
  attachment_type TEXT,
  is_system_message BOOLEAN DEFAULT false NOT NULL,
  read_by JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- NOTIFICATION TABLE
-- ============================================================================

-- User notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_organizations_updated_at BEFORE UPDATE ON brand_organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_members_updated_at BEFORE UPDATE ON brand_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_wallet_updated_at BEFORE UPDATE ON brand_wallet
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_preferences_updated_at BEFORE UPDATE ON creator_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_experiences_updated_at BEFORE UPDATE ON creator_experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_wallet_updated_at BEFORE UPDATE ON creator_wallet
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_account_details_updated_at BEFORE UPDATE ON instagram_account_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tiktok_account_details_updated_at BEFORE UPDATE ON tiktok_account_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_youtube_account_details_updated_at BEFORE UPDATE ON youtube_account_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_requirements_updated_at BEFORE UPDATE ON job_requirements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_analytics_updated_at BEFORE UPDATE ON post_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_analytics_updated_at BEFORE UPDATE ON contract_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_analytics_updated_at BEFORE UPDATE ON job_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

